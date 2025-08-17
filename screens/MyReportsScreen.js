// screens/MyReportsScreen.jsx
import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native'
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Chip,
  Button
} from 'react-native-paper'
import { AuthContext } from '../App'
import { apiClient, API_ENDPOINTS } from '../config/api'

export default function MyReportsScreen({ navigation }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { isLoggedIn, user } = useContext(AuthContext)

  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert(
        'Acceso Restringido',
        'Debes iniciar sesión para ver tus reportes.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      )
      return
    }
    fetchReports()
  }, [isLoggedIn])

  const mapEstadoToLabel = (estadoRaw) => {
    const v = (estadoRaw || '').toString().toLowerCase()
    if (v.includes('revision')) return 'En Revisión'
    if (v.includes('proceso')) return 'En Proceso'
    if (v.includes('resuelto')) return 'Resuelto'
    if (v.includes('rechaz')) return 'Rechazado'
    return 'Pendiente'
  }

  const getStatusColor = (status) => {
    const colors = {
      Pendiente: '#9E9E9E',
      'En Revisión': '#FF9800',
      'En Proceso': '#2196F3',
      Resuelto: '#4CAF50',
      Rechazado: '#F44336'
    }
    return colors[status] || '#666'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get(API_ENDPOINTS.REPORTES, user?.token)
      const normalized = (Array.isArray(data) ? data : []).map((r) => ({
        id: r.id,
        code: r.codigo,
        title: r.titulo,
        description: r.descripcion,
        status: mapEstadoToLabel(r.estado),
        priority: null,
        date: r.fecha,
        latitude: r.latitud,
        longitude: r.longitud,
        photo: r.foto,
        comment: r.comentario_ministerio || null,
        assignedTo: null,
        raw: r
      }))
      setReports(normalized)
    } catch (error) {
      console.error('Error fetching reports:', error)
      if ((error.message || '').includes('401')) {
        Alert.alert('Sesión expirada', 'Vuelve a iniciar sesión.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ])
      } else {
        Alert.alert(
          'Error',
          error.message || 'No se pudieron cargar los reportes.'
        )
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchReports()
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.loginPromptContainer}>
        <Text style={styles.loginPromptText}>
          Debes iniciar sesión para ver tus reportes.
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
        <Text style={styles.loadingText}>Cargando tus reportes...</Text>
      </View>
    )
  }

  const enProcesoCount = reports.filter(
    (r) => r.status === 'En Proceso' || r.status === 'En Revisión'
  ).length
  const resueltosCount = reports.filter((r) => r.status === 'Resuelto').length

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
        <Text style={styles.headerTitle}>Mis Reportes</Text>
      </View>

      <View style={styles.content}>
        {reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No tienes reportes registrados.{'\n'}
              ¡Ayúdanos a proteger el medio ambiente reportando daños
              ambientales!
            </Text>
            <Button
              mode='contained'
              onPress={() => navigation.navigate('ReportDamage')}
              buttonColor='#d32f2f'
              style={styles.newReportButton}
              icon='plus'
            >
              Crear Primer Reporte
            </Button>
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{reports.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#FF9800' }]}>
                  {enProcesoCount}
                </Text>
                <Text style={styles.statLabel}>En Proceso</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
                  {resueltosCount}
                </Text>
                <Text style={styles.statLabel}>Resueltos</Text>
              </View>
            </View>

            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                onPress={() => navigation.navigate('ReportDetail', { report })}
                activeOpacity={0.7}
              >
                <Card style={styles.reportCard}>
                  <Card.Content style={styles.reportContent}>
                    <View style={styles.reportHeader}>
                      <View style={styles.chipsContainer}>
                        <Chip
                          style={[
                            styles.statusChip,
                            { backgroundColor: getStatusColor(report.status) }
                          ]}
                          textStyle={styles.chipText}
                        >
                          {report.status}
                        </Chip>
                      </View>
                      <Text style={styles.reportCode}>{report.code}</Text>
                    </View>

                    <Title style={styles.reportTitle}>{report.title}</Title>
                    <Paragraph
                      style={styles.reportDescription}
                      numberOfLines={2}
                    >
                      {report.description}
                    </Paragraph>

                    <View style={styles.reportFooter}>
                      <Text style={styles.reportDate}>
                        {formatDate(report.date)}
                      </Text>
                    </View>

                    {report.comment && (
                      <View style={styles.commentContainer}>
                        <Text style={styles.commentLabel}>
                          Último comentario:
                        </Text>
                        <Text
                          style={styles.commentText}
                          numberOfLines={2}
                        >
                          {report.comment}
                        </Text>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </>
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22
  },
  newReportButton: { paddingVertical: 5 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 3 },
  reportCard: { marginBottom: 15, elevation: 3, borderRadius: 12 },
  reportContent: { padding: 15 },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  chipsContainer: { flexDirection: 'row', gap: 8, flex: 1 },
  statusChip: { height: 28 },
  chipText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  reportCode: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    lineHeight: 20
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10
  },
  reportFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginBottom: 5
  },
  reportDate: { fontSize: 12, color: '#888', marginBottom: 3 },
  commentContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginTop: 5
  },
  commentLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 3
  },
  commentText: { fontSize: 12, color: '#333', lineHeight: 16 }
})
