import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function AboutScreen() {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    // Pausa el video cuando termina
    if (state === 'ended') setPlaying(false);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sobre Nosotros</Text>
      </View>

      <View style={styles.content}>
        {/* Historia */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Nuestra Historia</Title>
            <Paragraph style={styles.paragraph}>
              El Ministerio de Medio Ambiente y Recursos Naturales de la República Dominicana
              fue creado mediante la Ley 64-00, con el objetivo de establecer la política
              nacional sobre medio ambiente y recursos naturales.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Desde entonces, hemos trabajado incansablemente por la protección del medio
              ambiente, la conservación de la biodiversidad y el desarrollo sostenible
              de nuestro país.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Misión */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Misión</Title>
            <Paragraph style={styles.paragraph}>
              Garantizar la conservación del medio ambiente y los recursos naturales de la República Dominicana,
              mediante la rectoría y regulación de la política medioambiental.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Visión */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Visión</Title>
            <Paragraph style={styles.paragraph}>
              Institución reconocida por su eficacia con la conservación del medio ambiente y los recursos naturales,
              enfocada en el desarrollo sostenible del país, con una gestión integrada, eficiente y de calidad.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Video Institucional */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Video Institucional</Title>
            <View style={styles.videoContainer}>
              <YoutubePlayer
                ref={playerRef}
                height={200}
                videoId="B98jUUJ8Nh0"   // ID del video
                play={playing}
                onChangeState={onStateChange}
                webViewProps={{
                  allowsFullscreenVideo: true,
                }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Objetivos */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Nuestros Objetivos</Title>
            <View style={styles.objectiveItem}>
              <Text style={styles.objectiveIcon}>🌱</Text>
              <Paragraph style={styles.objectiveText}>
                Promover el desarrollo sostenible
              </Paragraph>
            </View>
            <View style={styles.objectiveItem}>
              <Text style={styles.objectiveIcon}>🏞️</Text>
              <Paragraph style={styles.objectiveText}>
                Proteger las áreas naturales protegidas
              </Paragraph>
            </View>
            <View style={styles.objectiveItem}>
              <Text style={styles.objectiveIcon}>💧</Text>
              <Paragraph style={styles.objectiveText}>
                Conservar los recursos hídricos
              </Paragraph>
            </View>
            <View style={styles.objectiveItem}>
              <Text style={styles.objectiveIcon}>🌳</Text>
              <Paragraph style={styles.objectiveText}>
                Preservar la biodiversidad nacional
              </Paragraph>
            </View>
            <View style={styles.objectiveItem}>
              <Text style={styles.objectiveIcon}>📚</Text>
              <Paragraph style={styles.objectiveText}>
                Educar y sensibilizar sobre temas ambientales
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
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
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    color: '#2E7D32',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 10,
  },
  videoContainer: {
    height: 200,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  objectiveIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  objectiveText: {
    flex: 1,
    fontSize: 14,
  },
});
