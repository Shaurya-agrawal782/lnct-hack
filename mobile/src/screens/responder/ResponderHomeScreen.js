import React, { useContext, useState, useCallback } from 'react';
import { theme } from '../../theme';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { getMyAlerts } from '../../api/alertApi';

export default function ResponderHomeScreen({ navigation }) {
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
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.welcomeText}>Active Responder,</Text>
            <Text style={styles.userName}>{user?.name || 'Field Operator'}</Text>
          </View>
          <View style={styles.roleTag}>
            <Text style={styles.roleText}>FIELD RESPONDER</Text>
          </View>
        </View>

        {/* Short info note */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            Update assigned incidents from the field and log dispatch updates.
          </Text>
        </View>

        {/* Navigation Action Buttons / Cards */}
        <View style={styles.menuList}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('AssignedIncidents')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardIcon}>📋</Text>
                <Text style={styles.cardTitle}>My Assigned Incidents</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>
              View details, map routing, and update status of your assigned incident cases.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Alerts')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardIcon}>🔔</Text>
                <Text style={styles.cardTitle}>Emergency Alerts Feed</Text>
              </View>
              {unreadCount > 0 && (
                <View style={styles.badgeOverlay}>
                  <Text style={styles.badgeOverlayText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardDesc}>
              Read real-time disaster alerts, area warnings, and admin updates.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('ResponderProfile')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardIcon}>👤</Text>
                <Text style={styles.cardTitle}>My Responder Profile</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>
              View your shift parameters, badges, zone limits, and safety verification details.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
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
    backgroundColor: theme.colors.successGlow,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  roleText: {
    color: theme.colors.success,
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
  menuList: {
    gap: 16,
    marginBottom: 32,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  cardDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
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

