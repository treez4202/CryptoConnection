import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

function formatUSD(n: number) {
  if (!n) return '$0.00';
  const [dollars, cents] = n.toFixed(2).split('.');
  const withCommas = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '$' + withCommas + '.' + cents;
}

const TIMEFRAMES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 },
];

export default function CoinDetail() {
  const { id } = useLocalSearchParams();
  const [coin, setCoin] = useState<any>(null);
  const [prices, setPrices] = useState<number[]>([]);
  const [days, setDays] = useState(7);
  const [live, setLive] = useState(true);
  const [now, setNow] = useState(new Date());

  // Ticking clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function getCoin() {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const data = await res.json();
        setCoin(data);
      } catch (e) {
        console.log('Failed to load coin');
      }
    }
    getCoin();
  }, [id]);

  useEffect(() => {
    async function getChart() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
        );
        const data = await res.json();
        const priceList = data.prices.map((p: number[]) => p[1]);
        const step = Math.max(1, Math.floor(priceList.length / 100));
        setPrices(priceList.filter((_: number, i: number) => i % step === 0));
      } catch (e) {
        console.log('Failed to load chart');
      }
    }
    getChart();
  }, [id, days]);

  // Live ticking: append fresh price every 10s
  useEffect(() => {
    if (!live) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
        );
        const data = await res.json();
        const livePrice = data[id as string]?.usd;
        if (livePrice) {
          setPrices((prev) => [...prev.slice(-119), livePrice]);
        }
      } catch (e) {
        // silent: chart just pauses
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [id, live]);

  if (!coin) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const price = coin.market_data?.current_price?.usd || 0;
  const change24h = coin.market_data?.price_change_percentage_24h || 0;
  const marketCap = coin.market_data?.market_cap?.usd || 0;
  const changeColor = change24h >= 0 ? '#00ff88' : '#ff4444';
  const description = coin.description?.en?.split('. ').slice(0, 2).join('. ') + '.' || 'No description available.';

  // Stock market hours: 9:30 AM - 4:00 PM Eastern, Mon-Fri
  function isMarketOpen(date: Date): boolean {
    const et = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = et.getDay();
    if (day === 0 || day === 6) return false; // weekend
    const mins = et.getHours() * 60 + et.getMinutes();
    return mins >= 9 * 60 + 30 && mins < 16 * 60;
  }

  const marketOpen = isMarketOpen(now);
  const clockColor = marketOpen ? '#FFD700' : '#9D4EDD';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{coin.name}</Text>
      <Text style={styles.symbol}>{coin.symbol?.toUpperCase()}</Text>
      <Text style={[styles.marketStatus, { color: clockColor }]}>
        {marketOpen ? 'Market Open' : 'Market Closed'}
      </Text>
      <Text style={[styles.clock, { color: clockColor }]}>🕐 {now.toLocaleTimeString()}</Text>
      <Text style={styles.price}>{formatUSD(price)}</Text>
      <Text style={[styles.change, { color: changeColor }]}>
        {(change24h >= 0 ? '+' : '') + change24h.toFixed(2) + '% (24h)'}
      </Text>

      <View style={styles.tfRow}>
        {TIMEFRAMES.map((tf) => (
          <Pressable
            key={tf.label}
            style={[styles.tfButton, days === tf.days && styles.tfActive]}
            onPress={() => setDays(tf.days)}
          >
            <Text style={[styles.tfText, days === tf.days && styles.tfTextActive]}>{tf.label}</Text>
          </Pressable>
        ))}
        <Pressable
          style={[styles.tfButton, live && styles.liveActive]}
          onPress={() => setLive(!live)}
        >
          <Text style={[styles.tfText, live && styles.tfTextActive]}>{live ? '● LIVE' : '○ LIVE'}</Text>
        </Pressable>
      </View>

      {prices.length > 0 && (
        <LineChart
          data={{ labels: [], datasets: [{ data: prices }] }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#0b0b16',
            backgroundGradientFrom: '#0b0b16',
            backgroundGradientTo: '#0b0b16',
            color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
            propsForDots: { r: '0' },
          }}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
        />
      )}

      <Text style={styles.label}>Market Cap</Text>
      <Text style={styles.value}>{formatUSD(marketCap)}</Text>
      <Text style={styles.label}>About</Text>
      <Text style={styles.description}>{description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b16', padding: 20 },
  loading: { color: '#fff', fontSize: 18, textAlign: 'center', marginTop: 50 },
  name: { color: '#FFD700', fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  symbol: { color: '#888', fontSize: 18, marginBottom: 8 },
  clock: { fontSize: 16, marginBottom: 8, fontVariant: ['tabular-nums'] },
  marketStatus: { fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  price: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  change: { fontSize: 18, marginBottom: 16 },
  tfRow: { flexDirection: 'row', marginBottom: 12, gap: 8, flexWrap: 'wrap' },
  tfButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#1a1a2e' },
  tfActive: { backgroundColor: '#FFD700' },
  liveActive: { backgroundColor: '#00ff88' },
  tfText: { color: '#888', fontWeight: 'bold' },
  tfTextActive: { color: '#0b0b16' },
  chart: { borderRadius: 8, marginBottom: 8 },
  label: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  value: { color: '#fff', fontSize: 18 },
  description: { color: '#ccc', fontSize: 16, lineHeight: 24, marginBottom: 40 },
});
