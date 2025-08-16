import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking
} from 'react-native'
import { Card, Title, Button } from 'react-native-paper'

export default function AboutUsScreen() {
  const developers = [
    {
      id: 1,
      name: 'Christopher José de la Rosa Diaz',
      matricula: '2023-0934',
      role: 'Desarrollador Frontend',
      phone: '+1-829-620-4585',
      telegram: 'https://t.me/chrisdiaz25',
      image: require('../assets/christopher.png'),
      skills: ['React Native', 'JavaScript', 'UI/UX Design']
    },
    // TODO: Rafael que coloque sus detalles
    {
      id: 2,
      name: 'Rafael Adolfo Rosa',
      matricula: '2023-1025',
      role: 'Desarrollador Backend',
      phone: '+1-849-806-5000',
      telegram: 'https://t.me/adolfo_rosa',
      image: require('../assets/adolfo.webp'),
      skills: ['Node.js', 'Express', 'MongoDB']
    },
    // TODO: Luis Arturo que coloque sus detalles
    {
      id: 3,
      name: 'Luis Arturo Florentino',
      matricula: '2021-2158',
      role: 'Desarrollador Backend',
      phone: '+1-829-624-8056',
      telegram: 'https://t.me/doblel09',
      image: require('../assets/luis.jpg'),
      skills: ['DotNet', 'Typescript', 'Python', 'React']
    }
  ]

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`)
  }

  const handleTelegram = (telegramUrl) => {
    Linking.openURL(telegramUrl)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Acerca del Equipo</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.introCard}>
          <Card.Content>
            <Title style={styles.introTitle}>Equipo de Desarrollo</Title>
            <Text style={styles.introText}>
              Somos un equipo de estudiantes de desarrollo de software
              comprometidos con el desarrollo de soluciones tecnológicas que
              contribuyan al cuidado del medio ambiente. Esta aplicación fue
              desarrollada como proyecto final de la asignatura "Introducción al
              desarrollo móvil" impartida por el maestro Amadis Suarez Genao.
            </Text>
            <Text style={styles.introText}>
              Nuestro objetivo es crear herramientas digitales que faciliten la
              gestión ambiental y promuevan la participación ciudadana en la
              protección de nuestros recursos naturales.
            </Text>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Nuestro Equipo</Text>

        {developers.map((developer) => (
          <Card
            key={developer.id}
            style={styles.developerCard}
          >
            <Card.Content style={styles.developerContent}>
              <View style={styles.developerHeader}>
                <Image
                  source={
                    typeof developer.image === 'string'
                      ? { uri: developer.image }
                      : developer.image
                  }
                  style={styles.developerImage}
                />
                <View style={styles.developerInfo}>
                  <Title style={styles.developerName}>{developer.name}</Title>
                  <Text style={styles.developerRole}>{developer.role}</Text>
                  <Text style={styles.developerMatricula}>
                    Matrícula: {developer.matricula}
                  </Text>
                </View>
              </View>

              <View style={styles.skillsContainer}>
                <Text style={styles.skillsTitle}>Especialidades:</Text>
                <View style={styles.skillsWrapper}>
                  {developer.skills.map((skill, index) => (
                    <View
                      key={index}
                      style={styles.skillChip}
                    >
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.contactButtons}>
                <Button
                  mode='outlined'
                  onPress={() => handleCall(developer.phone)}
                  icon='phone'
                  style={styles.contactButton}
                >
                  Llamar
                </Button>
                <Button
                  mode='contained'
                  onPress={() => handleTelegram(developer.telegram)}
                  icon='send'
                  buttonColor='#0088cc'
                  style={styles.contactButton}
                >
                  Telegram
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.projectCard}>
          <Card.Content>
            <Title style={styles.projectTitle}>Sobre el Proyecto</Title>
            <View style={styles.projectInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Institución:</Text>
                <Text style={styles.infoValue}>
                  Instituto Tecnológico de las Américas (ITLA)
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Carrera:</Text>
                <Text style={styles.infoValue}>
                  Tecnólogo en Desarrollo de Software
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Materia:</Text>
                <Text style={styles.infoValue}>
                  Introducción al desarrollo móvil
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Período:</Text>
                <Text style={styles.infoValue}>2025-C2</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tecnologías:</Text>
                <Text style={styles.infoValue}>React Native, Expo</Text>
              </View>
            </View>
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
    alignItems: 'center',
    marginTop: 40
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  content: {
    padding: 15
  },
  introCard: {
    marginBottom: 20,
    elevation: 3
  },
  introTitle: {
    fontSize: 20,
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center'
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center'
  },
  developerCard: {
    marginBottom: 15,
    elevation: 3
  },
  developerContent: {
    padding: 15
  },
  developerHeader: {
    flexDirection: 'row',
    marginBottom: 15
  },
  developerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15
  },
  developerInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  developerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3
  },
  developerRole: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 2
  },
  developerMatricula: {
    fontSize: 12,
    color: '#666'
  },
  skillsContainer: {
    marginBottom: 15
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5
  },
  skillChip: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5
  },
  skillText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  contactButton: {
    flex: 1
  },
  projectCard: {
    marginVertical: 20,
    elevation: 3
  },
  projectTitle: {
    fontSize: 18,
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center'
  },
  projectInfo: {
    gap: 8
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    flex: 1
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right'
  },
  thanksCard: {
    elevation: 3,
    marginBottom: 20
  },
  thanksTitle: {
    fontSize: 18,
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center'
  },
  thanksText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 10
  }
})
