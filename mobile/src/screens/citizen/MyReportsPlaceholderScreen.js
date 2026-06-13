import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';

const MOCK_REPORTS = [
  {
    id: 'rep-001',
    title: 'Water Logged Street',
    type: 'flood',
    status: 'investigating',
    date: 'June 12, 2026',
    desc: 'Deep water accumulation on Main St. Cars are getting stuck.',
  },
  {
    id: 'rep-002',
    title: 'Fallen Power Line',
    type: 'utility',
    status: 'active',
    date: 'June 10, 2026',
    desc: 'Power line down across sidewalk after high winds. Sparks visible.',
  },
];

export default function MyReportsPlaceholderScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Phase 3 Feature Preview</Text>
        </View>

        <Text style={styles.title}>My Incident Reports</Text>
        <Text style={styles.description}>
          In Phase 3, this screen will pull real reports created by you directly from the database and track assignments and resolution steps in real time.
        </Text>

        <View style={styles.list}>
          {MOCK_REPORTS.map((rep) => (
            <View key={rep.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{rep.title}</Text>
                <View style={[styles.statusBadge, styles[rep.status]]}>
                  <Text style={[styles.statusText, styles[`${rep.status}Text`]]}>
                    {rep.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>ID: {rep.id} • Submitted on {rep.date}</Text>
              <Text style={styles.cardDesc}>{rep.desc}</Text>
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
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    color: '#1E40AF',
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
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  investigating: {
    backgroundColor: '#FEF3C7',
  },
  active: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  investigatingText: {
    color: '#D97706',
  },
  activeText: {
    color: '#DC2626',
  },
  cardMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 10,
    fontWeight: '500',
  },
  cardDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});
