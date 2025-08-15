import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Link } from 'react-router-native';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  tab: { padding: 16 },
});

const AppBarTab = ({ to, text, onPress }) => {
  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        <View style={styles.tab}>
          <Text color="primary" style={{ color: '#fff' }} fontWeight="bold">{text}</Text>
        </View>
      </Pressable>
    );
  }
  return (
    <Link to={to}>
      <View style={styles.tab}>
        <Text style={{ color: '#fff' }} fontWeight="bold">{text}</Text>
      </View>
    </Link>
  );
};

export default AppBarTab;