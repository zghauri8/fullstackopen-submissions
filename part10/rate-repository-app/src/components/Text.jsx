import React from 'react';
import { Text as NativeText, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main
  },
  colorTextSecondary: { color: theme.colors.textSecondary },
  colorPrimary: { color: theme.colors.primary },
  fontSizeSubheading: { fontSize: theme.fontSizes.subheading },
  fontWeightBold: { fontWeight: theme.fontWeights.bold }
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyles = [
    styles.text,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style
  ];

  return <NativeText style={textStyles} {...props} />;
};

export default Text;