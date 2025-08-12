import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Chip } from 'react-native-paper';

export default function MeasuresScreen() {
  const [measures, setMeasures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchMeasures();
  }, []);

    const fetchMeasures = async () => {
    try {
      const data = await apiClient.get('/medidas');
      setMeasures(data);
    } catch (error) {
      console.error('Error fetching measures:', error);
      setLoading(false);
      setRefreshing(false);
    }
  
  // const fetchMeasures = async () => {
  //   try {
  //     // Simulación de API
  //     setTimeout(() => {
  //       const mockMeasures = [
  //         {
  //           id: 1,
  //           title: 'Reducción de Plásticos de Un Solo Uso',
  //           category: 'Residuos',
  //           priority: 'Alta',
  //           description: 'Prohibición gradual de plásticos desechables en establecimientos comerciales.',
  //           details:
  //             'Esta medida busca reducir significativamente la contaminación por plásticos en nuestros ecosistemas. Se implementará de forma gradual: primero bolsas plásticas, luego sorbetes y finalmente todos los plásticos de un solo uso.',
  //           actions: [
  //             'Prohibición de bolsas plásticas en supermercados',
  //             'Eliminación de sorbetes plásticos en restaurantes',
  //             'Promoción de alternativas biodegradables',
  //             'Campaña de concientización ciudadana',
  //           ],
  //           status: 'En implementación',
  //           startDate: '2025-01-01',
  //           impact: 'Reducción del 60% en residuos plásticos',
  //         },
  //         {
  //           id: 2,
  //           title: 'Reforestación Nacional 2025-2030',
  //           category: 'Bosques',
  //           priority: 'Alta',
  //           description: 'Programa ambicioso para plantar 10 millones de árboles nativos en 5 años.',
  //           details:
  //             'El programa de reforestación más grande en la historia del país, enfocado en especies nativas y la recuperación de áreas degradadas.',
  //           actions: [
  //             'Plantación de 2 millones de árboles anuales',
  //             'Creación de viveros comunitarios',
  //             'Capacitación a agricultores y comunidades',
  //             'Monitoreo satelital de cobertura forestal',
  //           ],
  //           status: 'Activo',
  //           startDate: '2025-03-01',
  //           impact: 'Aumento del 15% en cobertura forestal',
  //         },
  //         {
  //           id: 3,
  //           title: 'Energías Renovables en Edificios Públicos',
  //           category: 'Energía',
  //           priority: 'Media',
  //           description: 'Instalación de paneles solares en todas las instituciones públicas.',
  //           details:
  //             'Transición energética del sector público hacia fuentes renovables, comenzando con los edificios de mayor consumo.',
  //           actions: [
  //             'Auditoría energética de edificios públicos',
  //             'Instalación de sistemas solares fotovoltaicos',
  //             'Capacitación del personal técnico',
  //             'Monitoreo de eficiencia energética',
  //           ],
  //           status: 'Planificación',
  //           startDate: '2025-06-01',
  //           impact: 'Reducción del 40% en consumo eléctrico público',
  //         },
  //         {
  //           id: 4,
  //           title: 'Protección de Cuencas Hidrográficas',
  //           category: 'Agua',
  //           priority: 'Alta',
  //           description: 'Fortalecimiento de la protección de las principales cuencas del país.',
  //           details:
  //             'Programa integral para la conservación y restauración de cuencas hidrográficas críticas para el suministro de agua.',
  //           actions: [
  //             'Reforestación de zonas de recarga hídrica',
  //             'Control de actividades agropecuarias',
  //             'Monitoreo de calidad del agua',
  //             'Educación ambiental comunitaria',
  //           ],
  //           status: 'Activo',
  //           startDate: '2024-09-01',
  //           impact: 'Mejora del 25% en calidad del agua',
  //         },
  //         {
  //           id: 5,
  //           title: 'Transporte Público Sostenible',
  //           category: 'Transporte',
  //           priority: 'Media',
  //           description: 'Modernización del transporte público con vehículos eléctricos y híbridos.',
  //           details:
  //             'Renovación gradual de la flota de transporte público hacia tecnologías más limpias y eficientes.',
  //           actions: [
  //             'Adquisición de autobuses eléctricos',
  //             'Instalación de estaciones de carga',
  //             'Capacitación de conductores',
  //             'Mejora de rutas y frecuencias',
  //           ],
  //           status: 'Estudio',
  //           startDate: '2025-09-01',
  //           impact: 'Reducción del 30% en emisiones del transporte',
  //         },
  //         {
  //           id: 6,
  //           title: 'Educación Ambiental Obligatoria',
  //           category: 'Educación',
  //           priority: 'Media',
  //           description: 'Inclusión de materias ambientales en el currículo educativo nacional.',
  //           details:
  //             'Integración transversal de temas ambientales en todos los niveles educativos para formar ciudadanos ambientalmente conscientes.',
  //           actions: [
  //             'Desarrollo de material didáctico',
  //             'Capacitación de docentes',
  //             'Creación de huertos escolares',
  //             'Programas de intercambio ambiental',
  //           ],
  //           status: 'En implementación',
  //           startDate: '2025-02-01',
  //           impact: 'Educación ambiental a 2 millones de estudiantes',
  //         },
  //       ];

  //       setMeasures(mockMeasures);
  //       setLoading(false);
  //       setRefreshing(false);
  //     }, 1000);
  //   } catch (error) {
  //     console.error('Error fetching measures:', error);
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMeasures();
  }, []);

  const toggleExpanded = useCallback(
    (id) => {
      setExpandedId(expandedId === id ? null : id);
    },
    [expandedId]
  );

  const getCategoryColor = (category) => {
    const colors = {
      Residuos: '#F44336',
      Bosques: '#4CAF50',
      'Energía': '#FF9800',
      Agua: '#2196F3',
      Transporte: '#9C27B0',
      Educación: '#3F51B5',
    };
    return colors[category] || '#666';
  };

  const getPriorityColor = (priority) => {
    const colors = { Alta: '#F44336', Media: '#FF9800', Baja: '#4CAF50' };
    return colors[priority] || '#666';
  };

  const getStatusColor = (status) => {
    const colors = {
      Activo: '#4CAF50',
      'En implementación': '#FF9800',
      Planificación: '#2196F3',
      Estudio: '#9E9E9E',
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando medidas ambientales...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medidas Ambientales</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Conoce las políticas y medidas que implementamos para proteger nuestro medio ambiente
        </Text>

        {measures.map((measure) => (
          <TouchableOpacity
            key={measure.id}
            onPress={() => toggleExpanded(measure.id)}
            activeOpacity={0.7}
          >
            <Card style={styles.measureCard}>
              <Card.Content style={styles.measureContent}>
                <View style={styles.measureHeader}>
                  <View style={styles.chipsContainer}>
                    <Chip
                      style={[styles.chip, { backgroundColor: getCategoryColor(measure.category) }]}
                      textStyle={styles.chipText}
                    >
                      {measure.category}
                    </Chip>
                    <Chip
                      style={[styles.chip, { backgroundColor: getPriorityColor(measure.priority) }]}
                      textStyle={styles.chipText}
                    >
                      {measure.priority}
                    </Chip>
                  </View>
                  <Chip
                    style={[styles.chip, { backgroundColor: getStatusColor(measure.status) }]}
                    textStyle={styles.chipText}
                  >
                    {measure.status}
                  </Chip>
                </View>

                <Title style={styles.measureTitle}>{measure.title}</Title>
                <Paragraph style={styles.measureDescription}>{measure.description}</Paragraph>

                {expandedId === measure.id && (
                  <View style={styles.expandedContent}>
                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Detalles</Text>
                    <Paragraph style={styles.details}>{measure.details}</Paragraph>

                    <Text style={styles.sectionTitle}>Acciones Principales</Text>
                    {measure.actions.map((action, index) => (
                      <View key={index} style={styles.actionItem}>
                        <Text style={styles.actionBullet}>•</Text>
                        <Text style={styles.actionText}>{action}</Text>
                      </View>
                    ))}

                    <View style={styles.infoGrid}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Fecha de Inicio</Text>
                        <Text style={styles.infoValue}>
                          {new Date(measure.startDate).toLocaleDateString('es-DO')}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Impacto Esperado</Text>
                        <Text style={styles.infoValue}>{measure.impact}</Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.expandIndicator}>
                  <Text style={styles.expandText}>
                    {expandedId === measure.id ? 'Ver menos' : 'Ver más'}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const CHIP_SPACING = 8;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: { backgroundColor: '#2E7D32', padding: 20, alignItems: 'center', marginTop: 40 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 15 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666', lineHeight: 22 },
  measureCard: { marginBottom: 15, elevation: 3, borderRadius: 12 },
  measureContent: { padding: 15 },
  measureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  chipsContainer: { flexDirection: 'row', marginRight: CHIP_SPACING },
  chip: { height: 28, marginRight: CHIP_SPACING },
  chipText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  measureTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8, lineHeight: 24 },
  measureDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 10 },
  expandedContent: { marginTop: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8, marginTop: 10 },
  details: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 15, textAlign: 'justify' },
  actionItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  actionBullet: { fontSize: 16, color: '#2E7D32', marginRight: 8, marginTop: 2 },
  actionText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 18 },
  infoGrid: { marginTop: 15 },
  infoItem: { marginBottom: 10 },
  infoLabel: { fontSize: 12, color: '#666', fontWeight: 'bold', marginBottom: 3 },
  infoValue: { fontSize: 14, color: '#333' },
  expandIndicator: { alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  expandText: { fontSize: 14, color: '#2E7D32', fontWeight: 'bold' },
})};
