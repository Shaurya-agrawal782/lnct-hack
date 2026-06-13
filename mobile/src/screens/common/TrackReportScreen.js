import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { trackIncidentByTicket } from '../../api/trackingApi';
import { formatDateTime, getStatusColor, getSeverityColor, getIncidentTypeLabel } from '../../utils/format';
import { theme } from '../../theme';

export default function TrackReportScreen({ navigation }) {
  const [ticketNumber, setTicketNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [incidentData, setIncidentData] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);

  const handleTrack = async () => {
    if (!ticketNumber.trim()) {
      setError('Please enter a ticket number.');
      setIncidentData(null);
      return;
    }
    
    setLoading(true);
    setError('');
    setIncidentData(null);

    try {
      const res = await trackIncidentByTicket(ticketNumber.trim());
      if (res && res.success && res.data) {
        setIncidentData(res.data);
      } else {
        setError(res.message || 'No report found for this ticket number.');
      }
    } catch (err) {
      console.warn('Track report error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to retrieve report status.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = incidentData ? getStatusColor(incidentData.status) : null;
  const severityStyle = incidentData ? getSeverityColor(incidentData.severity) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          {/* Tracking Form */}
          <View style={styles.searchCard}>
            <Text style={styles.cardTitle}>Public Report Tracker</Text>
            <Text style={styles.cardSubtitle}>
              Enter a valid ticket number (e.g., DC-20260613-XXXXX) to check status updates.
            </Text>

            <TextInput
              style={[styles.input, inputFocused && styles.inputFocused]}
              placeholder="DC-YYYYMMDD-XXXXX"
              placeholderTextColor={theme.colors.textPlaceholder}
              value={ticketNumber}
              onChangeText={setTicketNumber}
              autoCapitalize="characters"
              autoCorrect={false}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleTrack}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.textPrimary} />
              ) : (
                <Text style={styles.buttonText}>Search Status</Text>
              )}
            </TouchableOpacity>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}
          </View>

          {/* Results Panel */}
          {incidentData && (
            <View style={styles.resultsCard}>
              <View style={styles.headerRow}>
                <Text style={styles.ticketTitle} selectable>🎫 Ticket: {incidentData.ticketNumber}</Text>
              </View>

              <Text style={styles.reportTitle}>{incidentData.title}</Text>
              
              <View style={styles.badgeRow}>
                {severityStyle && (
                  <View style={[styles.badge, { backgroundColor: severityStyle.bg, borderColor: severityStyle.border }]}>
                    <Text style={[styles.badgeText, { color: severityStyle.text }]}>
                      {incidentData.severity?.toUpperCase()} SEVERITY
                    </Text>
                  </View>
                )}

                {statusStyle && (
                  <View style={[styles.badge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                    <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                      STATUS: {incidentData.status?.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Incident Type</Text>
                <Text style={styles.infoValue}>{getIncidentTypeLabel(incidentData.type)}</Text>
              </View>

              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Location / Landmark</Text>
                <Text style={styles.infoValue}>📍 {incidentData.address}</Text>
              </View>

              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Reported At</Text>
                <Text style={styles.infoValue}>{formatDateTime(incidentData.createdAt)}</Text>
              </View>

              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>{formatDateTime(incidentData.updatedAt)}</Text>
              </View>

              {/* Group Case Details */}
              {incidentData.groupInfo && (
                <View style={styles.groupPanel}>
                  <View style={styles.groupHeader}>
                    <Text style={styles.groupHeaderTitle}>📁 Linked Group Case</Text>
                    <View style={styles.miniBadge}>
                      <Text style={styles.miniBadgeText}>{incidentData.groupInfo.groupNumber}</Text>
                    </View>
                  </View>
                  <Text style={styles.groupMessage}>{incidentData.groupInfo.message}</Text>
                  <Text style={styles.groupStatus}>
                    Consolidated Status: <Text style={{ fontWeight: 'bold' }}>{incidentData.groupInfo.status.toUpperCase()}</Text>
                  </Text>
                </View>
              )}

              {/* AI Safety Advice */}
              {incidentData.aiSafetyNote ? (
                <View style={styles.aiPanel}>
                  <Text style={styles.aiHeaderTitle}>🤖 Safety Instructions (AI Advisory)</Text>
                  <Text style={styles.aiSafetyText}>{incidentData.aiSafetyNote}</Text>
                </View>
              ) : null}

              {/* Public Timeline */}
              {incidentData.publicTimeline && incidentData.publicTimeline.length > 0 && (
                <View style={styles.timelineContainer}>
                  <Text style={styles.timelineHeader}>Tracking Timeline</Text>
                  {incidentData.publicTimeline.slice().reverse().map((h, i) => {
                    const hStyle = getStatusColor(h.status);
                    return (
                      <View key={i} style={styles.timelineItem}>
                        <View style={styles.timelineBullet} />
                        <View style={styles.timelineContent}>
                          <View style={[styles.miniStatusBadge, { backgroundColor: hStyle.bg, borderColor: hStyle.border }]}>
                            <Text style={{ color: hStyle.text, fontSize: 10, fontWeight: '700' }}>
                              {h.status.toUpperCase()}
                            </Text>
                          </View>
                          <Text style={styles.timelineTime}>{formatDateTime(h.changedAt)}</Text>
                          {h.note ? <Text style={styles.timelineNote}>{h.note}</Text> : null}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Go Back / Home navigation helper */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Return to Login</Text>
          </TouchableOpacity>

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
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  searchCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 18,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  inputFocused: {
    borderColor: theme.colors.borderFocus,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.button,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  errorBox: {
    backgroundColor: theme.colors.emergencyMuted,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.emergency,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.lg,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  resultsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  headerRow: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  ticketTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.cyan,
  },
  reportTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  badge: {
    borderWidth: 1,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.heavy,
  },
  infoGroup: {
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  groupPanel: {
    backgroundColor: theme.colors.warningGlow,
    borderColor: theme.colors.warning,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  groupHeaderTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.warning,
  },
  miniBadge: {
    backgroundColor: theme.colors.warning,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  miniBadgeText: {
    color: theme.colors.background,
    fontSize: 10,
    fontWeight: theme.typography.weights.heavy,
  },
  groupMessage: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  groupStatus: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  aiPanel: {
    backgroundColor: theme.colors.cyanGlow,
    borderColor: theme.colors.cyan,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  aiHeaderTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.cyan,
    marginBottom: theme.spacing.xs,
  },
  aiSafetyText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  timelineContainer: {
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.lg,
  },
  timelineHeader: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  timelineBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
    marginRight: theme.spacing.md,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  miniStatusBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: theme.spacing.xs,
  },
  timelineTime: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  timelineNote: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  backButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  backButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
});
