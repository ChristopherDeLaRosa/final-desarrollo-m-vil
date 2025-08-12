// screens/NewsDetailScreen.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function NewsDetailScreen({ route, navigation }) {
  // viene como { id, title, summary, content, image, date, createdAt? }
  const { news } = route.params;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: news.title,
        message: `${news.title}\n\n${news.summary || ''}\n\nVía: App Ministerio de Medio Ambiente RD`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Noticia</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {!!news.image && <Image source={{ uri: news.image }} style={styles.heroImage} />}

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.newsDate}>{formatDate(news.date)}</Text>
        </View>

        <Title style={styles.newsTitle}>{news.title}</Title>

        {!!news.summary && (
          <Paragraph style={styles.newsSummary}>
            {news.summary}
          </Paragraph>
        )}

        <Card style={styles.contentCard}>
          <Card.Content>
            <Paragraph style={styles.newsContent}>
              {news.content || 'Sin contenido disponible.'}
            </Paragraph>
          </Card.Content>
        </Card>

        <View style={styles.actionButtons}>
          <Button mode="outlined" onPress={handleShare} icon="share" style={styles.actionButton}>
            Compartir
          </Button>
          <Button mode="contained" onPress={() => navigation.goBack()} buttonColor="#2E7D32" style={styles.actionButton}>
            Volver
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 5 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  shareButton: { padding: 5 },
  heroImage: { width: '100%', height: 250, resizeMode: 'cover' },
  content: { padding: 15 },
  metaRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  newsDate: { fontSize: 12, color: '#666' },
  newsTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10, lineHeight: 30 },
  newsSummary: {
    fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 16, fontStyle: 'italic',
  },
  contentCard: { elevation: 3, marginBottom: 20, borderRadius: 12 },
  newsContent: { fontSize: 16, lineHeight: 24, color: '#333', textAlign: 'justify' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  actionButton: { flex: 1 },
});
