import React, { useState, useEffect } from 'react';
import { theme } from '../../theme';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import { getIncidentById } from '../../api/incidentApi';
import { formatDateTime, getStatusColor, getSeverityColor, getIncidentTypeLabel } from '../../utils/format';

export default function IncidentDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIncidentDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getIncidentById(id);
      if (res && res.success && res.data && res.data.incident) {
        setIncident(res.data.incident);
      } else {
        setError('Failed to load incident details.');
      }
    } catch (err) {
      console.error('Fetch incident details error:', err);
      const msg = err.response?.data?.message || err.message || 'Error fetching incident details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading incident profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !incident) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Incident not found'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchIncidentDetails}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusColor(incident.status);
  const severityStyle = getSeverityColor(incident.severity);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header Section */}
        <View style={styles.headerCard}>
          <Text style={styles.ticketLabel}>Emergency Dossier File</Text>
          <Text style={styles.ticketNumberText} selectable>{incident.ticketNumber || 'NO TICKET'}</Text>
          
          <Text style={styles.title}>{incident.title}</Text>
          
          <View style={styles.dossierGrid}>
            <View style={styles.dossierGridItem}>
              <Text style={styles.dossierLabel}>Severity</Text>
              <View style={[styles.dossierBadge, { backgroundColor: severityStyle.bg, borderColor: severityStyle.border }]}>
                <Text style={[styles.dossierBadgeText, { color: severityStyle.text }]}>
                  {incident.severity?.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.dossierGridItem}>
              <Text style={styles.dossierLabel}>Status</Text>
              <View style={[styles.dossierBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                <Text style={[styles.dossierBadgeText, { color: statusStyle.text }]}>
                  {incident.status?.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.dossierGridItem}>
              <Text style={styles.dossierLabel}>Incident Type</Text>
              <Text style={styles.dossierValueText}>{getIncidentTypeLabel(incident.type)}</Text>
            </View>

            <View style={styles.dossierGridItem}>
              <Text style={styles.dossierLabel}>Filed Timestamp</Text>
              <Text style={styles.dossierValueText}>{formatDateTime(incident.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Group Link Section */}
        {incident.incidentGroup ? (
          <View style={[styles.card, styles.groupCard]}>
            <View style={styles.groupCardHeader}>
              <Text style={styles.groupCardHeaderTitle}>📁 Linked Group Case</Text>
              <View style={[styles.miniBadge, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}>
                <Text style={{ fontSize: 9, fontWeight: '800', color: '#1E40AF' }}>
                  {incident.incidentGroup.groupNumber}
                </Text>
              </View>
            </View>
            <Text style={styles.groupCardText}>
              This report is grouped with nearby similar reports so the command team can resolve duplicate reports faster.
            </Text>
            <View style={{ marginTop: 6, gap: 4 }}>
              {incident.incidentGroup.status && (
                <Text style={styles.groupStatusText}>
                  Group Status: <Text style={{ fontWeight: 'bold' }}>{incident.incidentGroup.status.toUpperCase()}</Text>
                </Text>
              )}
              {incident.incidentGroup.incidentCount !== undefined && (
                <Text style={styles.groupStatusText}>
                  Similar Reports Count: <Text style={{ fontWeight: 'bold' }}>{incident.incidentGroup.incidentCount}</Text>
                </Text>
              )}
              {incident.incidentGroup.locationSummary ? (
                <Text style={styles.groupStatusText}>
                  Location Summary: <Text style={{ fontWeight: 'bold' }}>{incident.incidentGroup.locationSummary}</Text>
                </Text>
              ) : null}
              {incident.incidentGroup.resolvedAt ? (
                <Text style={styles.groupStatusText}>
                  Resolved At: <Text style={{ fontWeight: 'bold' }}>{formatDateTime(incident.incidentGroup.resolvedAt)}</Text>
                </Text>
              ) : null}
              {incident.incidentGroup.resolutionNote ? (
                <Text style={[styles.groupStatusText, { fontStyle: 'italic', marginTop: 8, padding: 10, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 6, color: '#E2E8F0' }]}>
                  Resolution Note: {incident.incidentGroup.resolutionNote}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Description Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.descText}>{incident.description}</Text>
        </View>

        {/* AI Safety Guidance Section */}
        {incident.aiTriage && incident.aiTriage.citizenSafetyNote ? (
          <View style={[styles.card, styles.aiCard]}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiHeaderTitle}>🤖 Gemini AI Safety Note</Text>
            </View>
            <Text style={styles.aiSafetyText}>{incident.aiTriage.citizenSafetyNote}</Text>
            <Text style={styles.aiDisclaimerText}>⚠️ {incident.aiTriage.disclaimer}</Text>
          </View>
        ) : null}

        {/* Location Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Geotag</Text>
          <Text style={styles.addressText}>📍 {incident.location?.address}</Text>
          
          {incident.location?.coordinates && (
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinateText}>
                Latitude: <Text style={styles.coordVal}>{incident.location.coordinates[1]}</Text>
              </Text>
              <Text style={styles.coordinateText}>
                Longitude: <Text style={styles.coordVal}>{incident.location.coordinates[0]}</Text>
              </Text>
            </View>
          )}
        </View>

        {/* Assigned Responder Panel */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emergency Responder</Text>
          {incident.assignedResponder ? (
            <View style={styles.responderInfo}>
              <Text style={styles.infoName}>👤 {incident.assignedResponder.name}</Text>
              <Text style={styles.infoEmail}>✉ {incident.assignedResponder.email}</Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>
              Waiting for dispatcher assignment. Field responder will be designated shortly.
            </Text>
          )}
        </View>

        {/* Assigned Resources Panel */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dispatched Supplies & Logistical Units</Text>
          {incident.assignedResources && incident.assignedResources.length > 0 ? (
            <View style={styles.resourceList}>
              {incident.assignedResources.map((res) => (
                <View key={res._id} style={styles.resourceItem}>
                  <Text style={styles.resourceName}>📦 {res.name}</Text>
                  <Text style={styles.resourceMeta}>Type: {res.type} • Status: {res.status}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.placeholderText}>
              No resources dispatched yet. Supplying dispatch metrics will register here.
            </Text>
          )}
        </View>

        {/* Status History / Timeline Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incident Updates Timeline</Text>
          {incident.statusHistory && incident.statusHistory.length > 0 ? (
            <View style={styles.timeline}>
              {incident.statusHistory.slice().reverse().map((history, index) => {
                const historyStatusStyle = getStatusColor(history.status);
                const isLatest = index === 0;

                return (
                  <View key={index} style={styles.timelineItem}>
                    {/* Node Circle */}
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineNode, isLatest && styles.latestNode]} />
                      {index < incident.statusHistory.length - 1 && <View style={styles.timelineLine} />}
                    </View>

                    {/* Node Content */}
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineHeader}>
                        <View
                          style={[
                            styles.miniBadge,
                            { backgroundColor: historyStatusStyle.bg, borderColor: historyStatusStyle.border }
                          ]}
                        >
                          <Text style={[styles.miniBadgeText, { color: historyStatusStyle.text }]}>
                            {history.status.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.timelineTime}>{formatDateTime(history.changedAt)}</Text>
                      </View>
                      
                      {history.note ? (
                        <Text style={styles.timelineNote}>"{history.note}"</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.placeholderText}>No history updates recorded.</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  errorText: {
    color: theme.colors.emergency,
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 20,
    ...theme.shadows.button,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weights.semibold,
    fontSize: 14,
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  ticketLabel: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  ticketNumberText: {
    fontSize: 20,
    fontWeight: theme.typography.weights.heavy,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    lineHeight: 28,
  },
  dossierGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  dossierGridItem: {
    width: '47%',
    marginBottom: 8,
  },
  dossierLabel: {
    fontSize: 9,
    fontWeight: theme.typography.weights.semibold,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dossierBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  dossierBadgeText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.heavy,
  },
  dossierValueText: {
    fontSize: 13,
    fontWeight: theme.typography.weights.bold,
    color: '#FFFFFF',
  },
  typeText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  addressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    gap: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  coordinateText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  coordVal: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.semibold,
  },
  responderInfo: {
    gap: 6,
  },
  infoName: {
    fontSize: 15,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textPrimary,
  },
  infoEmail: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  placeholderText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  resourceList: {
    gap: 12,
  },
  resourceItem: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: 12,
  },
  resourceName: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  resourceMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 64,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
  },
  timelineNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.border,
    zIndex: 2,
    marginTop: 4,
  },
  latestNode: {
    backgroundColor: theme.colors.primary,
    transform: [{ scale: 1.2 }],
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  miniBadge: {
    borderWidth: 1,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: theme.borderRadius.sm,
  },
  miniBadgeText: {
    fontSize: 8,
    fontWeight: theme.typography.weights.heavy,
  },
  timelineTime: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  timelineNote: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  aiCard: {
    borderColor: '#2E3E59',
    borderLeftWidth: 4,
    backgroundColor: '#0B1220',
    borderWidth: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiHeaderTitle: {
    fontSize: 14,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiSafetyText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    marginBottom: 10,
  },
  aiDisclaimerText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  groupCard: {
    borderColor: '#2E3E59',
    borderLeftWidth: 4,
    backgroundColor: '#0B1220',
    borderWidth: 1,
  },
  groupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  groupCardHeaderTitle: {
    fontSize: 13,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.cyan,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupCardText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 6,
  },
  groupStatusText: {
    fontSize: 11,
    color: theme.colors.cyan,
    marginTop: 4,
  },
});
