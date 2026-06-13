import React, { useState, useContext, useCallback } from 'react';
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
import { AuthContext } from '../../context/AuthContext';
import { getMyAlerts, markAlertRead, markAllAlertsRead } from '../../api/alertApi';
import { formatDateTime, getSeverityColor } from '../../utils/format';

export default function AlertsScreen() {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Helper to check if the current user has read the alert
  const isAlertRead = useCallback((alert) => {
    if (!alert.readBy || !user?._id) return false;
    return alert.readBy.some(
      (entry) => (entry.user?._id || entry.user || entry) === user._id
    );
  }, [user?._id]);

  const fetchAlerts = useCallback(async (showIndicator = true) => {
    if (showIndicator) setLoading(true);
    setError('');
    try {
      const res = await getMyAlerts();
      if (res && res.success && res.data && res.data.alerts) {
        setAlerts(res.data.alerts);
      } else {
        setError('Failed to fetch alerts.');
      }
    } catch (err) {
      console.error('Fetch alerts error:', err);
      const msg = err.response?.data?.message || err.message || 'Error loading alerts feed.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAlerts(true);
    }, [fetchAlerts])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts(false);
  };

  const handleMarkRead = async (id) => {
    setActionLoading(true);
    try {
      const res = await markAlertRead(id);
      if (res.success && res.data && res.data.alert) {
        // Update local state directly to be fast and smooth
        setAlerts((prev) =>
          prev.map((a) => (a._id === id ? res.data.alert : a))
        );
      }
    } catch (err) {
      console.error('Mark read error:', err);
      // Soft error
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      const res = await markAllAlertsRead();
      if (res.success) {
        // Refetch feed to reflect updates
        await fetchAlerts(false);
      }
    } catch (err) {
      console.error('Mark all read error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const renderFormattedMessage = (text) => {
    if (!text) return null;
    const regex = /(DC-\d{8}-\d{5}|GRP-\d{8}-[A-Za-f0-9]+)/g;
    const parts = text.split(regex);
    return (
      <Text>
        {parts.map((part, index) => {
          if (part.match(/^DC-\d{8}-\d{5}$/) || part.match(/^GRP-\d{8}-[A-Za-f0-9]+$/)) {
            return (
              <Text key={index} style={{ fontWeight: '800', color: '#1D4ED8' }}>
                {part}
              </Text>
            );
          }
          return <Text key={index}>{part}</Text>;
        })}
      </Text>
    );
  };

  const renderAlertItem = ({ item }) => {
    const read = isAlertRead(item);
    const priorityStyle = getSeverityColor(item.priority || 'medium');

    return (
      <View style={[styles.card, read ? styles.readCard : styles.unreadCard]}>
        {/* Unread blue dot indicator */}
        {!read && <View style={styles.unreadDot} />}

        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, read ? styles.readText : styles.unreadText]}>
            {item.title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg, borderColor: priorityStyle.border }]}>
            <Text style={[styles.priorityBadgeText, { color: priorityStyle.text }]}>
              {item.priority?.toUpperCase() || 'MEDIUM'}
            </Text>
          </View>
        </View>

        <Text style={[styles.messageText, read ? styles.readMutedText : styles.unreadMutedText]}>
          {renderFormattedMessage(item.message)}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
          
          {!read && (
            <TouchableOpacity
              style={styles.markReadBtn}
              onPress={() => handleMarkRead(item._id)}
              disabled={actionLoading}
            >
              <Text style={styles.markReadBtnText}>Mark read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Role scoped header strings
  const isCitizen = user?.role === 'citizen';
  const screenTitle = isCitizen ? 'Safety Updates' : 'Field Alerts';
  const screenSubtitle = isCitizen
    ? 'Updates about your submitted reports and public safety notices.'
    : 'Assignment, status, and command updates for response work.';

  const hasUnread = alerts.some((a) => !isAlertRead(a));

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Fetching alerts feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id}
        renderItem={renderAlertItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.titleRow}>
              <View style={styles.titleCol}>
                <Text style={styles.screenTitle}>{screenTitle}</Text>
                <Text style={styles.screenSubtitle}>{screenSubtitle}</Text>
              </View>
              {hasUnread && (
                <TouchableOpacity
                  style={styles.markAllBtn}
                  onPress={handleMarkAllRead}
                  disabled={actionLoading}
                >
                  <Text style={styles.markAllBtnText}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No alerts yet</Text>
            <Text style={styles.emptyDesc}>Safety updates and emergency broadcasts will appear here.</Text>
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
  headerContainer: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  titleCol: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  markAllBtn: {
    backgroundColor: theme.colors.primaryGlow,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  markAllBtnText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: theme.typography.weights.semibold,
  },
  errorBox: {
    backgroundColor: theme.colors.emergencyMuted,
    borderColor: theme.colors.emergency,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginTop: 16,
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
    position: 'relative',
    ...theme.shadows.card,
  },
  unreadCard: {
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  readCard: {
    borderColor: theme.colors.border,
    opacity: 0.8,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    flex: 1,
    marginRight: 12,
  },
  unreadText: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  readText: {
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
  },
  priorityBadge: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  priorityBadgeText: {
    fontSize: 8,
    fontWeight: theme.typography.weights.bold,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  unreadMutedText: {
    color: theme.colors.textPrimary,
  },
  readMutedText: {
    color: theme.colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  markReadBtn: {
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  markReadBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: theme.typography.weights.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 120,
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
