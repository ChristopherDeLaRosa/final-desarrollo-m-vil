import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Button, Chip } from 'react-native-paper';
import { apiClient, API_ENDPOINTS } from '../config/api';

export default function TeamScreen() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [departamento, setDepartamento] = useState('');
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    fetchTeam();
  }, [departamento]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const endpoint = departamento
        ? `${API_ENDPOINTS.EQUIPO}?departamento=${encodeURIComponent(departamento)}`
        : API_ENDPOINTS.EQUIPO;

      const data = await apiClient.get(endpoint);
      // API: [{ id, nombre, cargo, departamento, foto, biografia, orden, fecha_creacion, (posibles) telefono, email }]
      const list = (Array.isArray(data) ? data : []).map(m => ({
        id: m.id,
        name: m.nombre,
        position: m.cargo,
        department: m.departamento,
        image: m.foto,
        bio: m.biografia,
        order: Number(m.orden ?? 0),
        phone: m.telefono ?? null,
        email: m.email ?? null,
      })).sort((a, b) => (a.order - b.order) || a.name.localeCompare(b.name));

      setTeam(list);

      // construir lista de departamentos para chips
      const depts = Array.from(new Set(list.map(x => x.department).filter(Boolean)));
      setDepartamentos(depts);
    } catch (error) {
      console.error('Error fetching team:', error);
      Alert.alert('Error', error.message || 'No se pudo cargar el equipo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTeam();
  }, [departamento]);

  const handleCall = useCallback((phone) => {
    if (!phone) return;
    Linking.openURL(`tel:${encodeURIComponent(phone)}`);
  }, []);

  const handleEmail = useCallback((email) => {
    if (!email) return;
    Linking.openURL(`mailto:${encodeURIComponent(email)}`);
  }, []);

  const toggleExpand = useCallback((id) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando equipo...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Equipo del Ministerio</Text>
      </View>

      {/* Filtros por departamento */}
      <View style={styles.filters}>
        <View style={styles.deptRow}>
          <Chip
            selected={!departamento}
            onPress={() => setDepartamento('')}
            style={[styles.deptChip, !departamento ? { backgroundColor: '#2E7D32' } : {}]}
            textStyle={{ color: !departamento ? '#fff' : '#333', fontWeight: 'bold' }}
          >
            Todos
          </Chip>
          {departamentos.map((d) => (
            <Chip
              key={d}
              selected={departamento === d}
              onPress={() => setDepartamento(d)}
              style={[styles.deptChip, departamento === d ? { backgroundColor: '#4CAF50' } : {}]}
              textStyle={{ color: departamento === d ? '#fff' : '#333', fontWeight: 'bold' }}
            >
              {d}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.list}>
        {team.map(member => (
          <Card key={member.id} style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                {member.image ? (
                  <Image source={{ uri: member.image }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: '#888', fontWeight: 'bold' }}>SIN FOTO</Text>
                  </View>
                )}
                <View style={styles.info}>
                  <Title style={styles.name}>{member.name}</Title>
                  <Text style={styles.position}>{member.position}</Text>
                  <Text style={styles.department}>{member.department}</Text>
                </View>
              </View>

              {expandedId === member.id && (
                <View style={styles.details}>
                  {!!member.bio && <Paragraph style={styles.bio}>{member.bio}</Paragraph>}
                </View>
              )}

              <View style={styles.actions}>
                {!!member.phone && (
                  <Button mode="outlined" onPress={() => handleCall(member.phone)} style={styles.actionBtn} icon="phone">
                    Llamar
                  </Button>
                )}
                {!!member.email && (
                  <Button mode="outlined" onPress={() => handleEmail(member.email)} style={styles.actionBtn} icon="email">
                    Email
                  </Button>
                )}
                <Button
                  mode="contained"
                  onPress={() => toggleExpand(member.id)}
                  style={styles.expandBtn}
                >
                  {expandedId === member.id ? 'Ver menos' : 'Ver más'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const CARD_SPACING = 12;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: { backgroundColor: '#2E7D32', padding: 20, alignItems: 'center', marginTop: 40 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },

  filters: { paddingHorizontal: 15, paddingTop: 12 },
  deptRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  deptChip: { height: 32 },

  list: { padding: 15 },
  card: { marginBottom: CARD_SPACING, borderRadius: 12, elevation: 3 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, marginRight: 12, backgroundColor: '#e0e0e0' },
  info: { flex: 1 },
  name: { fontSize: 16, color: '#333' },
  position: { fontSize: 14, color: '#2E7D32' },
  department: { fontSize: 12, color: '#666', marginTop: 2 },
  details: { marginTop: 10 },
  bio: { fontSize: 14, color: '#333', marginBottom: 6, lineHeight: 20 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  actionBtn: { flex: 1 },
  expandBtn: { backgroundColor: '#2E7D32' },
});