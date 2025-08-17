import { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { Card, Title, Paragraph } from 'react-native-paper'

const { width } = Dimensions.get('window')

const sliderImages = [
  {
    id: 1,
    image: 'https://s1.significados.com/foto/medio-ambiente.jpg?class=article',
    title: 'Protege nuestro Medio Ambiente',
    message:
      'Juntos podemos crear un futuro sostenible para República Dominicana'
  },
  {
    id: 2,
    image:
      'https://www.bbva.com/wp-content/uploads/2023/03/bbva-destina-medioambiente-podcast-blink-1536x944.jpg',
    title: 'Conserva nuestros Bosques',
    message: 'Los bosques son el pulmón de nuestro país'
  },
  {
    id: 3,
    image: 'http://recursos.galt.mx/hubfs/agua-limpia-con-energia-solar.jpeg',
    title: 'Agua Limpia para Todos',
    message: 'Cuidemos nuestros recursos hídricos'
  }
]

export default function HomeScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollViewRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % sliderImages.length
        scrollViewRef.current?.scrollTo({
          x: next * width,
          animated: true
        })
        return next
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const onScrollEnd = (e) => {
    const pageNumber = Math.round(e.nativeEvent.contentOffset.x / width)
    setCurrentSlide(pageNumber)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ministerio de Medio Ambiente</Text>
        <Text style={styles.headerSubtitle}>República Dominicana</Text>
      </View>

      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
        >
          {sliderImages.map((item) => (
            <View
              key={item.id}
              style={styles.slide}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.slideImage}
              />
              <View style={styles.slideOverlay}>
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideMessage}>{item.message}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Dots indicator */}
        <View style={styles.dotsContainer}>
          {sliderImages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentSlide === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      {/* Quick Access Cards */}
      <View style={styles.quickAccessContainer}>
        <Title style={styles.sectionTitle}>Acceso Rápido</Title>

        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              navigation.navigate('Información', { screen: 'News' })
            }
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardIcon}>📰</Text>
                <Text style={styles.cardTitle}>Noticias</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              navigation.navigate('Medio Ambiente', {
                screen: 'ProtectedAreas'
              })
            }
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardIcon}>🌳</Text>
                <Text style={styles.cardTitle}>Áreas Protegidas</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              navigation.navigate('Información', { screen: 'Services' })
            }
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardIcon}>🛎️</Text>
                <Text style={styles.cardTitle}>Servicios</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              navigation.navigate('Información', { screen: 'Volunteer' })
            }
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardIcon}>🤝</Text>
                <Text style={styles.cardTitle}>Voluntariado</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              navigation.navigate('Información', { screen: 'Videos' })
            }
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardIcon}>🎥</Text>
                <Text style={styles.cardTitle}>Videos</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              navigation.navigate('Información', { screen: 'About' })
            }
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardIcon}>📄</Text>
                <Text style={styles.cardTitle}>Sobre nosotros</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>
        {/* Cuarta fila */}
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              navigation.navigate('Información', { screen: 'Team' })
            }
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardIcon}>👥</Text>
                <Text style={styles.cardTitle}>Equipo</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              navigation.navigate('Información', { screen: 'AboutUs' })
            }
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardIcon}>ℹ️</Text>
                <Text style={styles.cardTitle}>Powered by</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>
      </View>

      {/* Environmental Tips */}
      <View style={styles.tipsContainer}>
        <Title style={styles.sectionTitle}>Consejos Ambientales</Title>
        <Card style={styles.tipCard}>
          <Card.Content>
            <Paragraph style={styles.tipText}>
              💡 Usa transporte público o bicicleta para reducir tu huella de
              carbono
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.tipCard}>
          <Card.Content>
            <Paragraph style={styles.tipText}>
              💧 Ahorra agua cerrando el grifo mientras te cepillas los dientes
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.tipCard}>
          <Card.Content>
            <Paragraph style={styles.tipText}>
              ♻️ Separa tus residuos y recicla todo lo que puedas
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
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
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5
  },
  sliderContainer: {
    height: 250,
    marginVertical: 20
  },
  slide: {
    width: width,
    height: 200,
    position: 'relative'
  },
  slideImage: {
    width: '90%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 10
  },
  slideOverlay: {
    position: 'absolute',
    bottom: 0,
    left: '5%',
    right: '5%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  slideTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  slideMessage: {
    color: 'white',
    fontSize: 14
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4
  },
  activeDot: {
    backgroundColor: '#2E7D32'
  },
  quickAccessContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  quickCard: {
    flex: 0.48
  },
  card: {
    elevation: 3
  },
  cardContent: {
    alignItems: 'center',
    padding: 20
  },
  cardIcon: {
    fontSize: 30,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tipsContainer: {
    padding: 20,
    paddingTop: 0
  },
  tipCard: {
    marginBottom: 10,
    elevation: 2
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20
  }
})
