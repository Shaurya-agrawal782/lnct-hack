import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import * as authApi from '../../api/authApi';
import { theme } from '../../theme';

export default function ResponderProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFreshProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.me();
      if (res && res.success && res.data && res.data.user) {
        setProfileUser(res.data.user);
      } else {
        setError('Failed to refresh profile information.');
      }
    } catch (err) {
      console.warn('Refresh profile error:', err);
      setError('Could not retrieve latest profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreshProfile();
  }, []);

  const getVerificationBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return { bg: theme.colors.successGlow, text: theme.colors.success, border: 'rgba(16, 185, 129, 0.2)' };
      case 'pending':
        return { bg: theme.colors.warningGlow, text: theme.colors.warning, border: 'rgba(245, 158, 11, 0.2)' };
      case 'rejected':
        return { bg: theme.colors.emergencyGlow, text: theme.colors.emergency, border: 'rgba(239, 68, 68, 0.2)' };
      default:
        return { bg: theme.colors.surface, text: theme.colors.textSecondary, border: theme.colors.border };
    }
  };

  const badgeStyle = getVerificationBadgeColor(profileUser?.responderProfile?.verificationStatus);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card Header */}
        <View style={styles.headerCard}>
          <Text style={styles.avatar}>👤</Text>
          <Text style={styles.name}>{profileUser?.name || 'Responder'}</Text>
          <Text style={styles.email}>{profileUser?.email}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, profileUser?.isActive ? styles.activeBadge : styles.inactiveBadge]}>
              <Text style={profileUser?.isActive ? styles.activeBadgeText : styles.inactiveBadgeText}>
                {profileUser?.isActive ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>

            {badgeStyle && (
              <View style={[styles.badge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border, borderWidth: 1 }]}>
                <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
                  {profileUser?.responderProfile?.verificationStatus?.toUpperCase() || 'UNVERIFIED'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Fetching profile details...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchFreshProfile}>
              <Text style={styles.retryBtnText}>Retry Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Operational Info Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Operational Details</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Badge / Responder ID</Text>
                <Text style={styles.infoValue} selectable>
                  {profileUser?.responderProfile?.responderId || 'Not Set'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>
                  {profileUser?.responderProfile?.department || 'Not Assigned'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Specialization</Text>
                <Text style={styles.infoValue}>
                  {profileUser?.responderProfile?.specialization || 'General Responder'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Service Zone</Text>
                <Text style={styles.infoValue}>
                  {profileUser?.responderProfile?.serviceZone || 'Default / All Zones'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Active Shift</Text>
                <Text style={styles.infoValue}>
                  {profileUser?.responderProfile?.shift || 'On-Call / Variable'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Primary Phone</Text>
                <Text style={styles.infoValue} selectable>
                  {profileUser?.phone || 'No Phone Registered'}
                </Text>
              </View>
            </View>

            {/* Emergency Contacts Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Emergency Contact Information</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact Name</Text>
                <Text style={styles.infoValue}>
                  {profileUser?.responderProfile?.emergencyContactName || 'None Designated'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact Phone</Text>
                <Text style={styles.infoValue} selectable>
                  {profileUser?.responderProfile?.emergencyContactPhone || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Managed Account Notice */}
            <View style={styles.noticeCard}>
              <Text style={styles.noticeText}>
                🔒 Responder profiles are managed by command admins. If your specialization, badge ID, zone, or shift parameters require updates, please notify your dispatcher team.
              </Text>
            </View>
          </>
        )}

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
    flexGrow: 1,
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  avatar: {
    fontSize: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  activeBadge: {
    backgroundColor: theme.colors.successGlow,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  activeBadgeText: {
    color: theme.colors.success,
    fontSize: 9,
    fontWeight: '800',
  },
  inactiveBadge: {
    backgroundColor: theme.colors.emergencyGlow,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  inactiveBadgeText: {
    color: theme.colors.emergency,
    fontSize: 9,
    fontWeight: '800',
  },
  centered: {
    paddingVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: theme.colors.emergencyMuted,
    borderColor: theme.colors.emergency,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: theme.colors.emergency,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryBtnText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    ...theme.shadows.card,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 10,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  noticeCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 12,
    color: theme.colors.primary,
    lineHeight: 18,
    textAlign: 'center',
  },
});
