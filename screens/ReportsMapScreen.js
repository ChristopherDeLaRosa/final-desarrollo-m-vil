import { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, Card, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../App';
import { apiClient, API_ENDPOINTS } from '../config/api';

export default function ReportsMapScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const { isLoggedIn, user } = useContext(AuthContext);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert(
        'Acceso Restringido',
        'Debes iniciar sesión para ver el mapa de tus reportes.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
      return;
    }
    fetchReports();
  }, [isLoggedIn]);

  const mapEstadoToLabel = (estadoRaw) => {
    const v = (estadoRaw || '').toString().toLowerCase();
    if (v.includes('revision')) return 'En Revisión';
    if (v.includes('proceso')) return 'En Proceso';
    if (v.includes('resuelto')) return 'Resuelto';
    if (v.includes('rechaz')) return 'Rechazado';
    return 'Pendiente';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': '#9E9E9E',
      'En Revisión': '#FF9800',
      'En Proceso': '#2196F3',
      'Resuelto': '#4CAF50',
      'Rechazado': '#F44336',
    };
    return colors[status] || '#666';
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get(API_ENDPOINTS.REPORTES, user?.token);
      const list = (Array.isArray(data) ? data : []).map(r => ({
        id: r.id,
        code: r.codigo,
        title: r.titulo,
        description: r.descripcion,
        status: mapEstadoToLabel(r.estado),
        date: r.fecha,
        latitude: Number(r.latitud),
        longitude: Number(r.longitud),
        comment: r.comentario_ministerio || null,
        raw: r,
      })).filter(x => Number.isFinite(x.latitude) && Number.isFinite(x.longitude));

      setReports(list);
    } catch (error) {
      console.error('Error fetching reports:', error);
      if ((error.message || '').includes('401')) {
        Alert.alert('Sesión expirada', 'Vuelve a iniciar sesión.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', error.message || 'No se pudieron cargar los reportes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (report) => setSelectedReport(report);

  const viewReportDetails = () => {
    if (selectedReport) navigation.navigate('ReportDetail', { report: selectedReport });
  };

  const buildMapHtml = (reportsData) => {
    const markersJson = JSON.stringify(reportsData);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>html,body,#map{height:100%;margin:0;padding:0;} .leaflet-container{font-size:14px;}</style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const reports = ${markersJson};
          const map = L.map('map').setView([18.7357, -70.1627], 8);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          function statusColor(status) {
            const mapColors = {
              'Pendiente': '#9E9E9E',
              'En Revisión': '#FF9800',
              'En Proceso': '#2196F3',
              'Resuelto': '#4CAF50',
              'Rechazado': '#F44336'
            };
            return mapColors[status] || '#666';
          }

          reports.forEach(r => {
            try {
              const marker = L.circleMarker([r.latitude, r.longitude], {
                radius: 8,
                fillColor: statusColor(r.status),
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.9
              }).addTo(map);

              marker.bindPopup(\`<b>\${r.title}</b><br>\${r.status}<br>\${r.code}\`);

              marker.on('click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'marker_click', id: r.id }));
              });
            } catch(e) {
              console.warn('Invalid marker', e);
            }
          });

          if (reports.length > 0) {
            const coords = reports.map(r => [r.latitude, r.longitude]);
            map.fitBounds(coords, { padding: [50,50] });
          }
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type === 'marker_click') {
        const rpt = reports.find(r => r.id === data.id);
        if (rpt) setSelectedReport(rpt);
      }
    } catch (e) {
      console.warn('Invalid message from webview', e);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.loginPromptContainer}>
        <Text style={styles.loginPromptText}>
          Debes iniciar sesión para ver el mapa de tus reportes.
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('Login')} buttonColor="#2E7D32">
          Iniciar Sesión
        </Button>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando mapa de reportes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa de Mis Reportes</Text>
        <TouchableOpacity onPress={fetchReports} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes reportes para mostrar en el mapa.</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ReportDamage')}
            buttonColor="#d32f2f"
            style={styles.newReportButton}
            icon="plus"
          >
            Crear Reporte
          </Button>
        </View>
      ) : (
        <>
          <WebView
            ref={webViewRef}
            style={styles.map}
            originWhitelist={['*']}
            source={{ html: buildMapHtml(reports) }}
            javaScriptEnabled
            domStorageEnabled
            onMessage={handleWebViewMessage}
          />

          {selectedReport && (
            <View style={styles.bottomSheet}>
              <Card style={styles.selectedReportCard}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Chip
                      style={[styles.statusChip, { backgroundColor: getStatusColor(selectedReport.status) }]}
                      textStyle={styles.chipText}
                    >
                      {selectedReport.status}
                    </Chip>
                    <TouchableOpacity onPress={() => setSelectedReport(null)} style={styles.closeButton}>
                      <Ionicons name="close" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.selectedReportTitle}>{selectedReport.title}</Text>
                  <Text style={styles.selectedReportCode}>{selectedReport.code}</Text>
                  <Text style={styles.selectedReportDescription} numberOfLines={2}>
                    {selectedReport.description}
                  </Text>

                  <Button mode="contained" onPress={viewReportDetails} buttonColor="#2E7D32" style={styles.detailButton}>
                    Ver Detalles
                  </Button>
                </Card.Content>
              </Card>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loginPromptContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5',
  },
  loginPromptText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: {
    backgroundColor: '#2E7D32', padding: 20, paddingTop: 50,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 1,
  },
  backButton: { padding: 5 },
  refreshBtn: { padding: 5, width: 34, alignItems: 'flex-end' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 10 },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5',
  },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  newReportButton: { paddingVertical: 5 },
  map: { flex: 1 },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'transparent', padding: 15 },
  selectedReportCard: { elevation: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusChip: { height: 28 },
  chipText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  closeButton: { padding: 5 },
  selectedReportTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  selectedReportCode: { fontSize: 12, color: '#666', marginBottom: 8 },
  selectedReportDescription: { fontSize: 14, color: '#666', lineHeight: 18, marginBottom: 15 },
  detailButton: { paddingVertical: 5 },
});