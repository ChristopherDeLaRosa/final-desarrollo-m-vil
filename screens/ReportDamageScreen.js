import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { TextInput, Button, Card, Title, HelperText } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { AuthContext } from '../App'
import { apiClient, API_ENDPOINTS } from '../config/api'

export default function ReportesDamageScreen({ navigation }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photo: null,
    latitude: null,
    longitude: null
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const { isLoggedIn, user } = useContext(AuthContext)

  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert(
        'Acceso Restringido',
        'Debes iniciar sesión para reportar daños ambientales.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      )
    }
  }, [isLoggedIn, navigation])

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const e = {}
    const title = formData.title.trim()
    const description = formData.description.trim()

    if (!title) e.title = 'El título es requerido'
    if (!description) e.description = 'La descripción es requerida'
    else if (description.length < 20) e.description = 'Mínimo 20 caracteres'
    if (!formData.photo) e.photo = 'La foto es requerida'
    if (!formData.latitude || !formData.longitude)
      e.location = 'La ubicación es requerida'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Autoriza el acceso a tus fotos.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true
    })
    if (!result.canceled) {
      const asset = result.assets[0]
      setFormData((prev) => ({
        ...prev,
        photo: { uri: asset.uri, base64: asset.base64 }
      }))
      if (errors.photo) setErrors((prev) => ({ ...prev, photo: '' }))
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Autoriza el acceso a la cámara.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true
    })
    if (!result.canceled) {
      const asset = result.assets[0]
      setFormData((prev) => ({
        ...prev,
        photo: { uri: asset.uri, base64: asset.base64 }
      }))
      if (errors.photo) setErrors((prev) => ({ ...prev, photo: '' }))
    }
  }

  const getCurrentLocation = async () => {
    setLocationLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Autoriza el acceso a la ubicación.')
        return
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      })
      setFormData((prev) => ({
        ...prev,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      }))
      if (errors.location) setErrors((prev) => ({ ...prev, location: '' }))
      Alert.alert('Éxito', 'Ubicación obtenida correctamente')
    } catch {
      Alert.alert('Error', 'No se pudo obtener la ubicación')
    } finally {
      setLocationLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    if (!user?.token) {
      Alert.alert('Sesión requerida', 'Vuelve a iniciar sesión.')
      navigation.navigate('Login')
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        titulo: formData.title.trim(),
        descripcion: formData.description.trim(),
        foto: formData.photo.base64,
        latitud: Number(formData.latitude),
        longitud: Number(formData.longitude)
      }

      await apiClient.post(API_ENDPOINTS.REPORTES, payload, user.token)

      setIsLoading(false)
      Alert.alert(
        'Reporte Enviado',
        'Tu reporte ha sido enviado exitosamente. Te notificaremos sobre su estado.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                title: '',
                description: '',
                photo: null,
                latitude: null,
                longitude: null
              })
              navigation.navigate('MyReports')
            }
          }
        ]
      )
    } catch (e) {
      setIsLoading(false)
      Alert.alert('Error', e.message || 'No se pudo enviar el reporte.')
    }
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.loginPromptContainer}>
        <Text style={styles.loginPromptText}>
          Debes iniciar sesión para reportar daños ambientales.
        </Text>
        <Button
          mode='contained'
          onPress={() => navigation.navigate('Login')}
          buttonColor='#2E7D32'
        >
          Iniciar Sesión
        </Button>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reportar Daño Ambiental</Text>
        </View>

        <View style={styles.content}>
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.infoTitle}>Información Importante</Title>
              <Text style={styles.infoText}>
                • Proporciona información precisa y detallada{'\n'}• Incluye una
                foto clara del daño ambiental{'\n'}• La ubicación nos ayuda a
                responder más rápido{'\n'}• Tu reporte será revisado en 24-48
                horas
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.formCard}>
            <Card.Content>
              <Title style={styles.formTitle}>Formulario de Reporte</Title>

              <TextInput
                label='Título del Reporte *'
                value={formData.title}
                onChangeText={(text) => updateFormData('title', text)}
                style={styles.input}
                error={!!errors.title}
                placeholder='Ej: Vertido de residuos en río'
              />
              <HelperText
                type='error'
                visible={!!errors.title}
              >
                {errors.title}
              </HelperText>

              <TextInput
                label='Descripción Detallada *'
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
                style={styles.input}
                multiline
                numberOfLines={4}
                error={!!errors.description}
                placeholder='Describe detalladamente el daño ambiental observado...'
              />
              <HelperText
                type='error'
                visible={!!errors.description}
              >
                {errors.description}
              </HelperText>

              <Text style={styles.sectionTitle}>Fotografía del Daño *</Text>
              {formData.photo ? (
                <View style={styles.photoContainer}>
                  <Image
                    source={{ uri: formData.photo.uri }}
                    style={styles.photo}
                  />
                  <Button
                    mode='outlined'
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, photo: null }))
                    }
                    style={styles.removePhotoButton}
                  >
                    Remover Foto
                  </Button>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <Button
                    mode='outlined'
                    onPress={takePhoto}
                    icon='camera'
                    style={styles.photoButton}
                  >
                    Tomar Foto
                  </Button>
                  <Button
                    mode='outlined'
                    onPress={pickImage}
                    icon='image'
                    style={[styles.photoButton, styles.photoButtonRight]}
                  >
                    Galería
                  </Button>
                </View>
              )}
              <HelperText
                type='error'
                visible={!!errors.photo}
              >
                {errors.photo}
              </HelperText>

              <Text style={styles.sectionTitle}>Ubicación *</Text>
              {formData.latitude && formData.longitude ? (
                <View style={styles.locationContainer}>
                  <Text style={styles.locationText}>
                    📍 Ubicación obtenida{'\n'}
                    Lat: {formData.latitude.toFixed(6)}
                    {'\n'}
                    Lng: {formData.longitude.toFixed(6)}
                  </Text>
                  <Button
                    mode='outlined'
                    onPress={getCurrentLocation}
                    loading={locationLoading}
                    disabled={locationLoading}
                    icon='crosshairs-gps'
                    style={styles.locationButton}
                  >
                    Actualizar Ubicación
                  </Button>
                </View>
              ) : (
                <Button
                  mode='contained'
                  onPress={getCurrentLocation}
                  loading={locationLoading}
                  disabled={locationLoading}
                  icon='crosshairs-gps'
                  buttonColor='#2E7D32'
                  style={styles.getLocationButton}
                >
                  Obtener Ubicación Actual
                </Button>
              )}
              <HelperText
                type='error'
                visible={!!errors.location}
              >
                {errors.location}
              </HelperText>

              <Button
                mode='contained'
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                buttonColor='#d32f2f'
                style={styles.submitButton}
                icon='alert-circle'
              >
                Enviar Reporte
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const BUTTON_SPACING = 10

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  loginPromptText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666'
  },
  header: { backgroundColor: '#d32f2f', padding: 20, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 15 },
  infoCard: { marginBottom: 20, elevation: 3 },
  infoTitle: { fontSize: 16, color: '#d32f2f', marginBottom: 10 },
  infoText: { fontSize: 14, lineHeight: 20, color: '#333' },
  formCard: { elevation: 3, marginBottom: 20 },
  formTitle: { fontSize: 18, color: '#d32f2f', marginBottom: 15 },
  input: { marginBottom: 5 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10
  },
  photoContainer: { alignItems: 'center', marginBottom: 10 },
  photo: { width: 200, height: 150, borderRadius: 8, marginBottom: 10 },
  removePhotoButton: { width: 200 },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  photoButton: { flex: 1, marginRight: BUTTON_SPACING },
  photoButtonRight: { marginRight: 0 },
  locationContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  locationText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center'
  },
  locationButton: { alignSelf: 'center' },
  getLocationButton: { marginBottom: 10, paddingVertical: 5 },
  submitButton: { marginTop: 20, paddingVertical: 8 }
})
