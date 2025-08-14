// screens/ChangePasswordScreen.jsx
import React, { useState, useContext, useEffect } from 'react'
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
import { AuthContext } from '../App'
import { apiClient, API_ENDPOINTS } from '../config/api'

export default function ChangePasswordScreen({ navigation }) {
  const { user } = useContext(AuthContext)

  const [form, setForm] = useState({
    email: user?.email || '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState({ new: false, confirm: false })
  const [sendingCode, setSendingCode] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    // autocompleta si el usuario inicia sesión luego
    if (user?.email && !form.email) {
      setForm((prev) => ({ ...prev, email: user.email }))
    }
  }, [user])

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }))
  }

  const validateReset = () => {
    const e = {}
    if (!form.email) e.email = 'El correo es requerido'
    else if (!isEmail(form.email)) e.email = 'Correo no válido'
    if (!form.code) e.code = 'El código es requerido'
    if (!form.newPassword) e.newPassword = 'La nueva contraseña es requerida'
    else if (form.newPassword.length < 6) e.newPassword = 'Mínimo 6 caracteres'
    if (!form.confirmPassword) e.confirmPassword = 'Confirma tu contraseña'
    else if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = 'No coinciden'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const sendRecoverCode = async () => {
    if (!form.email)
      return setErrors((e) => ({ ...e, email: 'El correo es requerido' }))
    if (!isEmail(form.email))
      return setErrors((e) => ({ ...e, email: 'Correo no válido' }))

    setSendingCode(true)
    try {
      const code = await apiClient.post(API_ENDPOINTS.RECOVER, {
        correo: form.email
      })
      setField('code', code.codigo)
    } catch (e) {
      Alert.alert('Error', e?.message || 'No fue posible enviar el código')
    } finally {
      setSendingCode(false)
    }
  }

  const handleReset = async () => {
    if (!validateReset()) return

    setResetting(true)
    try {
      await apiClient.post(API_ENDPOINTS.RESET, {
        correo: form.email,
        codigo: form.code,
        nueva_password: form.newPassword
      })
      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña ha sido restablecida.',
        [{ text: 'OK', onPress: () => navigation.replace('Login') }]
      )
    } catch (e) {
      Alert.alert(
        'Error',
        e?.message || 'No fue posible restablecer la contraseña'
      )
    } finally {
      setResetting(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Cambiar / Restablecer Contraseña
          </Text>
        </View>

        <View style={styles.content}>
          <Card style={styles.formCard}>
            <Card.Content>
              <Title style={styles.formTitle}>Restablecer contraseña</Title>

              <TextInput
                label='Correo electrónico *'
                value={form.email}
                onChangeText={(v) => setField('email', v)}
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

              <Button
                mode='outlined'
                onPress={sendRecoverCode}
                loading={sendingCode}
                disabled={sendingCode}
                style={styles.sendCodeButton}
              >
                Enviar código
              </Button>

              <TextInput
                label='Código recibido *'
                value={form.code}
                onChangeText={(v) => setField('code', v)}
                style={styles.input}
                error={!!errors.code}
              />
              <HelperText
                type='error'
                visible={!!errors.code}
              >
                {errors.code}
              </HelperText>

              <TextInput
                label='Nueva contraseña *'
                value={form.newPassword}
                onChangeText={(v) => setField('newPassword', v)}
                secureTextEntry={!show.new}
                right={
                  <TextInput.Icon
                    icon={show.new ? 'eye-off' : 'eye'}
                    onPress={() => setShow((s) => ({ ...s, new: !s.new }))}
                  />
                }
                style={styles.input}
                error={!!errors.newPassword}
              />
              <HelperText
                type='error'
                visible={!!errors.newPassword}
              >
                {errors.newPassword}
              </HelperText>

              <TextInput
                label='Confirmar nueva contraseña *'
                value={form.confirmPassword}
                onChangeText={(v) => setField('confirmPassword', v)}
                secureTextEntry={!show.confirm}
                right={
                  <TextInput.Icon
                    icon={show.confirm ? 'eye-off' : 'eye'}
                    onPress={() =>
                      setShow((s) => ({ ...s, confirm: !s.confirm }))
                    }
                  />
                }
                style={styles.input}
                error={!!errors.confirmPassword}
              />
              <HelperText
                type='error'
                visible={!!errors.confirmPassword}
              >
                {errors.confirmPassword}
              </HelperText>

              <View style={styles.actions}>
                <Button
                  mode='outlined'
                  onPress={() => navigation.goBack()}
                  style={styles.cancelBtn}
                >
                  Cancelar
                </Button>
                <Button
                  mode='contained'
                  onPress={handleReset}
                  loading={resetting}
                  disabled={resetting}
                  buttonColor='#2E7D32'
                  style={styles.submitBtn}
                >
                  Actualizar contraseña
                </Button>
              </View>
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
  infoCard: { marginBottom: 20, elevation: 3 },
  infoTitle: { fontSize: 16, color: '#2E7D32', marginBottom: 10 },
  infoText: { fontSize: 14, lineHeight: 20, color: '#333' },
  formCard: { elevation: 3, marginBottom: 20 },
  formTitle: { fontSize: 18, color: '#2E7D32', marginBottom: 15 },
  input: { marginBottom: 5 },
  sendCodeButton: { alignSelf: 'flex-start', marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: { flex: 1 },
  submitBtn: { flex: 1, paddingVertical: 5 }
})
