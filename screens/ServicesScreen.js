import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';

import { apiClient } from '../config/api';

export default function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    // try {
    //   // Simulated API call
    //   setTimeout(() => {
    //     const mockServices = [
    //       {
    //         id: 1,
    //         title: 'Evaluación de Impacto Ambiental',
    //         description: 'Evaluamos proyectos para determinar su impacto ambiental y las medidas de mitigación necesarias.',
    //         icon: '📋',
    //       },
    //       {
    //         id: 2,
    //         title: 'Licencias Ambientales',
    //         description: 'Otorgamos licencias para actividades que puedan afectar el medio ambiente.',
    //         icon: '📜',
    //       },
    //       {
    //         id: 3,
    //         title: 'Monitoreo de Calidad del Aire',
    //         description: 'Supervisamos la calidad del aire en diferentes zonas del país.',
    //         icon: '🌬️',
    //       },
    //       {
    //         id: 4,
    //         title: 'Gestión de Residuos Sólidos',
    //         description: 'Asesoramos en el manejo adecuado de residuos sólidos urbanos e industriales.',
    //         icon: '♻️',
    //       },
    //       {
    //         id: 5,
    //         title: 'Protección de Recursos Hídricos',
    //         description: 'Velamos por la conservación y uso sostenible de nuestros recursos de agua.',
    //         icon: '💧',
    //       },
    //       {
    //         id: 6,
    //         title: 'Educación Ambiental',
    //         description: 'Programas educativos para promover la conciencia ambiental en la población.',
    //         icon: '📚',
    //       },
    //       {
    //         id: 7,
    //         title: 'Reforestación',
    //         description: 'Iniciativas de plantación de árboles para recuperar áreas degradadas.',
    //         icon: '🌱',
    //       },
    //       {
    //         id: 8,
    //         title: 'Control de Contaminación',
    //         description: 'Supervisión y control de actividades que generen contaminación ambiental.',
    //         icon: '🚫',
    //       },
    //     ];
        
    //     setServices(mockServices);
    //     setLoading(false);
    //     setRefreshing(false);
    //   }, 1000);
    // } catch (error) {
    //   console.error('Error fetching services:', error);
    //   setLoading(false);
    //   setRefreshing(false);
    // }
     try {
      const data = await apiClient.get('/servicios');
      setServices(data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to mock data if API fails
      const mockServices = [
        {
          id: 1,
          title: 'Evaluación de Impacto Ambiental',
          description: 'Evaluamos proyectos para determinar su impacto ambiental y las medidas de mitigación necesarias.',
          icon: '📋',
        },
        {
          id: 2,
          title: 'Licencias Ambientales',
          description: 'Otorgamos licencias para actividades que puedan afectar el medio ambiente.',
          icon: '📜',
        },
        {
          id: 3,
          title: 'Monitoreo de Calidad del Aire',
          description: 'Supervisamos la calidad del aire en diferentes zonas del país.',
          icon: '🌬️',
        },
        {
          id: 4,
          title: 'Gestión de Residuos Sólidos',
          description: 'Asesoramos en el manejo adecuado de residuos sólidos urbanos e industriales.',
          icon: '♻️',
        },
        {
          id: 5,
          title: 'Protección de Recursos Hídricos',
          description: 'Velamos por la conservación y uso sostenible de nuestros recursos de agua.',
          icon: '💧',
        },
        {
          id: 6,
          title: 'Educación Ambiental',
          description: 'Programas educativos para promover la conciencia ambiental en la población.',
          icon: '📚',
        },
        {
          id: 7,
          title: 'Reforestación',
          description: 'Iniciativas de plantación de árboles para recuperar áreas degradadas.',
          icon: '🌱',
        },
        {
          id: 8,
          title: 'Control de Contaminación',
          description: 'Supervisión y control de actividades que generen contaminación ambiental.',
          icon: '🚫',
        },
      ];
      
      setServices(mockServices);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando servicios...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nuestros Servicios</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Conoce todos los servicios que ofrecemos para proteger nuestro medio ambiente
        </Text>

        {services.map((service) => (
          <Card key={service.id} style={styles.serviceCard}>
            <Card.Content style={styles.serviceContent}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceIcon}>{service.icono}</Text>
                <Title style={styles.serviceTitle}>{service.nombre}</Title>
              </View>
              <Paragraph style={styles.serviceDescription}>
                {service.descripcion}
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 22,
  },
  serviceCard: {
    marginBottom: 15,
    elevation: 3,
  },
  serviceContent: {
    padding: 15,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  serviceTitle: {
    flex: 1,
    fontSize: 16,
    color: '#2E7D32',
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});