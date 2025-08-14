import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, Card, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import areas from '../assets/protectedareas.json';

export default function ProtectedAreasMapScreen({ navigation }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setMapReady(true);
    }, 1000);
  }, []);

  const onMapReady = () => {
    setMapReady(true);
    console.log('Mapa listo');
  };


  const getTypeColor = (type) => {
    const colors = {
      'Parque Nacional': '#2E7D32',
      'Reserva Científica': '#1976D2',
      'Reserva Natural': '#388E3C',
      'Monumento Natural': '#F57C00',
      'Zona Protegida': '#7B1FA2',
    };
    return colors[type] || '#666';
  };

  const handleMarkerPress = (area) => {
    setSelectedArea(area);
  };

  const viewAreaDetails = () => {
    if (selectedArea) {
      navigation.navigate('ProtectedAreaDetail', { id: selectedArea.id });
    }
  };

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

      {!mapReady ? (
        <View style={styles.mapFallback}>
          <Text style={styles.fallbackText}>
            {mapReady ? 'Mapa cargado ✓' : 'Cargando mapa...'}
          </Text>
          <Text style={styles.fallbackSubtext}>
            {areas.length} áreas protegidas encontradas
          </Text>
        </View>
      ) : (
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: 18.7357,
            longitude: -70.1627,
            latitudeDelta: 3.0,
            longitudeDelta: 3.0,
          }}
          onMapReady={onMapReady}
        >
          {areas.map((area) => (
            <Marker
              key={area.id}
              coordinate={{
                latitude: area.latitud,
                longitude: area.longitud,
              }}
              pinColor={getTypeColor(area.tipo)}
              onPress={() => handleMarkerPress(area)}
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{area.nombre}</Text>
                  <Text style={styles.calloutType}>{area.tipo}</Text>
                  <Text style={styles.calloutProvince}>{area.ubicacion}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      {selectedArea && (
        <View style={styles.bottomSheet}>
          <Card style={styles.selectedAreaCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Chip 
                  style={[styles.typeChip, { backgroundColor: getTypeColor(selectedArea.tipo) }]}
                  textStyle={styles.typeText}
                >
                  {selectedArea.tipo}
                </Chip>
                <TouchableOpacity
                  onPress={() => setSelectedArea(null)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.selectedAreaTitle}>{selectedArea.nombre}</Text>
              <Text style={styles.selectedAreaProvince}>📍 {selectedArea.ubicacion}</Text>
              <Text style={styles.selectedAreaDescription} numberOfLines={2}>
                {selectedArea.descripcion}
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
  mapLoadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  mapLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  mapFallback: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 8,
    zIndex: 1000,
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  fallbackSubtext: {
    fontSize: 14,
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
    height: 400,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
