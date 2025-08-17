// screens/LoginScreen.jsx
import React, { useState, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { TextInput, Button, Card, Title, HelperText } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../App'
import { apiClient, API_ENDPOINTS } from '../config/api'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const { isLoggedIn, login, logout } = useContext(AuthContext)

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

  const handleLogin = async () => {
    // reset errores
    setEmailError('')
    setPasswordError('')

    // validaciones
    let hasError = false
    if (!email) {
      setEmailError('El correo electrónico es requerido')
      hasError = true
    } else if (!validateEmail(email)) {
      setEmailError('Ingrese un correo electrónico válido')
      hasError = true
    }
    if (!password) {
      setPasswordError('La contraseña es requerida')
      hasError = true
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      hasError = true
    }
    if (hasError) return

    setIsLoading(true)
    try {
      // OJO: el backend espera "correo" en el body
      const data = await apiClient.post(API_ENDPOINTS.LOGIN, {
        correo: email,
        password
      })

      // ajusta si tu API devuelve otros nombres de propiedades
      const token = data?.token || data?.accessToken || data?.jwt || ''
      const user = data?.user || { name: 'Usuario', email }

      if (token) await AsyncStorage.setItem('auth_token', token)

      login({ ...user, token })
      Alert.alert('Éxito', 'Sesión iniciada correctamente')
    } catch (e) {
      const msg = String(e?.message || '')
        .toLowerCase()
        .includes('network')
        ? 'No hay conexión a internet'
        : e?.message || 'Credenciales incorrectas o servidor no disponible'
      Alert.alert('Error', msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Ingrese su correo electrónico primero')
      return
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Ingrese un correo electrónico válido')
      return
    }
    try {
      await apiClient.post(API_ENDPOINTS.RECOVER, { correo: email })
      Alert.alert('Recuperación enviada', `Revisa tu correo: ${email}`)
    } catch (e) {
      Alert.alert(
        'Error',
        e?.message || 'No fue posible iniciar la recuperación'
      )
    }
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('auth_token')
    logout()
    Alert.alert('Sesión Cerrada', 'Has cerrado sesión exitosamente')
  }

  if (isLoggedIn) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Panel de Usuario</Text>
        </View>

        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.welcomeTitle}>¡Bienvenido!</Title>
              <Text style={styles.welcomeText}>
                Ahora tienes acceso a todas las funcionalidades de la
                aplicación.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.menuCard}>
            <Card.Content>
              <Title style={styles.menuTitle}>Opciones Disponibles</Title>

              <Button
                mode='outlined'
                onPress={() => navigation.navigate('Regulations')}
                style={styles.menuButton}
                icon='book-open-variant'
              >
                Normativas Ambientales
              </Button>

              <Button
                mode='outlined'
                onPress={() => navigation.navigate('ReportDamage')}
                style={styles.menuButton}
                icon='alert-circle'
              >
                Reportar Daño Ambiental
              </Button>

              <Button
                mode='outlined'
                onPress={() => navigation.navigate('MyReports')}
                style={styles.menuButton}
                icon='file-document-multiple'
              >
                Mis Reportes
              </Button>

              <Button
                mode='outlined'
                onPress={() => navigation.navigate('ReportsMap')}
                style={styles.menuButton}
                icon='map-marker-multiple'
              >
                Mapa de Mis Reportes
              </Button>

              <Button
                mode='outlined'
                onPress={() => navigation.navigate('ChangePassword')}
                style={styles.menuButton}
                icon='lock-reset'
              >
                Cambiar Contraseña
              </Button>
            </Card.Content>
          </Card>

          <Button
            mode='contained'
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor='#d32f2f'
            icon='logout'
          >
            Cerrar Sesión
          </Button>
        </View>
      </ScrollView>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Iniciar Sesión</Text>
        </View>

        <View style={styles.content}>
          <Card style={styles.loginCard}>
            <Card.Content>
              <Title style={styles.loginTitle}>Acceso de Usuario</Title>

              <TextInput
                label='Correo Electrónico'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                style={styles.input}
                error={!!emailError}
              />
              <HelperText
                type='error'
                visible={!!emailError}
              >
                {emailError}
              </HelperText>

              <TextInput
                label='Contraseña'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword((v) => !v)}
                  />
                }
                style={styles.input}
                error={!!passwordError}
              />
              <Button
                mode='text'
                onPress={handleForgotPassword}
                style={styles.forgotButton}
              >
                ¿Olvidaste tu contraseña?
              </Button>
              <HelperText
                type='error'
                visible={!!passwordError}
              >
                {passwordError}
              </HelperText>

              <Button
                mode='contained'
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                buttonColor='#2E7D32'
              >
                Iniciar Sesión
              </Button>

              <Button
                mode='text'
                onPress={() => navigation.navigate('Register')}
                style={styles.registerButton}
                textColor='#2E7D32'
              >
                ¿No tienes cuenta? Regístrate
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.infoTitle}>Funcionalidades con Cuenta</Title>
              <Text style={styles.infoText}>• Ver normativas ambientales</Text>
              <Text style={styles.infoText}>• Reportar daños ambientales</Text>
              <Text style={styles.infoText}>• Seguimiento de reportes</Text>
              <Text style={styles.infoText}>• Mapa personal de reportes</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center'
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 15 },
  loginCard: { marginBottom: 15, elevation: 3 },
  loginTitle: { textAlign: 'center', color: '#2E7D32', marginBottom: 20 },
  input: { marginBottom: 5 },
  loginButton: { marginTop: 20, paddingVertical: 8 },
  forgotButton: { alignSelf: 'flex-end' },
  registerButton: { marginTop: 10, paddingVertical: 8 },
  card: { marginBottom: 15, elevation: 3 },
  welcomeTitle: { textAlign: 'center', color: '#2E7D32', marginBottom: 10 },
  welcomeText: { textAlign: 'center', fontSize: 16 },
  menuCard: { marginBottom: 15, elevation: 3 },
  menuTitle: { color: '#2E7D32', marginBottom: 15 },
  menuButton: { marginBottom: 10 },
  logoutButton: { marginTop: 10, paddingVertical: 8 },
  infoCard: { elevation: 3 },
  infoTitle: { color: '#2E7D32', marginBottom: 10 },
  infoText: { fontSize: 14, marginBottom: 5, paddingLeft: 10 }
})
