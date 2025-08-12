import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { ActivityIndicator, Card, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function AreaMapScreen({ navigation }) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      // Using the same mock data from ProtectedAreasScreen
      setTimeout(() => {
        const mockAreas = [
          {
            id: 1,
            name: 'Parque Nacional del Este',
            type: 'Parque Nacional',
            province: 'La Altagracia',
            area: '420 km²',
            description: 'Protege el bosque nublado y especies endémicas de la Cordillera Central.',
            established: '1989',
            features: ['Bosque nublado', 'Flora endémica', 'Investigación científica'],
            latitude: 19.0456,
            longitude: -70.5123,
            image: 'https://via.placeholder.com/300x200/66BB6A/FFFFFF?text=Ebano+Verde',
          },
          {
            id: 4,
            name: 'Parque Nacional Los Haitises',
            type: 'Parque Nacional',
            province: 'Samaná',
            area: '1,600 km²',
            description: 'Ecosistema de manglares y mogotes kársticos únicos.',
            established: '1976',
            features: ['Manglares', 'Mogotes', 'Arte rupestre taíno'],
            latitude: 19.0789,
            longitude: -69.4567,
            image: 'https://via.placeholder.com/300x200/81C784/FFFFFF?text=Los+Haitises',
          },
          {
            id: 5,
            name: 'Reserva Natural Laguna de Oviedo',
            type: 'Reserva Natural',
            province: 'Pedernales',
            area: '26 km²',
            description: 'Importante refugio de aves migratorias y residentes.',
            established: '1986',
            features: ['Laguna hipersalina', 'Flamencos', 'Aves migratorias'],
            latitude: 17.8012,
            longitude: -71.3456,
            image: 'https://via.placeholder.com/300x200/4DB6AC/FFFFFF?text=Laguna+Oviedo',
          },
          {
            id: 6,
            name: 'Monumento Natural Saltos de la Damajagua',
            type: 'Monumento Natural',
            province: 'Puerto Plata',
            area: '5.2 km²',
            description: 'Cascadas naturales en medio del bosque tropical.',
            established: '2000',
            features: ['27 cascadas', 'Pozas naturales', 'Bosque tropical'],
            latitude: 19.7234,
            longitude: -70.7123,
            image: 'https://via.placeholder.com/300x200/26A69A/FFFFFF?text=Damajagua',
          },
        ];
        
        setAreas(mockAreas);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Parque Nacional': '#2E7D32',
      'Reserva Científica': '#1976D2',
      'Reserva Natural': '#388E3C',
      'Monumento Natural': '#F57C00',
    };
    return colors[type] || '#666';
  };

  const handleMarkerPress = (area) => {
    setSelectedArea(area);
  };

  const viewAreaDetails = () => {
    if (selectedArea) {
      navigation.navigate('ProtectedAreaDetail', { area: selectedArea });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa de Áreas Protegidas</Text>
        <View style={styles.placeholder} />
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.7357,
          longitude: -70.1627,
          latitudeDelta: 2.5,
          longitudeDelta: 2.5,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {areas.map((area) => (
          <Marker
            key={area.id}
            coordinate={{
              latitude: area.latitude,
              longitude: area.longitude,
            }}
            pinColor={getTypeColor(area.type)}
            onPress={() => handleMarkerPress(area)}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{area.name}</Text>
                <Text style={styles.calloutType}>{area.type}</Text>
                <Text style={styles.calloutProvince}>{area.province}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {selectedArea && (
        <View style={styles.bottomSheet}>
          <Card style={styles.selectedAreaCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Chip 
                  style={[styles.typeChip, { backgroundColor: getTypeColor(selectedArea.type) }]}
                  textStyle={styles.typeText}
                >
                  {selectedArea.type}
                </Chip>
                <TouchableOpacity
                  onPress={() => setSelectedArea(null)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.selectedAreaTitle}>{selectedArea.name}</Text>
              <Text style={styles.selectedAreaProvince}>📍 {selectedArea.province}</Text>
              <Text style={styles.selectedAreaDescription} numberOfLines={2}>
                {selectedArea.description}
              </Text>
              
              <Button
                mode="contained"
                onPress={viewAreaDetails}
                buttonColor="#2E7D32"
                style={styles.detailButton}
              >
                Ver Detalles
              </Button>
            </Card.Content>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  placeholder: {
    width: 34,
  },
  map: {
    flex: 1,
  },
  calloutContainer: {
    width: 150,
    padding: 5,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  calloutType: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  calloutProvince: {
    fontSize: 12,
    color: '#666',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    padding: 15,
  },
  selectedAreaCard: {
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeChip: {
    height: 28,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  selectedAreaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectedAreaProvince: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  selectedAreaDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 15,
  },
  detailButton: {
    paddingVertical: 5,
  },
});
