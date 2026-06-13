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

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Focus states for visual feedback
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role: 'citizen',
        phone: phone.trim() || undefined,
      };

      await register(payload);
      setSuccess('Account created successfully! Redirecting to login...');
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
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
            <Text style={styles.logoSubtitle}>Create Citizen Account</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Register</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {success ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>{success}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, nameFocused && styles.inputFocused]}
                placeholder="Enter full name"
                placeholderTextColor={theme.colors.textPlaceholder}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, emailFocused && styles.inputFocused]}
                placeholder="Enter email"
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
                placeholder="Create password"
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={[styles.input, phoneFocused && styles.inputFocused]}
                placeholder="Enter phone number"
                placeholderTextColor={theme.colors.textPlaceholder}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoComplete="tel"
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
              />
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                ℹ️ Note: Mobile registration creates Citizen accounts only.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading || !!success}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.textPrimary} />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Log In here</Text>
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
    marginBottom: 24,
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
  successBox: {
    backgroundColor: theme.colors.successGlow,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 16,
  },
  successText: {
    color: '#A7F3D0',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  inputGroup: {
    marginBottom: 16,
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
  noteBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    padding: 12,
    borderRadius: theme.borderRadius.md,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  noteText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
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
});
