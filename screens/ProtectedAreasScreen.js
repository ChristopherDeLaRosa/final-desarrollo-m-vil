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
import { Card, Title, Paragraph, Chip, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function ProtectedAreaDetailScreen({ route, navigation }) {
  const { area } = route.params;

  const getTypeColor = (type) => {
    const colors = {
      'Parque Nacional': '#2E7D32',
      'Reserva Científica': '#1976D2',
      'Reserva Natural': '#388E3C',
      'Monumento Natural': '#F57C00',
    };
    return colors[type] || '#666';
  };

  const openLocation = () => {
    const url = `https://maps.google.com/?q=${area.latitude},${area.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{area.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <Image source={{ uri: area.image }} style={styles.heroImage} />

      <View style={styles.content}>
        <View style={styles.areaHeader}>
          <Chip 
            style={[styles.typeChip, { backgroundColor: getTypeColor(area.type) }]}
            textStyle={styles.typeText}
          >
            {area.type}
          </Chip>
          <Text style={styles.areaSize}>{area.area}</Text>
        </View>

        <Title style={styles.areaTitle}>{area.name}</Title>
        <Text style={styles.areaProvince}>📍 {area.province}</Text>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Descripción</Title>
            <Paragraph style={styles.description}>{area.description}</Paragraph>
            
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Establecido:</Text>
              <Text style={styles.infoValue}>{area.established}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Área Total:</Text>
              <Text style={styles.infoValue}>{area.area}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Provincia:</Text>
              <Text style={styles.infoValue}>{area.province}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.featuresCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Características Principales</Title>
            {area.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>🌿</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.locationCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Ubicación</Title>
            <Text style={styles.coordinatesText}>
              Coordenadas: {area.latitude.toFixed(4)}, {area.longitude.toFixed(4)}
            </Text>
            <Button
              mode="contained"
              onPress={openLocation}
              buttonColor="#2E7D32"
              icon="map"
              style={styles.locationButton}
            >
              Ver en Google Maps
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.tipsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Consejos para Visitantes</Title>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🥾</Text>
              <Text style={styles.tipText}>Usa calzado cómodo y apropiado para caminata</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>💧</Text>
              <Text style={styles.tipText}>Lleva suficiente agua y snacks</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>📱</Text>
              <Text style={styles.tipText}>Informa a alguien sobre tu itinerario</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🗑️</Text>
              <Text style={styles.tipText}>No dejes rastro - lleva tu basura contigo</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>📸</Text>
              <Text style={styles.tipText}>Respeta la vida silvestre - no alimentes a los animales</Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={openLocation}
            icon="directions"
            style={styles.actionButton}
          >
            Direcciones
          </Button>
          
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            buttonColor="#2E7D32"
            style={styles.actionButton}
          >
            Volver
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 15,
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  typeChip: {
    height: 30,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  areaSize: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  areaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    lineHeight: 30,
  },
  areaProvince: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoCard: {
    elevation: 3,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2E7D32',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 15,
  },
  divider: {
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  featuresCard: {
    elevation: 3,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  locationCard: {
    elevation: 3,
    marginBottom: 15,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  locationButton: {
    paddingVertical: 5,
  },
  tipsCard: {
    elevation: 3,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});