import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

function formatUSD(n: number) {
  const [dollars, cents] = n.toFixed(2).split('.');
  const withCommas = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '$' + withCommas + '.' + cents;
}

type Coin = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
};

export default function Markets() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [updated, setUpdated] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function getPrices() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=24h');
        const data = await res.json();
        setCoins(data);
        setUpdated(new Date().toLocaleTimeString());
      } catch (e) {
        console.log('Failed to load');
      }
    }
    getPrices();
    const timer = setInterval(getPrices, 30000);
    return () => clearInterval(timer);
  }, []);

  const renderCoin = ({ item }: { item: Coin }) => {
    const change = item.price_change_percentage_24h || 0;
    const changeColor = change >= 0 ? '#00ff88' : '#ff4444';
    const changeText = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';

    return (
      <Pressable onPress={() => router.push(`/${item.id}`)}>
        <View style={styles.row}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.symbol}>{item.symbol.toUpperCase()}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.price}>{formatUSD(item.current_price)}</Text>
            <Text style={{ color: changeColor, fontSize: 14 }}>{changeText}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Markets</Text>
      <Text style={styles.subtitle}>Top 10 by Market Cap</Text>
      <FlatList
        data={coins}
        keyExtractor={(item) => item.id}
        renderItem={renderCoin}
        style={styles.list}
      />
      <Text style={styles.updated}>Updated: {updated}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b16', paddingTop: 60 },
  title: { color: '#FFD700', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  list: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  symbol: { color: '#888', fontSize: 14 },
  right: { alignItems: 'flex-end' },
  price: { color: '#fff', fontSize: 18 },
  updated: { color: '#888', fontSize: 14, textAlign: 'center', padding: 16 },
});
