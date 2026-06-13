import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { theme } from '../../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Interactive active states for form inputs
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || err.message || 'Incorrect email or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Text style={styles.logoTitle}>DisasterConnect</Text>
            <Text style={styles.logoSubtitle}>Emergency Coordination & Response</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Sign In</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, emailFocused && styles.inputFocused]}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.textPlaceholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, passwordFocused && styles.inputFocused]}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.textPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.textPrimary} />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>New to the platform? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Register here</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.footer, { marginTop: 16 }]}>
              <TouchableOpacity onPress={() => navigation.navigate('TrackReport')}>
                <Text style={styles.trackLinkText}>Track Report by Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 8,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  formTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: theme.colors.emergencyMuted,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.emergency,
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  inputFocused: {
    borderColor: theme.colors.borderFocus,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...theme.shadows.button,
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.md,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
  trackLinkText: {
    color: theme.colors.cyan,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    textDecorationLine: 'underline',
  },
});
