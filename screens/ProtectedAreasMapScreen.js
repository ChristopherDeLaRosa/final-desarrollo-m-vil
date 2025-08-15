import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import areas from '../assets/protectedareas.json'

export default function ProtectedAreasMapScreen({ navigation }) {
  const [selectedArea, setSelectedArea] = useState(null)

  const getTypeColor = (type) => {
    const colors = {
      'Parque Nacional': '#2E7D32',
      'Reserva Científica': '#1976D2',
      'Reserva Natural': '#388E3C',
      'Monumento Natural': '#F57C00',
      'Zona Protegida': '#7B1FA2',
      'Refugio de Vida Silvestre': '#E91E63'
    }
    return colors[type] || '#666'
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Parque Nacional': '🏞️',
      'Reserva Científica': '🔬',
      'Reserva Natural': '🌿',
      'Monumento Natural': '🗿',
      'Zona Protegida': '🛡️',
      'Refugio de Vida Silvestre': '🦆'
    }
    return icons[type] || '📍'
  }

  // Generar HTML para el mapa con Leaflet
  const generateMapHTML = () => {
    const markersData = areas.map((area) => ({
      ...area,
      color: getTypeColor(area.tipo),
      icon: getTypeIcon(area.tipo)
    }))

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapa de Áreas Protegidas</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        #map { 
            height: 100vh; 
            width: 100vw; 
        }
        .custom-popup {
            min-width: 200px;
        }
        .popup-content {
            padding: 8px;
        }
        .popup-title {
            font-weight: bold;
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
        }
        .popup-type {
            background: #2E7D32;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            display: inline-block;
            margin-bottom: 4px;
        }
        .popup-location {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }
        .popup-description {
            font-size: 11px;
            color: #666;
            line-height: 1.3;
            margin-bottom: 8px;
        }
        .popup-stats {
            font-size: 10px;
            color: #888;
            border-top: 1px solid #eee;
            padding-top: 4px;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script>
        // Inicializar el mapa centrado en República Dominicana
        var map = L.map('map').setView([18.7357, -70.1627], 8);

        // Agregar capa de OpenStreetMap (GRATIS, sin API key)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        // Datos de las áreas protegidas
        var areasData = ${JSON.stringify(markersData)};

        // Agregar marcadores para cada área
        areasData.forEach(function(area) {
            // Crear un marcador personalizado
            var marker = L.marker([area.latitud, area.longitud])
                .addTo(map);

            // Crear contenido del popup
            var popupContent = \`
                <div class="custom-popup">
                    <div class="popup-content">
                        <div class="popup-title">\${area.icon} \${area.nombre}</div>
                        <div class="popup-type" style="background: \${area.color}">\${area.tipo}</div>
                        <div class="popup-location">📍 \${area.ubicacion}</div>
                        <div class="popup-description">\${area.descripcion}</div>
                        <div class="popup-stats">
                            📏 \${area.superficie_km2} km² | 📅 \${new Date(area.fecha_creacion).getFullYear()}
                        </div>
                    </div>
                </div>
            \`;

            marker.bindPopup(popupContent, {
                maxWidth: 250,
                className: 'custom-popup'
            });

            // Comunicación con React Native
            marker.on('click', function() {
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'markerClick',
                    area: area
                }));
            });
        });

        // Ajustar la vista para mostrar todos los marcadores
        var group = new L.featureGroup(map._layers);
        if (Object.keys(group._layers).length > 0) {
            map.fitBounds(group.getBounds().pad(0.1));
        }

        // Manejar eventos de clic en el mapa
        map.on('click', function() {
            window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'mapClick'
            }));
        });
    </script>
</body>
</html>`
  }

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)

      if (data.type === 'markerClick') {
        setSelectedArea(data.area)
      } else if (data.type === 'mapClick') {
        setSelectedArea(null)
      }
    } catch (error) {
      console.log('Error parsing message:', error)
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name='arrow-back'
            size={24}
            color='white'
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa de Áreas Protegidas</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Contador */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          🗺️ {areas.length} áreas protegidas en República Dominicana
        </Text>
      </View>

      {/* Mapa real con Leaflet */}
      <WebView
        style={styles.webview}
        source={{ html: generateMapHTML() }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />

      {/* Información del área seleccionada */}
      {selectedArea && (
        <View style={styles.bottomInfo}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {getTypeIcon(selectedArea.tipo)} {selectedArea.nombre}
            </Text>
            <Text
              style={[
                styles.infoType,
                { color: getTypeColor(selectedArea.tipo) }
              ]}
            >
              {selectedArea.tipo}
            </Text>
            <Text style={styles.infoLocation}>📍 {selectedArea.ubicacion}</Text>
            <TouchableOpacity
              style={[
                styles.detailButton,
                { backgroundColor: getTypeColor(selectedArea.tipo) }
              ]}
              onPress={() =>
                navigation.navigate('ProtectedAreaDetail', {
                  id: selectedArea.id
                })
              }
            >
              <Text style={styles.detailButtonText}>Ver Detalles</Text>
              <Ionicons
                name='arrow-forward'
                size={16}
                color='white'
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000
  },
  backButton: {
    padding: 5
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10
  },
  placeholder: {
    width: 34
  },
  counter: {
    backgroundColor: 'white',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  counterText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  webview: {
    flex: 1
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1000
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  infoType: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5
  },
  infoLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8
  },
  detailButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8
  }
})
