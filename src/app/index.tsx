import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function formatUSD(n: number) {
  const [dollars, cents] = n.toFixed(2).split('.');
  const withCommas = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '$' + withCommas + '.' + cents;
}

export default function Index() {
  const [btc, setBtc] = useState('Loading...');
  const [btcChange, setBtcChange] = useState(0);
  const [eth, setEth] = useState('Loading...');
  const [ethChange, setEthChange] = useState(0);
  const [sol, setSol] = useState('Loading...');
  const [solChange, setSolChange] = useState(0);
  const [updated, setUpdated] = useState('');

  useEffect(() => {
    async function getPrices() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();
        setBtc(formatUSD(data.bitcoin.usd));
        setBtcChange(data.bitcoin.usd_24h_change);
        setEth(formatUSD(data.ethereum.usd));
        setEthChange(data.ethereum.usd_24h_change);
        setSol(formatUSD(data.solana.usd));
        setSolChange(data.solana.usd_24h_change);
        setUpdated(new Date().toLocaleTimeString());
      } catch (e) {
        setBtc('Failed to load');
      }
    }
    getPrices();
    const timer = setInterval(getPrices, 10000);
    return () => clearInterval(timer);
  }, []);

  const changeStyle = (change: number) => ({
    fontSize: 16,
    marginBottom: 12,
    color: change >= 0 ? '#00ff88' : '#ff4444',
  });

  const fmtChange = (c: number) => (c >= 0 ? '+' : '') + c.toFixed(2) + '%';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crypto Connection</Text>
      <Text style={styles.price}>BTC: {btc}</Text>
      <Text style={changeStyle(btcChange)}>{fmtChange(btcChange)} (24h)</Text>
      <Text style={styles.price}>ETH: {eth}</Text>
      <Text style={changeStyle(ethChange)}>{fmtChange(ethChange)} (24h)</Text>
      <Text style={styles.price}>SOL: {sol}</Text>
      <Text style={changeStyle(solChange)}>{fmtChange(solChange)} (24h)</Text>
      <Text style={styles.updated}>Updated: {updated}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0b16' },
  title: { color: '#FFD700', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  price: { color: '#fff', fontSize: 24, marginTop: 8 },
  updated: { color: '#888', fontSize: 14, marginTop: 24 },
});
