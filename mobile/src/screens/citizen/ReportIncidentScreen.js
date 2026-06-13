import React, { useState } from 'react';
import { theme } from '../../theme';
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
import * as Location from 'expo-location';
import { createIncident } from '../../api/incidentApi';
import { analyzeReportDraft } from '../../api/aiApi';

const INCIDENT_TYPES = [
  { label: 'Fire', value: 'fire' },
  { label: 'Flood', value: 'flood' },
  { label: 'Medical Emergency', value: 'medical' },
  { label: 'Accident', value: 'accident' },
  { label: 'Crowd Hazard', value: 'crowd' },
  { label: 'Rescue Ops', value: 'rescue' },
  { label: 'Other', value: 'other' }
];

const SEVERITY_LEVELS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' }
];

export default function ReportIncidentScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('other');
  const [severity, setSeverity] = useState('medium');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [landmark, setLandmark] = useState('');

  // AI assistant states
  const [aiDraft, setAiDraft] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiUnavailableMessage, setAiUnavailableMessage] = useState('');

  // Dropdown UI expand/collapse states
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);

  const handleAnalyzeDraft = async () => {
    if (!aiDraft.trim()) {
      setAiError('Please enter some description or rough draft of what happened.');
      return;
    }
    if (aiDraft.trim().length < 10) {
      setAiError('Please describe the situation in at least 10 characters.');
      return;
    }

    setAiLoading(true);
    setAiError('');
    setAiUnavailableMessage('');
    setAiSuggestions(null);

    try {
      const payload = {
        text: aiDraft.trim(),
        location: address || undefined,
        coordinates: (latitude && longitude) ? {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        } : undefined
      };

      const res = await analyzeReportDraft(payload);
      if (res.success) {
        setAiSuggestions(res.data);
      } else {
        setAiUnavailableMessage(res.message || 'AI Report Assistant is currently unavailable.');
      }
    } catch (err) {
      console.warn('AI analysis error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to analyze draft.';
      setAiError(msg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplySuggestions = () => {
    if (!aiSuggestions) return;
    setTitle(aiSuggestions.suggestedTitle || '');
    setDescription(aiSuggestions.improvedDescription || '');
    setType(aiSuggestions.suggestedType || 'other');
    setSeverity(aiSuggestions.suggestedSeverity || 'medium');
    setAiSuggestions(null);
    setAiDraft('');
  };

  // Loading / Messages
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationSuccess, setLocationSuccess] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [successTicket, setSuccessTicket] = useState('');

  const handleUseCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    setLocationSuccess(null);
    setAccuracy(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission is required to submit an incident report. Please allow location access and try again.');
        setLocationLoading(false);
        return;
      }

      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        setLocationError('Unable to fetch current location. Please try again in an open area or enable location services.');
        setLocationLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (position && position.coords) {
        const { latitude: lat, longitude: lng, accuracy: acc } = position.coords;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setAccuracy(acc);
        setLocationSuccess('Location coordinates captured.');

        // Reverse geocode via Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'DisasterConnectMobile/1.0'
              }
            }
          );
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              setAddress(data.display_name);
            }
          }
        } catch (reverseErr) {
          console.warn('Nominatim reverse geocoding skipped/failed:', reverseErr);
        }
      } else {
        setLocationError('Unable to fetch current location. Please try again in an open area or enable location services.');
      }
    } catch (err) {
      console.warn('GPS Error:', err);
      setLocationError('Unable to fetch current location. Please try again in an open area or enable location services.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!latitude || !longitude) {
      setError('Location permission is required to submit an incident report. Please allow location access and try again.');
      return;
    }

    if (!landmark.trim()) {
      setError('Please enter a landmark or nearby place to help responders locate the incident.');
      return;
    }

    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      setError('Please enter a valid Latitude between -90 and 90.');
      return;
    }

    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      setError('Please enter a valid Longitude between -180 and 180.');
      return;
    }

    setLoading(true);
    try {
      const finalAddress = `${landmark.trim()} — Detected: ${address.trim()}`;

      const payload = {
        title: title.trim(),
        description: description.trim(),
        type,
        severity,
        location: {
          coordinates: [lngNum, latNum], // [lng, lat] GeoJSON order
          address: finalAddress
        }
      };

      const res = await createIncident(payload);
      if (res.success) {
        const ticket = res.data?.incident?.ticketNumber || '';
        setSuccessTicket(ticket);
        setSuccess('Incident reported successfully!');
        setTitle('');
        setDescription('');
        setAddress('');
        setLatitude('');
        setLongitude('');
        setLandmark('');
        setAccuracy(null);

        setTimeout(() => {
          navigation.navigate('MyReports');
        }, 4000);
      } else {
        setError(res.message || 'Failed to submit incident.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Submission failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Incident Information</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {success ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✅ {success}</Text>
                {successTicket ? (
                  <>
                    <Text style={styles.ticketLabel}>Your Ticket Number</Text>
                    <Text style={styles.ticketValue} selectable>{successTicket}</Text>
                    <Text style={styles.ticketHint}>Save this to track your report status. Redirecting to My Reports...</Text>
                  </>
                ) : null}
              </View>
            ) : null}

            {/* AI Assistant Section */}
            <View style={styles.aiContainer}>
              <View style={styles.aiHeaderRow}>
                <Text style={styles.aiHeaderTitle}>🧠 AI Report Assistant</Text>
              </View>
              <Text style={styles.aiSubText}>
                Describe what happened in your own words (Hindi, Hinglish, or English) and let AI suggest structured report fields.
              </Text>
              
              <TextInput
                style={[styles.input, styles.aiTextArea]}
                placeholder="e.g. main gate ke pass bahut bheed hai log dhakka de rahe hain"
                placeholderTextColor="#94A3B8"
                value={aiDraft}
                onChangeText={setAiDraft}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />

              <View style={styles.aiActionRow}>
                <TouchableOpacity
                  style={[styles.aiBtn, aiLoading && styles.disabledBtn]}
                  onPress={handleAnalyzeDraft}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <ActivityIndicator color="#2563EB" size="small" />
                  ) : (
                    <Text style={styles.aiBtnText}>✨ Analyze with AI</Text>
                  )}
                </TouchableOpacity>

                {aiSuggestions && (
                  <TouchableOpacity onPress={() => { setAiSuggestions(null); setAiDraft(''); }}>
                    <Text style={styles.aiClearText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>

              {aiError ? (
                <View style={styles.aiErrorBox}>
                  <Text style={styles.aiErrorText}>⚠️ {aiError}</Text>
                </View>
              ) : null}

              {aiUnavailableMessage ? (
                <View style={styles.aiInfoBox}>
                  <Text style={styles.aiInfoText}>ℹ️ {aiUnavailableMessage}</Text>
                </View>
              ) : null}

              {aiSuggestions ? (
                <View style={styles.aiSuggestionsCard}>
                  <Text style={styles.aiSuggestionsTitle}>AI Suggestions Preview</Text>
                  
                  <View style={styles.aiGrid}>
                    <View style={styles.aiGridItem}>
                      <Text style={styles.aiGridLabel}>Suggested Title:</Text>
                      <Text style={styles.aiGridValue}>{aiSuggestions.suggestedTitle}</Text>
                    </View>
                    <View style={styles.aiGridItem}>
                      <Text style={styles.aiGridLabel}>Type / Severity:</Text>
                      <Text style={styles.aiGridValue}>
                        {aiSuggestions.suggestedType.toUpperCase()} / {aiSuggestions.suggestedSeverity.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.aiDetailSection}>
                    <Text style={styles.aiGridLabel}>Improved Description:</Text>
                    <Text style={styles.aiImprovedText}>{aiSuggestions.improvedDescription}</Text>
                  </View>

                  {aiSuggestions.missingQuestions && aiSuggestions.missingQuestions.length > 0 ? (
                    <View style={styles.aiDetailSection}>
                      <Text style={styles.aiGridLabel}>Clarify these details if possible:</Text>
                      {aiSuggestions.missingQuestions.map((q, idx) => (
                        <Text key={idx} style={styles.aiListItem}>• {q}</Text>
                      ))}
                    </View>
                  ) : null}

                  {aiSuggestions.citizenSafetyTips && aiSuggestions.citizenSafetyTips.length > 0 ? (
                    <View style={styles.aiSafetyTipsContainer}>
                      <Text style={styles.aiSafetyTipsTitle}>🛡️ Safety Guidance:</Text>
                      {aiSuggestions.citizenSafetyTips.map((tip, idx) => (
                        <Text key={idx} style={styles.aiSafetyTipItem}>• {tip}</Text>
                      ))}
                    </View>
                  ) : null}

                  <Text style={styles.aiDisclaimer}>{aiSuggestions.disclaimer}</Text>

                  <View style={styles.aiButtonRow}>
                    <TouchableOpacity style={styles.aiApplyBtn} onPress={handleApplySuggestions}>
                      <Text style={styles.aiApplyBtnText}>Apply Suggestions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.aiKeepManualBtn} onPress={() => setAiSuggestions(null)}>
                      <Text style={styles.aiKeepManualBtnText}>Ignore</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Incident Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Chemical leak in warehouse"
                placeholderTextColor="#94A3B8"
                value={title}
                onChangeText={setTitle}
                maxLength={120}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide a detailed description of the emergency..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={2000}
                textAlignVertical="top"
              />
            </View>

            {/* Custom Accordion Dropdown for Incident Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Incident Type *</Text>
              <TouchableOpacity
                style={styles.dropdownToggle}
                onPress={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowSeverityDropdown(false);
                }}
              >
                <Text style={styles.dropdownValue}>
                  {INCIDENT_TYPES.find((t) => t.value === type)?.label || 'Select Type'}
                </Text>
                <Text style={styles.dropdownArrow}>{showTypeDropdown ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showTypeDropdown && (
                <View style={styles.dropdownMenu}>
                  {INCIDENT_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[styles.dropdownItem, type === t.value && styles.activeItem]}
                      onPress={() => {
                        setType(t.value);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, type === t.value && styles.activeItemText]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Custom Accordion Dropdown for Severity */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Severity Level *</Text>
              <TouchableOpacity
                style={styles.dropdownToggle}
                onPress={() => {
                  setShowSeverityDropdown(!showSeverityDropdown);
                  setShowTypeDropdown(false);
                }}
              >
                <Text style={styles.dropdownValue}>
                  {SEVERITY_LEVELS.find((s) => s.value === severity)?.label || 'Select Severity'}
                </Text>
                <Text style={styles.dropdownArrow}>{showSeverityDropdown ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showSeverityDropdown && (
                <View style={styles.dropdownMenu}>
                  {SEVERITY_LEVELS.map((s) => (
                    <TouchableOpacity
                      key={s.value}
                      style={[styles.dropdownItem, severity === s.value && styles.activeItem]}
                      onPress={() => {
                        setSeverity(s.value);
                        setShowSeverityDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, severity === s.value && styles.activeItemText]}>
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Incident Location</Text>

            {/* Use current location trigger */}
            <View style={styles.locationTriggerRow}>
              <TouchableOpacity
                style={[styles.locationBtn, locationLoading && styles.disabledBtn]}
                onPress={handleUseCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator color="#2563EB" size="small" />
                ) : (
                  <Text style={styles.locationBtnText}>📍 Use Current Location</Text>
                )}
              </TouchableOpacity>

              {accuracy !== null && (
                <View style={styles.accuracyTag}>
                  <Text style={styles.accuracyTagText}>±{Math.round(accuracy)}m</Text>
                </View>
              )}
            </View>

            {locationSuccess ? (
              <View style={styles.miniSuccessBox}>
                <Text style={styles.miniSuccessText}>✓ {locationSuccess}</Text>
              </View>
            ) : null}

            {locationError ? (
              <View style={styles.miniErrorBox}>
                <Text style={styles.miniErrorText}>⚠️ {locationError}</Text>
              </View>
            ) : null}

            {/* Landmark / Nearby Place */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Landmark / Nearby Place *</Text>
              <TextInput
                style={styles.input}
                placeholder="Example: Main gate, near parking area, Block A entrance"
                placeholderTextColor="#94A3B8"
                value={landmark}
                onChangeText={setLandmark}
              />
            </View>

            {/* Read-Only Location Summary Card */}
            {(latitude && longitude) ? (
              <View style={styles.locationSummaryCard}>
                <Text style={styles.locationSummaryTitle}>📍 Captured GPS Coordinates</Text>
                
                <View style={styles.locationSummaryGrid}>
                  <View style={styles.locationSummaryCol}>
                    <Text style={styles.locationSummaryLabel}>Latitude</Text>
                    <Text style={styles.locationSummaryValue}>{latitude}</Text>
                  </View>
                  <View style={styles.locationSummaryCol}>
                    <Text style={styles.locationSummaryLabel}>Longitude</Text>
                    <Text style={styles.locationSummaryValue}>{longitude}</Text>
                  </View>
                </View>

                {accuracy !== null ? (
                  <Text style={styles.locationSummaryAccuracy}>GPS Accuracy: ±{Math.round(accuracy)}m</Text>
                ) : null}

                {address ? (
                  <View style={styles.locationSummaryAddressBox}>
                    <Text style={styles.locationSummaryLabel}>Detected Address</Text>
                    <Text style={styles.locationSummaryAddressText}>{address}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            <Text style={styles.noteText}>
              Privacy Note: Your location is used only for this incident report and command response.
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.navigate('CitizenHome')}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={loading || !!success}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit Report</Text>
                )}
              </TouchableOpacity>
            </View>
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
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: theme.colors.emergencyMuted,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.emergency,
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  successBox: {
    backgroundColor: theme.colors.successGlow,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 16,
  },
  successText: {
    color: theme.colors.success,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    marginBottom: 8,
  },
  ticketLabel: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 6,
    marginBottom: 2,
  },
  ticketValue: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: theme.typography.weights.heavy,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  ticketHint: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  textArea: {
    height: 100,
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
    fontSize: theme.typography.sizes.md,
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
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  activeItemText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },
  locationTriggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationBtn: {
    backgroundColor: theme.colors.primaryGlow,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  locationBtnText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.md,
  },
  accuracyTag: {
    backgroundColor: theme.colors.successGlow,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
    marginLeft: 12,
  },
  accuracyTagText: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: theme.typography.weights.semibold,
  },
  miniSuccessBox: {
    backgroundColor: theme.colors.successGlow,
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 12,
  },
  miniSuccessText: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
  },
  miniErrorBox: {
    backgroundColor: theme.colors.warningGlow,
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 12,
  },
  miniErrorText: {
    color: theme.colors.warning,
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  coordCol: {
    flex: 1,
  },
  noteText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelBtn: {
    flex: 1,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: theme.colors.emergency,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.emergency,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  aiContainer: {
    backgroundColor: '#0B1220',
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2E3E59',
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiHeaderTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  aiSubText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 10,
    lineHeight: 16,
  },
  aiTextArea: {
    height: 60,
    backgroundColor: theme.colors.inputBackground,
    fontSize: 14,
    paddingVertical: 6,
  },
  aiActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  aiBtn: {
    backgroundColor: theme.colors.primaryGlow,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  aiBtnText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
    fontSize: 13,
  },
  aiClearText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: theme.typography.weights.medium,
  },
  aiErrorBox: {
    backgroundColor: theme.colors.emergencyGlow,
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    marginTop: 10,
  },
  aiErrorText: {
    color: theme.colors.emergency,
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
  },
  aiInfoBox: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    marginTop: 10,
  },
  aiInfoText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
  },
  aiSuggestionsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#2E3E59',
    padding: 12,
    marginTop: 12,
  },
  aiSuggestionsTitle: {
    fontSize: 14,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 4,
  },
  aiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  aiGridItem: {
    flex: 1,
  },
  aiGridLabel: {
    fontSize: 11,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  aiGridValue: {
    fontSize: 13,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  aiDetailSection: {
    marginTop: 8,
  },
  aiImprovedText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.inputBackground,
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    lineHeight: 18,
  },
  aiListItem: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  aiSafetyTipsContainer: {
    backgroundColor: theme.colors.successGlow,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    marginTop: 10,
  },
  aiSafetyTipsTitle: {
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.success,
    marginBottom: 4,
  },
  aiSafetyTipItem: {
    fontSize: 12,
    color: theme.colors.success,
    lineHeight: 16,
  },
  aiDisclaimer: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 14,
  },
  aiButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  aiApplyBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  aiApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: theme.typography.weights.bold,
  },
  aiKeepManualBtn: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  aiKeepManualBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: theme.typography.weights.semibold,
  },
  locationSummaryCard: {
    backgroundColor: '#0B1220',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#2E3E59',
    padding: 14,
    marginBottom: 16,
  },
  locationSummaryTitle: {
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  locationSummaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 12,
  },
  locationSummaryCol: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  locationSummaryLabel: {
    fontSize: 9,
    fontWeight: theme.typography.weights.semibold,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  locationSummaryValue: {
    fontSize: 14,
    fontWeight: theme.typography.weights.bold,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  locationSummaryAccuracy: {
    fontSize: 11,
    color: theme.colors.success,
    fontWeight: theme.typography.weights.medium,
    marginBottom: 8,
  },
  locationSummaryAddressBox: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
    marginTop: 4,
  },
  locationSummaryAddressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
});
