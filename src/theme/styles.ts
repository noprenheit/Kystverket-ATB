import { StyleSheet } from 'react-native';
import { Colors } from './colors';

/**
 * Common styles used throughout the app
 */
export const createStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  
  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      borderColor: colors.border,
      borderWidth: 1,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    
    // Header styles
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    subheader: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    sectionHeader: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      marginTop: 16,
    },
    
    // Button styles
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
    },
    buttonText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 16,
    },
    secondaryButtonText: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: 16,
    },
    
    // Text styles
    text: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    smallText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
    },
    linkText: {
      fontSize: 16,
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    errorText: {
      fontSize: 14,
      color: colors.danger,
      marginTop: 4,
    },
    
    // Spacing
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
};

// Function to get styles for current color scheme
export const useStyles = (colorScheme: 'light' | 'dark') => {
  return createStyles(colorScheme);
};
