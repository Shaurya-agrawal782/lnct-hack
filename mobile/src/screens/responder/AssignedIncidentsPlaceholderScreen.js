import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';

const MOCK_ASSIGNED = [
  {
    id: 'inc-024',
    title: 'Severe Storm Flooding',
    severity: 'critical',
    location: 'Sector 4 Metro Area',
    status: 'investigating',
    reportedAt: '1 hr ago',
    desc: 'Rapid water accumulation flooding commercial basements. 3 businesses affected.',
  },
  {
    id: 'inc-018',
    title: 'Debris Blocking Subway Entrance',
    severity: 'warning',
    location: 'Central Plaza Junction',
    status: 'active',
    reportedAt: '3 hrs ago',
    desc: 'Large branches and mud blocking the east gate. Citizens unable to enter.',
  },
];

export default function AssignedIncidentsPlaceholderScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Phase 4 Feature Preview</Text>
        </View>

        <Text style={styles.title}>Assigned Incident Cases</Text>
        <Text style={styles.description}>
          In Phase 4, this screen will load incidents assigned to your Responder account and allow you to update status (e.g. to resolved/closed) to automatically release resources.
        </Text>

        <View style={styles.list}>
          {MOCK_ASSIGNED.map((inc) => (
            <View key={inc.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.titleCol}>
                  <Text style={styles.cardTitle}>{inc.title}</Text>
                  <Text style={styles.cardMeta}>ID: {inc.id} • {inc.location}</Text>
                </View>
                <View style={[styles.severityBadge, styles[inc.severity]]}>
                  <Text style={styles.severityText}>{inc.severity.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.cardDesc}>{inc.desc}</Text>

              <View style={styles.footerRow}>
                <Text style={styles.timeText}>Assigned: {inc.reportedAt}</Text>
                <View style={styles.mockAction}>
                  <Text style={styles.mockActionText}>Update Status</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
  },
  badgeContainer: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 24,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleCol: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  critical: {
    backgroundColor: '#FEE2E2',
  },
  warning: {
    backgroundColor: '#FEF3C7',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  mockAction: {
    backgroundColor: '#2563EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  mockActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
