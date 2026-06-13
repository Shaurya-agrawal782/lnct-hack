import React, { useContext, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { getMyAlerts } from '../../api/alertApi';
import { theme } from '../../theme';

export default function CitizenHomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await getMyAlerts({ unreadOnly: 'true', limit: 1 });
      if (res && res.success && res.data && res.data.pagination) {
        setUnreadCount(res.data.pagination.totalItems || 0);
      }
    } catch (err) {
      console.warn('Unread count fetch warning:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [fetchUnreadCount])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userName}>{user?.name || 'Citizen'}</Text>
          </View>
          <View style={styles.roleTag}>
            <Text style={styles.roleText}>CITIZEN</Text>
          </View>
        </View>

        {/* Short info note */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            Report local emergencies and track active responders in real-time.
          </Text>
        </View>

        {/* Primary CTA - Report Incident */}
        <TouchableOpacity
          style={styles.emergencyBtn}
          onPress={() => navigation.navigate('ReportIncident')}
          activeOpacity={0.9}
        >
          <Text style={styles.emergencyBtnTitle}>🚨 REPORT INCIDENT</Text>
          <Text style={styles.emergencyBtnSubtitle}>File a new emergency report</Text>
        </TouchableOpacity>

        {/* Action Cards Grid */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MyReports')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardIcon}>📁</Text>
            </View>
            <Text style={styles.cardTitle}>My Reports</Text>
            <Text style={styles.cardDesc}>View your submitted incident reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Alerts')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.badgeOverlay}>
                  <Text style={styles.badgeOverlayText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardTitle}>Alerts Feed</Text>
            <Text style={styles.cardDesc}>Safety warnings & local alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Track a Ticket Button */}
        <TouchableOpacity
          style={styles.trackTicketBtn}
          onPress={() => navigation.navigate('TrackReport')}
          activeOpacity={0.8}
        >
          <Text style={styles.trackTicketBtnText}>🔍 Track a Ticket by Number</Text>
        </TouchableOpacity>
 
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  profileHeader: {
    flex: 1,
  },
  welcomeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
  },
  userName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    marginTop: 2,
  },
  roleTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  roleText: {
    color: theme.colors.cyan,
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 0.5,
  },
  infoBanner: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.md,
    lineHeight: 20,
    textAlign: 'center',
  },
  emergencyBtn: {
    backgroundColor: theme.colors.emergency,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...theme.shadows.emergency,
  },
  emergencyBtnTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.heavy,
    letterSpacing: 0.5,
  },
  emergencyBtnSubtitle: {
    color: '#FFCDCD',
    fontSize: theme.typography.sizes.xs,
    marginTop: 4,
    fontWeight: theme.typography.weights.medium,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 28,
  },
  cardIcon: {
    fontSize: 24,
  },
  badgeOverlay: {
    backgroundColor: theme.colors.emergency,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeOverlayText: {
    color: theme.colors.textPrimary,
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  trackTicketBtn: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    ...theme.shadows.card,
  },
  trackTicketBtnText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  logoutBtn: {
    borderColor: theme.colors.textMuted,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
});
