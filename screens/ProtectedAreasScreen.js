import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Card, Title, Paragraph, Chip, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import areas from '../assets/protectedareas.json';

export default function ProtectedAreasScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAreas, setFilteredAreas] = useState(areas);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredAreas(areas);
    } else {
      const filtered = areas.filter(area => 
        area.nombre.toLowerCase().includes(query.toLowerCase()) ||
        area.tipo.toLowerCase().includes(query.toLowerCase()) ||
        area.ubicacion.toLowerCase().includes(query.toLowerCase()) ||
        area.descripcion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAreas(filtered);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredAreas(areas);
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

  const navigateToDetail = (areaId) => {
    navigation.navigate('ProtectedAreaDetail', { id: areaId });
  };

  const navigateToMap = () => {
    navigation.navigate('ProtectedAreasMapScreen');
  };

  const renderAreaCard = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigateToDetail(item.id)}
      style={styles.cardContainer}
    >
      <Card style={styles.card}>
        <Card.Cover 
          source={{ uri: item.imagen }} 
          style={styles.cardImage}
        />
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle} numberOfLines={2}>
              {item.nombre}
            </Title>
            <Chip 
              style={[styles.typeChip, { backgroundColor: getTypeColor(item.tipo) }]}
              textStyle={styles.typeText}
            >
              {item.tipo}
            </Chip>
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>{item.ubicacion}</Text>
          </View>
          
          <Paragraph style={styles.cardDescription} numberOfLines={3}>
            {item.descripcion}
          </Paragraph>
          
          <View style={styles.cardFooter}>
            <View style={styles.sizeContainer}>
              <Ionicons name="resize-outline" size={16} color="#666" />
              <Text style={styles.sizeText}>{item.superficie_km2} km²</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateText}>
                {new Date(item.fecha_creacion).getFullYear()}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Áreas Protegidas</Text>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={navigateToMap}
        >
          <Ionicons name="map" size={24} color="white" />
        </TouchableOpacity>
      </View> 

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar por nombre, tipo o ubicación..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#2E7D32"
          placeholderTextColor="#666"
        />
        {searchQuery !== '' && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsText}>
              {filteredAreas.length} resultado{filteredAreas.length !== 1 ? 's' : ''} encontrado{filteredAreas.length !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={filteredAreas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAreaCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No se encontraron áreas protegidas</Text>
            <Text style={styles.emptySubtext}>
              Intenta con otros términos de búsqueda
            </Text>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.floatingMapButton}
        onPress={navigateToMap}
      >
        <Ionicons name="map" size={24} color="white" />
        <Text style={styles.floatingButtonText}>Mapa</Text>
      </TouchableOpacity>
    </View>
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
  mapButton: {
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
  searchContainer: {
    padding: 15,
    paddingBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 16,
  },
  searchResults: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  searchResultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  clearButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
    elevation: 3,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  cardImage: {
    height: 180,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  typeChip: {
    height: 28,
    minWidth: 80,
  },
  typeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  floatingMapButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2E7D32',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});