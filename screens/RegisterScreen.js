// screens/RegisterScreen.jsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import {
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
  RadioButton
} from 'react-native-paper'
import { apiClient, API_ENDPOINTS } from '../config/api'

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    cedula: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    matricula: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const onlyDigits = (v) => (v || '').replace(/\D/g, '')
  const formatCedula = (v) => {
    const d = onlyDigits(v).slice(0, 11)
    if (d.length <= 3) return d
    if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 10)}-${d.slice(10)}`
  }

  const formatMatricula = (v) => {
    const d = onlyDigits(v).slice(0, 8)
    if (d.length <= 4) return d
    return `${d.slice(0, 4)}-${d.slice(4)}`
  }

  const validateForm = () => {
    const e = {}

    // Cédula
    const cedDigits = onlyDigits(formData.cedula)
    if (!cedDigits) e.cedula = 'La cédula es requerida'
    else if (cedDigits.length !== 11)
      e.cedula = 'La cédula debe tener 11 dígitos'

    // Nombres
    if (!formData.firstName.trim()) e.firstName = 'El nombre es requerido'
    if (!formData.lastName.trim()) e.lastName = 'El apellido es requerido'

    // Correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) e.email = 'El correo electrónico es requerido'
    else if (!emailRegex.test(formData.email))
      e.email = 'Ingrese un correo electrónico válido'

    // Password
    if (!formData.password) e.password = 'La contraseña es requerida'
    else if (formData.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Las contraseñas no coinciden'

    // Teléfono
    const phoneDigits = onlyDigits(formData.phone)
    if (!phoneDigits) e.phone = 'El teléfono es requerido'
    else if (phoneDigits.length !== 10) e.phone = 'Ingrese 10 dígitos'

    // Matrícula
    const matDigits = onlyDigits(formData.matricula)
    if (!matDigits) e.matricula = 'La matrícula es requerida'
    else if (matDigits.length !== 8)
      e.matricula = 'La matrícula debe tener 8 dígitos'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // ⇩⇩ Mapea EXACTO a tu API ⇩⇩
      const payload = {
        cedula: formatCedula(formData.cedula), // "000-0000000-0"
        nombre: formData.firstName.trim(),
        apellido: formData.lastName.trim(),
        correo: formData.email.trim().toLowerCase(),
        password: formData.password,
        telefono: onlyDigits(formData.phone), // "8090000000"
        matricula: formatMatricula(formData.matricula) // "2020-1010"
      }

      await apiClient.post(API_ENDPOINTS.REGISTER, payload)

      setIsLoading(false)
      Alert.alert('Registro Exitoso', 'Usuario registrado correctamente.', [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              cedula: '',
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              phone: '',
              matricula: ''
            })
            navigation.navigate('Login')
          }
        }
      ])
    } catch (error) {
      setIsLoading(false)
      Alert.alert(
        'Error',
        error.message || 'Ocurrió un error al registrar el usuario.'
      )
    }
  }

  const updateFormData = (field, value) => {
    // autoformato de cédula mientras escribe
    if (field === 'cedula') value = formatCedula(value)
    if (field === 'matricula') value = formatMatricula(value)
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
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
          <Text style={styles.headerTitle}>Registro de Usuario</Text>
        </View>

        <View style={styles.content}>
          <Card style={styles.formCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Formulario de Registro</Title>

              <TextInput
                label='Cédula de Identidad *'
                value={formData.cedula}
                onChangeText={(text) => updateFormData('cedula', text)}
                keyboardType='number-pad'
                style={styles.input}
                error={!!errors.cedula}
                maxLength={13}
                placeholder='000-0000000-0'
              />
              <HelperText
                type='error'
                visible={!!errors.cedula}
              >
                {errors.cedula}
              </HelperText>

              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <TextInput
                    label='Nombre *'
                    value={formData.firstName}
                    onChangeText={(text) => updateFormData('firstName', text)}
                    style={styles.input}
                    error={!!errors.firstName}
                  />
                  <HelperText
                    type='error'
                    visible={!!errors.firstName}
                  >
                    {errors.firstName}
                  </HelperText>
                </View>

                <View style={styles.nameField}>
                  <TextInput
                    label='Apellido *'
                    value={formData.lastName}
                    onChangeText={(text) => updateFormData('lastName', text)}
                    style={styles.input}
                    error={!!errors.lastName}
                  />
                  <HelperText
                    type='error'
                    visible={!!errors.lastName}
                  >
                    {errors.lastName}
                  </HelperText>
                </View>
              </View>

              <TextInput
                label='Correo Electrónico *'
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                keyboardType='email-address'
                autoCapitalize='none'
                style={styles.input}
                error={!!errors.email}
              />
              <HelperText
                type='error'
                visible={!!errors.email}
              >
                {errors.email}
              </HelperText>

              <TextInput
                label='Contraseña *'
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                secureTextEntry
                style={styles.input}
                error={!!errors.password}
              />
              <HelperText
                type='error'
                visible={!!errors.password}
              >
                {errors.password}
              </HelperText>

              <TextInput
                label='Confirmar Contraseña *'
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                secureTextEntry
                style={styles.input}
                error={!!errors.confirmPassword}
              />
              <HelperText
                type='error'
                visible={!!errors.confirmPassword}
              >
                {errors.confirmPassword}
              </HelperText>

              <TextInput
                label='Teléfono *'
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                keyboardType='phone-pad'
                style={styles.input}
                error={!!errors.phone}
                placeholder='809-000-0000'
                maxLength={10}
              />
              <HelperText
                type='error'
                visible={!!errors.phone}
              >
                {errors.phone}
              </HelperText>

              <TextInput
                label='Matrícula *'
                value={formData.matricula}
                onChangeText={(text) => updateFormData('matricula', text)}
                keyboardType='number-pad'
                style={styles.input}
                error={!!errors.matricula}
                placeholder='2020-1010'
                maxLength={9}
              />
              <HelperText
                type='error'
                visible={!!errors.matricula}
              >
                {errors.matricula}
              </HelperText>

              <Button
                mode='contained'
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                style={styles.submitButton}
                buttonColor='#2E7D32'
              >
                Registrarse
              </Button>
              <Button
                mode='text'
                onPress={() => navigation.navigate('Login')}
                style={styles.loginButton}
                textColor='#2E7D32'
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center',
    marginTop: 40
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 15 },
  formCard: { elevation: 3, marginBottom: 20 },
  cardTitle: { fontSize: 18, color: '#2E7D32', marginBottom: 15 },
  input: { marginBottom: 5 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  nameField: { flex: 1 },
  submitButton: { marginTop: 20, paddingVertical: 8 },
  loginButton: { marginTop: 10, paddingVertical: 8, color: '#2E7D32' }
})
