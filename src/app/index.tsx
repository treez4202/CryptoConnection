import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const NEWS = [
  { id: '1', title: 'Bitcoin holds steady as ETF inflows continue', source: 'CryptoPanic' },
  { id: '2', title: 'Ethereum upgrade scheduled for next month', source: 'CoinDesk' },
  { id: '3', title: 'Solana DEX volume hits all-time high', source: 'The Block' },
];

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crypto Connection</Text>
      <Text style={styles.tagline}>Your crypto command center</Text>

      <Text style={styles.sectionTitle}>Latest News</Text>
      {NEWS.map((item) => (
        <View key={item.id} style={styles.newsCard}>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsSource}>{item.source}</Text>
        </View>
      ))}

      <Pressable style={styles.button} onPress={() => router.push('/news')}>
        <Text style={styles.buttonText}>Open News Hub →</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.buttonSecondary]} onPress={() => router.push('/markets')}>
        <Text style={styles.buttonText}>View Markets →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b16', padding: 20 },
  title: { color: '#FFD700', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 40, marginBottom: 8 },
  tagline: { color: '#888', fontSize: 16, textAlign: 'center', marginBottom: 32 },
  sectionTitle: { color: '#FFD700', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  newsCard: { backgroundColor: '#1a1a2e', padding: 16, borderRadius: 8, marginBottom: 12 },
  newsTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  newsSource: { color: '#888', fontSize: 14 },
  button: { backgroundColor: '#FFD700', padding: 16, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  buttonSecondary: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#FFD700' },
  buttonText: { color: '#0b0b16', fontSize: 16, fontWeight: 'bold' },
});
