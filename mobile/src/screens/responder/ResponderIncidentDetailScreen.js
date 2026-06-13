import React, { useState, useEffect } from 'react';
import { theme } from '../../theme';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { getIncidentById, updateIncidentStatus } from '../../api/incidentApi';
import { formatDateTime, getStatusColor, getSeverityColor, getIncidentTypeLabel } from '../../utils/format';

const getAllowedTransitions = (currentStatus) => {
  const transitions = {
    reported: ['verified', 'assigned'],
    verified: ['assigned', 'in-progress'],
    assigned: ['in-progress', 'resolved'],
    'in-progress': ['resolved'],
    resolved: [],
    closed: []
  };
  return transitions[currentStatus?.toLowerCase()] || [];
};

const getStatusLabel = (status) => {
  const labels = {
    reported: 'Reported',
    verified: 'Verified',
    assigned: 'Assigned',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed'
  };
  return labels[status?.toLowerCase()] || status || 'Unknown';
};

export default function ResponderIncidentDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status update states
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const fetchIncidentDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getIncidentById(id);
      if (res && res.success && res.data && res.data.incident) {
        setIncident(res.data.incident);
        // Pre-select first eligible status
        const eligible = getAllowedTransitions(res.data.incident.status);
        setSelectedStatus(eligible.length > 0 ? eligible[0] : '');
      } else {
        setError('Failed to load incident details.');
      }
    } catch (err) {
      console.error('Fetch responder details error:', err);
      const msg = err.response?.data?.message || err.message || 'Error fetching incident details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    setUpdateError('');
    setUpdateSuccess('');

    if (!selectedStatus) {
      setUpdateError('Please select a target status.');
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        status: selectedStatus,
        note: statusNote.trim() || undefined
      };

      const res = await updateIncidentStatus(id, payload);
      if (res.success) {
        setUpdateSuccess('Status updated successfully!');
        setStatusNote('');
        
        // Wait and refetch details
        setTimeout(async () => {
          setUpdateSuccess('');
          await fetchIncidentDetails();
        }, 1500);
      } else {
        setUpdateError(res.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error('Update status error:', err);
      const msg = err.response?.data?.message || err.message || 'Status transition rejected.';
      setUpdateError(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading dispatch parameters...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !incident) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Incident details unavailable'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchIncidentDetails}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusColor(incident.status);
  const severityStyle = getSeverityColor(incident.severity);
  const eligibleStatuses = getAllowedTransitions(incident.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          {/* Header Dashboard */}
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
                <Text style={styles.dossierLabel}>Last Update</Text>
                <Text style={styles.dossierValueText}>{formatDateTime(incident.updatedAt)}</Text>
              </View>
            </View>
          </View>

          {/* Group Info Section */}
          {incident.incidentGroup ? (
            <View style={[styles.card, styles.groupCard]}>
              <View style={styles.groupCardHeader}>
                <Text style={styles.groupCardHeaderTitle}>📁 Grouped Incident Context</Text>
                <View style={[styles.miniBadge, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#1E40AF' }}>
                    {incident.incidentGroup.groupNumber}
                  </Text>
                </View>
              </View>
              <Text style={styles.groupCardText}>
                This report is grouped under a consolidated event. Multiple citizen tickets refer to this incident context.
              </Text>
              <View style={{ marginTop: 6, gap: 4 }}>
                {incident.incidentGroup.status && (
                  <Text style={styles.groupStatusText}>
                    Group Status: <Text style={{ fontWeight: 'bold' }}>{incident.incidentGroup.status.toUpperCase()}</Text>
                  </Text>
                )}
                {incident.incidentGroup.incidentCount !== undefined && (
                  <Text style={styles.groupStatusText}>
                    Linked Reports Count: <Text style={{ fontWeight: 'bold' }}>{incident.incidentGroup.incidentCount}</Text>
                  </Text>
                )}
                {incident.incidentGroup.severitySummary ? (
                  <Text style={styles.groupStatusText}>
                    Severity Summary: <Text style={{ fontWeight: 'bold' }}>{incident.incidentGroup.severitySummary.toUpperCase()}</Text>
                  </Text>
                ) : null}
                {incident.incidentGroup.locationSummary ? (
                  <Text style={styles.groupStatusText}>
                    Location Summary: <Text style={{ fontWeight: 'bold' }}>{incident.incidentGroup.locationSummary}</Text>
                  </Text>
                ) : null}
                <Text style={[styles.groupStatusText, { fontStyle: 'italic', color: '#F59E0B', marginTop: 4 }]}>
                  ⚠️ Note: Multiple reports may refer to the same issue. Follow command instructions before resolving.
                </Text>
              </View>
            </View>
          ) : null}

          {/* Incident Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Case Description</Text>
            <Text style={styles.descText}>{incident.description}</Text>
          </View>

          {/* AI Triage Card */}
          {incident.aiTriage ? (
            <View style={[styles.card, styles.aiCard]}>
              <View style={styles.aiHeader}>
                <Text style={styles.aiHeaderTitle}>🤖 Gemini AI Triage Advisory</Text>
              </View>
              
              <View style={styles.aiMetricsRow}>
                <Text style={styles.aiLabel}>Advisory Priority: <Text style={styles.aiPriorityVal}>{incident.aiTriage.recommendedPriority?.toUpperCase()}</Text></Text>
                <Text style={styles.aiLabel}>Risk Score: <Text style={styles.aiRiskVal}>{incident.aiTriage.riskScore}%</Text></Text>
              </View>

              <View style={styles.aiSection}>
                <Text style={styles.aiSectionTitle}>Situation Analysis</Text>
                <Text style={styles.aiSectionText}>{incident.aiTriage.shortSummary}</Text>
              </View>

              {incident.aiTriage.immediateActions && incident.aiTriage.immediateActions.length > 0 && (
                <View style={styles.aiSection}>
                  <Text style={styles.aiSectionTitle}>Immediate Dispatch Actions</Text>
                  {incident.aiTriage.immediateActions.map((action, idx) => (
                    <Text key={idx} style={styles.aiListItem}>⚡ {action}</Text>
                  ))}
                </View>
              )}

              {incident.aiTriage.responderChecklist && incident.aiTriage.responderChecklist.length > 0 && (
                <View style={styles.aiSection}>
                  <Text style={styles.aiSectionTitle}>Field Responder Checklist</Text>
                  {incident.aiTriage.responderChecklist.map((task, idx) => (
                    <Text key={idx} style={styles.aiListItem}>☐ {task}</Text>
                  ))}
                </View>
              )}

              <Text style={styles.aiDisclaimerText}>⚠️ {incident.aiTriage.disclaimer}</Text>
            </View>
          ) : null}

          {/* Geolocation Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Field Coordinates</Text>
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

          {/* Assigned Supplies */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Logistics Dispatched</Text>
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
              <Text style={styles.placeholderText}>No logistics resources bound to this incident case.</Text>
            )}
          </View>

          {/* Status Update Console */}
          {eligibleStatuses.length > 0 ? (
            <View style={[styles.card, styles.updateConsole]}>
              <Text style={styles.cardTitle}>Field Action Console</Text>

              {updateError ? (
                <View style={styles.consoleErrorBox}>
                  <Text style={styles.consoleErrorText}>⚠️ {updateError}</Text>
                </View>
              ) : null}

              {updateSuccess ? (
                <View style={styles.consoleSuccessBox}>
                  <Text style={styles.consoleSuccessText}>✓ {updateSuccess}</Text>
                </View>
              ) : null}

              {/* Status Picker dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Transition Status to *</Text>
                <TouchableOpacity
                  style={styles.dropdownToggle}
                  onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <Text style={styles.dropdownValue}>
                    {getStatusLabel(selectedStatus) || 'Select status'}
                  </Text>
                  <Text style={styles.dropdownArrow}>{showStatusDropdown ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {showStatusDropdown && (
                  <View style={styles.dropdownMenu}>
                    {eligibleStatuses.map((st) => (
                      <TouchableOpacity
                        key={st}
                        style={[styles.dropdownItem, selectedStatus === st && styles.activeItem]}
                        onPress={() => {
                          setSelectedStatus(st);
                          setShowStatusDropdown(false);
                        }}
                      >
                        <Text style={[styles.dropdownItemText, selectedStatus === st && styles.activeItemText]}>
                          {getStatusLabel(st)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Status Note input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Field Log Note (Optional)</Text>
                <TextInput
                  style={styles.consoleInput}
                  placeholder="e.g. Arrived on scene, cleared blockages..."
                  placeholderTextColor="#94A3B8"
                  value={statusNote}
                  onChangeText={setStatusNote}
                />
              </View>

              <TouchableOpacity
                style={styles.updateBtn}
                onPress={handleStatusUpdate}
                disabled={updating || !selectedStatus || !!updateSuccess}
              >
                {updating ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.updateBtnText}>Update Dispatch Status</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.card, styles.infoConsole]}>
              <Text style={styles.cardTitle}>Field Action Console</Text>
              <Text style={styles.infoConsoleText}>
                Incident is currently in a resolved/closed state. No further updates are permitted.
              </Text>
            </View>
          )}

          {/* Timeline Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dispatches Updates Timeline</Text>
            {incident.statusHistory && incident.statusHistory.length > 0 ? (
              <View style={styles.timeline}>
                {incident.statusHistory.slice().reverse().map((history, index) => {
                  const historyStatusStyle = getStatusColor(history.status);
                  const isLatest = index === 0;

                  return (
                    <View key={index} style={styles.timelineItem}>
                      <View style={styles.timelineLeft}>
                        <View style={[styles.timelineNode, isLatest && styles.latestNode]} />
                        {index < incident.statusHistory.length - 1 && <View style={styles.timelineLine} />}
                      </View>

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
              <Text style={styles.placeholderText}>No timeline history recorded.</Text>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
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
  updateConsole: {
    backgroundColor: theme.colors.surface,
    borderColor: '#3B82F6',
    borderWidth: 1.5,
  },
  infoConsole: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  infoConsoleText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
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
  consoleErrorBox: {
    backgroundColor: theme.colors.emergencyMuted,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 16,
  },
  consoleErrorText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
  },
  consoleSuccessBox: {
    backgroundColor: theme.colors.successGlow,
    borderWidth: 1,
    borderColor: theme.colors.success,
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 16,
  },
  consoleSuccessText: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownValue: {
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  dropdownArrow: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  dropdownMenu: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    marginTop: 4,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activeItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  dropdownItemText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    borderColor: '#3B82F6',
  },
  activeItemText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  consoleInput: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  updateBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...theme.shadows.button,
  },
  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: theme.typography.weights.bold,
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
    marginBottom: 10,
  },
  aiHeaderTitle: {
    fontSize: 14,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 10,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
  },
  aiPriorityVal: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
  aiRiskVal: {
    color: theme.colors.emergency,
    fontWeight: theme.typography.weights.bold,
  },
  aiSection: {
    marginBottom: 12,
  },
  aiSectionTitle: {
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  aiSectionText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  aiListItem: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
    paddingLeft: 4,
  },
  aiDisclaimerText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
    marginTop: 4,
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
