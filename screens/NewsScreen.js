import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image,
} from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { apiClient, API_ENDPOINTS } from '../config/api';

export default function NewsScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get(API_ENDPOINTS.NOTICIAS);
      // API: [{ id, titulo, resumen, contenido, imagen, fecha, fecha_creacion }]
      const normalized = (Array.isArray(data) ? data : []).map(n => ({
        id: n.id,
        title: n.titulo,
        summary: n.resumen,
        content: n.contenido,
        image: n.imagen,
        date: n.fecha,
        createdAt: n.fecha_creacion
      }));
      setNews(normalized);
    } catch (e) {
      console.error('Error fetching news:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando noticias...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Noticias Ambientales</Text>
      </View>

      <View style={styles.content}>
        {news.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay noticias disponibles por el momento.</Text>
          </View>
        ) : (
          news.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('NewsDetail', { news: item })}
              activeOpacity={0.7}
            >
              <Card style={styles.newsCard}>
                {!!item.image && <Image source={{ uri: item.image }} style={styles.newsImage} />}
                <Card.Content style={styles.newsContent}>
                  <View style={styles.newsHeader}>
                    <Text style={styles.newsDate}>{formatDate(item.date)}</Text>
                  </View>

                  <Title style={styles.newsTitle}>{item.title}</Title>
                  {!!item.summary && <Paragraph style={styles.newsSummary}>{item.summary}</Paragraph>}
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: { backgroundColor: '#2E7D32', padding: 20, alignItems: 'center', marginTop: 40 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 15 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#666' },
  newsCard: { marginBottom: 20, elevation: 3, borderRadius: 12, overflow: 'hidden' },
  newsImage: { width: '100%', height: 200, resizeMode: 'cover' },
  newsContent: { padding: 15 },
  newsHeader: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  newsDate: { fontSize: 12, color: '#666' },
  newsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8, lineHeight: 24 },
  newsSummary: { fontSize: 14, color: '#666', lineHeight: 20 },
});
