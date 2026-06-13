import React, { useState, useCallback } from 'react';
import { theme } from '../../theme';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getIncidents } from '../../api/incidentApi';
import { formatDateTime, getStatusColor, getSeverityColor, getIncidentTypeLabel } from '../../utils/format';

export default function MyReportsScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');

  const fetchReports = useCallback(async (showIndicator = true) => {
    if (showIndicator) setLoading(true);
    setError('');
    try {
      // getIncidents without params fetches all incidents.
      // Under Citizen RBAC role on backend, it automatically scopes to reportedBy = req.user._id.
      const res = await getIncidents();
      if (res && res.success && res.data && res.data.incidents) {
        setReports(res.data.incidents);
      } else {
        setError('Failed to load incident reports.');
      }
    } catch (err) {
      console.error('Fetch reports error:', err);
      const msg = err.response?.data?.message || err.message || 'Error loading incident history.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchReports(true);
    }, [fetchReports])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReports(false);
  };

  const renderReportItem = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    const severityStyle = getSeverityColor(item.severity);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('IncidentDetail', { id: item._id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: severityStyle.bg, borderColor: severityStyle.border }]}>
            <Text style={[styles.badgeText, { color: severityStyle.text }]}>
              {item.severity?.toUpperCase()}
            </Text>
          </View>
        </View>

        {item.ticketNumber && (
          <Text style={styles.ticketText} selectable>🎫 {item.ticketNumber}</Text>
        )}

        <View style={styles.cardMetaRow}>
          <Text style={styles.typeText}>{getIncidentTypeLabel(item.type)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {item.incidentGroup ? (
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(6, 182, 212, 0.12)', borderColor: '#06B6D4' }]}>
                <Text style={[styles.statusBadgeText, { color: '#06B6D4' }]}>
                  📁 GROUPED
                </Text>
              </View>
            ) : null}
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
              <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                {item.status?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.descText} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.addressText} numberOfLines={1}>
            📍 {item.location?.address || 'No Address'}
          </Text>
          <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Fetching your reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const searchLower = ticketSearch.trim().toLowerCase();
  const filteredReports = searchLower
    ? reports.filter(r =>
        (r.ticketNumber && r.ticketNumber.toLowerCase().includes(searchLower)) ||
        (r.title && r.title.toLowerCase().includes(searchLower))
      )
    : reports;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item._id}
        renderItem={renderReportItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
        }
        ListHeaderComponent={
          <>
            {/* Ticket Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by ticket number or title..."
                placeholderTextColor="#94A3B8"
                value={ticketSearch}
                onChangeText={setTicketSearch}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={styles.emptyTitle}>
              {ticketSearch ? 'No matching reports' : 'No reports yet'}
            </Text>
            <Text style={styles.emptyDesc}>
              {ticketSearch
                ? 'Try a different ticket number or title search.'
                : 'Submit an incident to notify the command and emergency response team.'}
            </Text>
            {!ticketSearch && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('ReportIncident')}
              >
                <Text style={styles.emptyBtnText}>Report Incident Now</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
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
  errorBox: {
    backgroundColor: theme.colors.emergencyMuted,
    borderColor: theme.colors.emergency,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  badge: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeText: {
    fontSize: 13,
    color: theme.colors.cyan,
    fontWeight: theme.typography.weights.semibold,
  },
  statusBadge: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.bold,
  },
  descText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  addressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
    marginRight: 16,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  ticketText: {
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  searchContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    ...theme.shadows.button,
  },
  emptyBtnText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
  },
});
