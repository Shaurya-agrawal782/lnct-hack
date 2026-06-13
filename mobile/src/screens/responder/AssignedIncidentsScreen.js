import React, { useState, useCallback } from 'react';
import { theme } from '../../theme';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getIncidents } from '../../api/incidentApi';
import { formatDateTime, getStatusColor, getSeverityColor, getIncidentTypeLabel } from '../../utils/format';

export default function AssignedIncidentsScreen({ navigation }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchAssignedIncidents = useCallback(async (showIndicator = true) => {
    if (showIndicator) setLoading(true);
    setError('');
    try {
      // getIncidents scopes naturally on the backend.
      // Under Responder RBAC role on backend, it automatically scopes to assignedResponder = req.user._id.
      const res = await getIncidents();
      if (res && res.success && res.data && res.data.incidents) {
        setIncidents(res.data.incidents);
      } else {
        setError('Failed to retrieve assigned dispatches.');
      }
    } catch (err) {
      console.error('Fetch dispatches error:', err);
      const msg = err.response?.data?.message || err.message || 'Error loading dispatches from server.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAssignedIncidents(true);
    }, [fetchAssignedIncidents])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAssignedIncidents(false);
  };

  const renderIncidentItem = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    const severityStyle = getSeverityColor(item.severity);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ResponderIncidentDetail', { id: item._id })}
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

        <View style={styles.cardMetaRow}>
          <Text style={styles.typeText}>{getIncidentTypeLabel(item.type)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {item.incidentGroup ? (
              <View style={[styles.statusBadge, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}>
                <Text style={[styles.statusBadgeText, { color: '#1E40AF' }]}>
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
          <Text style={styles.dateText}>{formatDateTime(item.updatedAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Fetching assigned incidents...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item._id}
        renderItem={renderIncidentItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No assigned dispatches</Text>
            <Text style={styles.emptyDesc}>
              Active dispatch operations assigned to your responder profile will log here.
            </Text>
          </View>
        }
        ListHeaderComponent={
          error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null
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
    fontSize: 14,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
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
  },
});
