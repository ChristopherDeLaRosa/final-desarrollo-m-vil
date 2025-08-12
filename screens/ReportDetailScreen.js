import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function ReportDetailScreen({ route, navigation }) {
  const { report } = route.params;

  const getStatusColor = (status) => {
    const colors = {
      Pendiente: '#9E9E9E',
      'En Revisión': '#FF9800',
      'En Proceso': '#2196F3',
      Resuelto: '#4CAF50',
      Rechazado: '#F44336',
    };
    return colors[status] || '#666';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Baja: '#4CAF50',
      Media: '#FF9800',
      Alta: '#F44336',
      'Muy Alta': '#8E24AA',
    };
    return colors[priority] || '#666';
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openLocation = () => {
    if (typeof report.latitude !== 'number' || typeof report.longitude !== 'number') return;
    const url = `https://maps.google.com/?q=${encodeURIComponent(
      `${report.latitude},${report.longitude}`
    )}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Reporte</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Card style={styles.statusCard}>
          <Card.Content>
            <View style={styles.statusHeader}>
              <View style={styles.chipsContainer}>
                <Chip
                  style={[styles.chip, { backgroundColor: getStatusColor(report.status) }]}
                  textStyle={styles.chipText}
                >
                  {report.status}
                </Chip>
                <Chip
                  style={[styles.chip, { backgroundColor: getPriorityColor(report.priority) }]}
                  textStyle={styles.chipText}
                >
                  Prioridad {report.priority}
                </Chip>
              </View>
              {report.code ? <Text style={styles.reportCode}>{report.code}</Text> : null}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.detailCard}>
          <Card.Content>
            <Title style={styles.reportTitle}>{report.title}</Title>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Fecha de Reporte:</Text>
              <Text style={styles.infoValue}>{formatDate(report.date)}</Text>
            </View>

            {report.assignedTo ? (
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Asignado a:</Text>
                <Text style={styles.infoValue}>{report.assignedTo}</Text>
              </View>
            ) : null}

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Paragraph style={styles.description}>{report.description}</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {report.photo ? (
          <Card style={styles.photoCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Evidencia Fotográfica</Text>
              <Image source={{ uri: report.photo }} style={styles.reportPhoto} />
            </Card.Content>
          </Card>
        ) : null}

        {typeof report.latitude === 'number' && typeof report.longitude === 'number' ? (
          <Card style={styles.locationCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Ubicación</Text>
              <Text style={styles.coordinatesText}>
                📍 {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
              </Text>
              <Button
                mode="contained"
                onPress={openLocation}
                buttonColor="#2E7D32"
                icon="map"
                style={styles.locationButton}
              >
                Ver en Mapa
              </Button>
            </Card.Content>
          </Card>
        ) : null}

        {report.comment ? (
          <Card style={styles.commentCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Comentarios del Equipo</Text>
              <View style={styles.commentBubble}>
                <Text style={styles.commentText}>{report.comment}</Text>
              </View>
            </Card.Content>
          </Card>
        ) : null}

        <Card style={styles.statusInfoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Estado del Reporte</Text>
            <View style={styles.statusTimeline}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.timelineText}>Reporte enviado</Text>
              </View>
              <View
                style={[
                  styles.timelineItem,
                  (report.status !== 'Pendiente' ? null : styles.timelineDim),
                ]}
              >
                <View style={[styles.timelineDot, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.timelineText}>En revisión</Text>
              </View>
              <View
                style={[
                  styles.timelineItem,
                  (report.status === 'En Proceso' || report.status === 'Resuelto'
                    ? null
                    : styles.timelineDim),
                ]}
              >
                <View style={[styles.timelineDot, { backgroundColor: '#2196F3' }]} />
                <Text style={styles.timelineText}>En proceso</Text>
              </View>
              <View
                style={[
                  styles.timelineItem,
                  (report.status === 'Resuelto' ? null : styles.timelineDim),
                ]}
              >
                <View style={[styles.timelineDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.timelineText}>Resuelto</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          buttonColor="#2E7D32"
          style={styles.backToListButton}
        >
          Volver a Mis Reportes
        </Button>
      </View>
    </ScrollView>
  );
}

const SPACING = 8;

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
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  placeholder: { width: 34 },
  content: { padding: 15 },

  statusCard: { elevation: 3, marginBottom: 15 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chipsContainer: { flexDirection: 'row', marginRight: SPACING },
  chip: { height: 30, marginRight: SPACING },
  chipText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  reportCode: { fontSize: 14, color: '#666', fontWeight: 'bold' },

  detailCard: { elevation: 3, marginBottom: 15 },
  reportTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15, lineHeight: 26 },

  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  infoValue: { fontSize: 14, color: '#333', textAlign: 'right', flex: 1, marginLeft: 10 },

  descriptionSection: { marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 22, color: '#333', textAlign: 'justify' },

  photoCard: { elevation: 3, marginBottom: 15 },
  reportPhoto: { width: '100%', height: 200, borderRadius: 8, resizeMode: 'cover' },

  locationCard: { elevation: 3, marginBottom: 15 },
  coordinatesText: { fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'center' },
  locationButton: { paddingVertical: 5 },

  commentCard: { elevation: 3, marginBottom: 15 },
  commentBubble: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  commentText: { fontSize: 14, color: '#333', lineHeight: 20 },

  statusInfoCard: { elevation: 3, marginBottom: 20 },
  statusTimeline: {},
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  timelineDim: { opacity: 0.3 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
  timelineText: { fontSize: 14, color: '#333' },

  backToListButton: { paddingVertical: 8, marginBottom: 20 },
});
