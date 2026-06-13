import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';

export default function ReportIncidentPlaceholderScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Phase 2 Feature Preview</Text>
        </View>

        <Text style={styles.title}>Incident Reporting</Text>
        <Text style={styles.description}>
          In Phase 2, this screen will let citizens submit reports with details, photo attachments, and their GPS location coordinates.
        </Text>

        <View style={styles.mockForm}>
          <View style={styles.formItem}>
            <Text style={styles.label}>Incident Type</Text>
            <View style={styles.mockInput}>
              <Text style={styles.mockInputText}>Select type (e.g. Flood, Fire, Earthquake)</Text>
            </View>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.mockInput, styles.textArea]}>
              <Text style={styles.mockInputText}>Describe details of the emergency...</Text>
            </View>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.label}>Location Coordinates</Text>
            <View style={styles.mockInput}>
              <Text style={styles.mockInputText}>GPS: [Auto-detecting location...]</Text>
            </View>
          </View>

          <View style={styles.mockBtn}>
            <Text style={styles.mockBtnText}>Submit Emergency Report</Text>
          </View>
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
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    color: '#991B1B',
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
  mockForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  mockInput: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  textArea: {
    height: 100,
  },
  mockInputText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  mockBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  mockBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
