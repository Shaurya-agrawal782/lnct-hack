// Design System Tokens for DisasterConnect Mobile

export const theme = {
  colors: {
    // Backgrounds
    background: '#090D1A',       // Obsidian Navy
    surface: '#0F172A',          // Dark Slate
    card: '#1E293B',             // Medium Slate Blue
    inputBackground: '#0B1220',  // Deep dark input fill

    // Borders
    border: '#2E3E59',           // Subtle card/input border
    borderFocus: '#3B82F6',      // Electric Blue highlight
    divider: '#1E293B',          // Thin division line

    // Brand / Accents
    primary: '#3B82F6',          // Electric Blue
    primaryGlow: 'rgba(59, 130, 246, 0.15)',
    cyan: '#06B6D4',             // Info / Secondary Branding
    cyanGlow: 'rgba(6, 182, 212, 0.15)',

    // Semantic Status
    emergency: '#EF4444',        // Coral Crimson Red
    emergencyMuted: '#991B1B',   // Dark Red
    emergencyGlow: 'rgba(239, 68, 68, 0.12)',

    success: '#10B981',          // Emerald Green
    successGlow: 'rgba(16, 185, 129, 0.12)',

    warning: '#F59E0B',          // Warning Amber Gold
    warningGlow: 'rgba(245, 158, 11, 0.12)',

    info: '#3B82F6',             // Info Blue
    infoGlow: 'rgba(59, 130, 246, 0.12)',

    // Text Values
    textPrimary: '#FFFFFF',      // Crisp White
    textSecondary: '#94A3B8',    // Slate Blue-Gray
    textMuted: '#64748B',        // Muted Gray
    textPlaceholder: '#475569',  // Dark placeholder text
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },
  typography: {
    // Fonts are standard System fonts for maximum performance and native reliability
    fontFamily: 'System',
    sizes: {
      xs: 12,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 22,
      xxl: 30,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      heavy: '800',
    }
  },
  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    button: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    emergency: {
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    }
  }
};

export default theme;
