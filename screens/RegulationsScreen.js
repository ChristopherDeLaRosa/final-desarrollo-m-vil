// screens/RegulationsScreen.jsx
import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native'
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Chip,
  Button,
  TextInput
} from 'react-native-paper'
import { AuthContext } from '../App'
import { apiClient, API_ENDPOINTS } from '../config/api'

export default function RegulationsScreen({ navigation }) {
  const [regulations, setRegulations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [tipo, setTipo] = useState('') // Ley | Decreto | Resolución | Norma | ''
  const { isLoggedIn, user } = useContext(AuthContext)

  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert(
        'Acceso Restringido',
        'Debes iniciar sesión para ver las normativas ambientales.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      )
      return
    }
    fetchRegulations()
  }, [isLoggedIn, tipo])

  const buildQuery = () => {
    const params = new URLSearchParams()
    if (tipo) params.append('tipo', tipo)
    if (search.trim()) params.append('busqueda', search.trim())
    const qs = params.toString()
    return qs ? `${API_ENDPOINTS.NORMATIVAS}?${qs}` : API_ENDPOINTS.NORMATIVAS
  }

  const normalize = (r) => ({
    id: r.id,
    title: r.titulo,
    type: r.tipo, // Ley / Decreto / Resolución / Norma
    number: r.numero,
    description: r.descripcion,
    date: r.fecha_publicacion,
    downloadUrl: r.url_documento,
    createdAt: r.fecha_creacion,
    raw: r
  })

  const fetchRegulations = async () => {
    try {
      setLoading(true)
      const endpoint = buildQuery()
      const data = await apiClient.get(endpoint, user?.token)
      const list = (Array.isArray(data) ? data : []).map(normalize)
      setRegulations(list)
    } catch (error) {
      console.error('Error fetching regulations:', error)
      if ((error.message || '').includes('401')) {
        Alert.alert('Sesión expirada', 'Vuelve a iniciar sesión.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ])
      } else {
        Alert.alert(
          'Error',
          error.message || 'No se pudieron cargar las normativas.'
        )
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchRegulations()
  }

  const getTypeColor = (type) => {
    const colors = {
      Ley: '#1976D2',
      Decreto: '#388E3C',
      Resolución: '#F57C00',
      Norma: '#7B1FA2'
    }
    return colors[type] || '#666'
  }

  const handleDownload = (url, title) => {
    if (!url) {
      Alert.alert(
        'Sin documento',
        'Esta normativa no tiene enlace de descarga.'
      )
      return
    }
    Alert.alert('Descargar Documento', `¿Deseas descargar "${title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Descargar', onPress: () => Linking.openURL(url) }
    ])
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.loginPromptContainer}>
        <Text style={styles.loginPromptText}>
          Debes iniciar sesión para acceder a las normativas ambientales.
        </Text>
        <Button
          mode='contained'
          onPress={() => navigation.navigate('Login')}
          buttonColor='#2E7D32'
        >
          Iniciar Sesión
        </Button>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size='large'
          color='#2E7D32'
        />
        <Text style={styles.loadingText}>Cargando normativas...</Text>
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
      keyboardShouldPersistTaps='handled'
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Normativas Ambientales</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Marco legal y regulatorio para la protección del medio ambiente en
          República Dominicana
        </Text>

        {/* Filtros */}
        <View style={styles.filters}>
          <TextInput
            mode='outlined'
            value={search}
            onChangeText={setSearch}
            placeholder='Buscar por título o descripción'
            style={styles.searchInput}
            right={
              <TextInput.Icon
                icon='magnify'
                onPress={fetchRegulations}
              />
            }
            onSubmitEditing={fetchRegulations}
          />
          <View style={styles.tipoChips}>
            {['', 'Ley', 'Decreto', 'Resolución', 'Norma'].map((t) => (
              <Chip
                key={t || 'todos'}
                selected={tipo === t}
                onPress={() => setTipo((prev) => (prev === t ? '' : t))}
                style={[
                  styles.tipoChip,
                  t
                    ? { backgroundColor: tipo === t ? getTypeColor(t) : '#eee' }
                    : {}
                ]}
                textStyle={{
                  color: t && tipo === t ? '#fff' : '#333',
                  fontWeight: 'bold'
                }}
              >
                {t || 'Todos'}
              </Chip>
            ))}
          </View>
        </View>

        {/* Lista */}
        {regulations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No se encontraron normativas con los filtros actuales.
            </Text>
            <Button
              mode='outlined'
              onPress={() => {
                setSearch('')
                setTipo('')
                fetchRegulations()
              }}
            >
              Limpiar filtros
            </Button>
          </View>
        ) : (
          regulations.map((reg) => (
            <Card
              key={reg.id}
              style={styles.regulationCard}
            >
              <Card.Content style={styles.regulationContent}>
                <View style={styles.regulationHeader}>
                  <View style={styles.chipsContainer}>
                    <Chip
                      style={[
                        styles.typeChip,
                        { backgroundColor: getTypeColor(reg.type) }
                      ]}
                      textStyle={styles.chipText}
                    >
                      {reg.type || '—'}
                    </Chip>
                    {reg.number ? (
                      <Chip
                        style={styles.numberChip}
                        textStyle={styles.numberChipText}
                      >
                        N.º {reg.number}
                      </Chip>
                    ) : null}
                  </View>
                </View>

                <Title style={styles.regulationTitle}>{reg.title}</Title>
                {reg.description ? (
                  <Paragraph style={styles.regulationDescription}>
                    {reg.description}
                  </Paragraph>
                ) : null}

                <View style={styles.regulationDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      Fecha de publicación:
                    </Text>
                    <Text style={styles.detailValue}>
                      {formatDate(reg.date)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fecha de registro:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(reg.createdAt)}
                    </Text>
                  </View>
                </View>

                <Button
                  mode='contained'
                  onPress={() => handleDownload(reg.downloadUrl, reg.title)}
                  buttonColor='#2E7D32'
                  icon='download'
                  style={styles.downloadButton}
                >
                  Descargar Documento
                </Button>
              </Card.Content>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  loginPromptText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: { backgroundColor: '#2E7D32', padding: 20, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 15 },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
    lineHeight: 22
  },

  // filtros
  filters: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2
  },
  searchInput: { marginBottom: 10 },
  tipoChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tipoChip: { height: 32 },

  // lista
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  emptyText: { fontSize: 14, color: '#666', marginBottom: 10 },

  regulationCard: { marginBottom: 16, elevation: 3, borderRadius: 12 },
  regulationContent: { padding: 15 },
  regulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  chipsContainer: { flexDirection: 'row', gap: 8, flex: 1, flexWrap: 'wrap' },
  typeChip: { height: 32, alignSelf: 'flex-start' },
  chipText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  numberChip: {
    height: 28,
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start'
  },
  numberChipText: { color: '#333', fontSize: 11, fontWeight: 'bold' },

  regulationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    lineHeight: 22
  },
  regulationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12
  },

  regulationDetails: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  detailLabel: { fontSize: 12, color: '#666', fontWeight: 'bold', flex: 1 },
  detailValue: { fontSize: 12, color: '#333', textAlign: 'right' },

  downloadButton: { paddingVertical: 5 }
})
