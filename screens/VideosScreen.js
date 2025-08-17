import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Alert,
  Image
} from 'react-native'
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Button,
  Chip
} from 'react-native-paper'
import { Video } from 'expo-av'
import { apiClient, API_ENDPOINTS } from '../config/api'

export default function VideosScreen() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [categoria, setCategoria] = useState('') // filtro
  const [categoriaList, setCategoriaList] = useState([]) // para chips dinámicos

  useEffect(() => {
    fetchVideos()
  }, [categoria])

  const isStreamable = (url = '') =>
    /\.(mp4|m4v|mov|m3u8|webm|avi)$/i.test(url.split('?')[0])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const qs = categoria
        ? `${API_ENDPOINTS.VIDEOS}?categoria=${encodeURIComponent(categoria)}`
        : API_ENDPOINTS.VIDEOS
      const data = await apiClient.get(qs)
      // API: [{ id, titulo, descripcion, url, thumbnail, categoria, duracion, fecha_creacion }]
      const list = (Array.isArray(data) ? data : []).map((v, i) => ({
        id: i,
        title: v.titulo,
        description: v.descripcion,
        url: v.url,
        thumbnail: v.thumbnail,
        category: v.categoria,
        duration: v.duracion,
        date: v.fecha_creacion
      }))
      setVideos(list)

      // chips de categorías (a partir de resultados actuales)
      const cats = Array.from(
        new Set(list.map((v) => v.category).filter(Boolean))
      )
      setCategoriaList(cats)
    } catch (error) {
      console.error('Error fetching videos:', error)
      Alert.alert('Error', error.message || 'No se pudieron cargar los videos.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchVideos()
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category = '') => {
    const c = category.toLowerCase()
    if (c.includes('recicla')) return '#388E3C'
    if (c.includes('ecosistema')) return '#2E7D32'
    if (c.includes('biodiver')) return '#1976D2'
    if (c.includes('energ')) return '#F57C00'
    if (c.includes('agua') || c.includes('hídr')) return '#0097A7'
    return '#666'
  }

  const openVideoExternal = (url, title) => {
    Alert.alert(
      'Abrir Video',
      `¿Deseas ver "${title}" en tu reproductor o navegador?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir', onPress: () => Linking.openURL(url) }
      ]
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size='large'
          color='#2E7D32'
        />
        <Text style={styles.loadingText}>Cargando videos...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Videos Educativos</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Aprende sobre medio ambiente con nuestros videos educativos
        </Text>

        {/* Filtro por categoría */}
        <View style={styles.filters}>
          <View style={styles.catsRow}>
            <Chip
              selected={!categoria}
              onPress={() => setCategoria('')}
              style={[
                styles.catChip,
                !categoria ? { backgroundColor: '#2E7D32' } : {}
              ]}
              textStyle={{
                color: !categoria ? '#fff' : '#333',
                fontWeight: 'bold'
              }}
            >
              Todas
            </Chip>
            {categoriaList.map((cat) => (
              <Chip
                key={cat}
                selected={categoria === cat}
                onPress={() => setCategoria(cat)}
                style={[
                  styles.catChip,
                  categoria === cat
                    ? { backgroundColor: getCategoryColor(cat) }
                    : {}
                ]}
                textStyle={{
                  color: categoria === cat ? '#fff' : '#333',
                  fontWeight: 'bold'
                }}
              >
                {cat}
              </Chip>
            ))}
          </View>
        </View>

        {videos.map((video) => (
          <Card
            key={video.id}
            style={styles.videoCard}
          >
            <View style={styles.videoThumbContainer}>
              {isStreamable(video.url) ? (
                <Video
                  source={{ uri: video.url }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={true}
                  resizeMode='cover'
                  shouldPlay={false}
                  isLooping={false}
                  style={styles.videoThumb}
                  useNativeControls
                />
              ) : (
                <TouchableOpacity
                  onPress={() => openVideoExternal(video.url, video.title)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.videoThumb}
                  />
                  <View style={styles.playOverlay}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                </TouchableOpacity>
              )}

              {!!video.duration && (
                <View style={styles.videoDuration}>
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>
              )}
            </View>

            <Card.Content style={styles.videoContent}>
              <View style={styles.videoHeader}>
                <Chip
                  style={[
                    styles.categoryChip,
                    { backgroundColor: getCategoryColor(video.category) }
                  ]}
                  textStyle={styles.categoryText}
                >
                  {video.category}
                </Chip>
                <Text style={styles.videoDate}>{formatDate(video.date)}</Text>
              </View>

              <Title style={styles.videoTitle}>{video.title}</Title>
              {!!video.description && (
                <Paragraph style={styles.videoDescription}>
                  {video.description}
                </Paragraph>
              )}

              <View style={styles.videoFooter}>
                <Button
                  mode='contained'
                  onPress={() => openVideoExternal(video.url, video.title)}
                  buttonColor='#2E7D32'
                  compact
                >
                  Ver Video
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center'
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 15 },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
    lineHeight: 22
  },

  filters: { marginBottom: 12 },
  catsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { height: 32 },

  videoCard: {
    marginBottom: 20,
    elevation: 3,
    borderRadius: 12,
    overflow: 'hidden'
  },
  videoThumbContainer: { position: 'relative', height: 200 },
  videoThumb: { width: '100%', height: '100%' },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  playIcon: { color: 'white', fontSize: 48, fontWeight: 'bold' },
  videoDuration: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  durationText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  videoContent: { padding: 15 },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  categoryChip: { height: 32 },
  categoryText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  videoDate: { fontSize: 12, color: '#666' },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10
  },
  videoFooter: { flexDirection: 'row', justifyContent: 'flex-end' }
})
