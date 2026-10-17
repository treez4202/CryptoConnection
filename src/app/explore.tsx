import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, Linking } from 'react-native';

const RSS_URL = 'https://www.coindesk.com/arc/outboundfeeds/rss/';
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  enclosure: { link: string };
};

function getImage(item: NewsItem): string | null {
  const raw = item.enclosure?.link || item.thumbnail || null;
  return raw ? raw.replace(/&amp;/g, '&') : null;
}

export default function NewsHub() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function getNews() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.status === 'ok') {
          setNews(data.items.slice(0, 20));
        }
      } catch (e) {
        console.log('Failed to load news');
      }
    }
    getNews();
  }, []);

  const renderItem = ({ item }: { item: NewsItem }) => {
    const img = getImage(item);
    return (
      <Pressable onPress={() => Linking.openURL(item.link)}>
        <View style={styles.card}>
          {img ? (
            <Image source={{ uri: img }} style={styles.image} />
          ) : null}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{new Date(item.pubDate).toLocaleDateString()}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crypto News</Text>
      <FlatList
        data={news}
        keyExtractor={(item, index) => item.link || String(index)}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b16', paddingTop: 60 },
  header: { color: '#FFD700', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  list: { flex: 1 },
  card: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  textContainer: { flex: 1, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  date: { color: '#888', fontSize: 12 },
});
