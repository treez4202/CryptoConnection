import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function formatUSD(n: number) {
  const [dollars, cents] = n.toFixed(2).split('.');
  const withCommas = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '$' + withCommas + '.' + cents;
}

export default function Index() {
  const [btc, setBtc] = useState('Loading...');
  const [eth, setEth] = useState('Loading...');
  const [sol, setSol] = useState('Loading...');

  useEffect(() => {
    async function getPrices() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
        const data = await res.json();
        setBtc(formatUSD(data.bitcoin.usd));
        setEth(formatUSD(data.ethereum.usd));
        setSol(formatUSD(data.solana.usd));
      } catch (e) {
        setBtc('Failed to load');
      }
    }
    getPrices();
    const timer = setInterval(getPrices, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crypto Connection</Text>
      <Text style={styles.price}>BTC: {btc}</Text>
      <Text style={styles.price}>ETH: {eth}</Text>
      <Text style={styles.price}>SOL: {sol}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0b16' },
  title: { color: '#FFD700', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  price: { color: '#fff', fontSize: 24, marginBottom: 8 },
});
