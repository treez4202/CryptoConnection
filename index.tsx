import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function formatUSD(n: number) {
  const [dollars, cents] = n.toFixed(2).split('.');
  const withCommas = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '$' + withCommas + '.' + cents;
}

export default function Index() {
  const [price, setPrice] = useState('Loading...');

  useEffect(() => {
    async function getPrice() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await res.json();
        setPrice(formatUSD(data.bitcoin.usd));
      } catch (e) {
        setPrice('Failed to load');
      }
    }
    getPrice();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crypto Connection TEST</Text>
      <Text style={styles.price}>BTC: {price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0b16' },
  title: { color: '#FFD700', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  price: { color: '#fff', fontSize: 24 },
});
