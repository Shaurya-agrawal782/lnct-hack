import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';

const MOCK_ALERTS = [
  {
    id: '1',
    title: 'Flood Alert - Sector 4',
    message: 'Water levels rising. Citizens in low-lying areas should prepare for evacuation.',
    time: '10 mins ago',
    severity: 'critical',
  },
  {
    id: '2',
    title: 'Severe Thunderstorm Warning',
    message: 'High winds and heavy rain expected between 14:00 and 18:00 today. Secure outdoor items.',
    time: '2 hours ago',
    severity: 'warning',
  },
  {
    id: '3',
    title: 'Road Blockage: Highway 10',
    message: 'Landslide cleared but traffic limited to single lane. Emergency vehicles given priority.',
    time: '5 hours ago',
    severity: 'info',
  },
];

export default function AlertsPlaceholderScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Phase 5 Feature Preview</Text>
        </View>

        <Text style={styles.description}>
          In future updates, this screen will receive real-time push notifications and emergency warning broadcasts via Socket.io.
        </Text>

        <View style={styles.alertsList}>
          {MOCK_ALERTS.map((alert) => (
            <View key={alert.id} style={styles.card}>
              <View style={[styles.severityIndicator, styles[alert.severity]]} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{alert.title}</Text>
                  <Text style={styles.cardTime}>{alert.time}</Text>
                </View>
                <Text style={styles.cardMessage}>{alert.message}</Text>
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
    padding: 16,
  },
  badgeContainer: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 24,
  },
  alertsList: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  severityIndicator: {
    width: 6,
  },
  critical: {
    backgroundColor: '#EF4444',
  },
  warning: {
    backgroundColor: '#F59E0B',
  },
  info: {
    backgroundColor: '#3B82F6',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  cardTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  cardMessage: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});
