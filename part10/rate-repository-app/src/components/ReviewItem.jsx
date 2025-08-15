import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import theme from '../theme';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.white, padding: 15 },
  topRow: { flexDirection: 'row' },
  rating: {
    width: 46, height: 46, borderRadius: 23,
    borderWidth: 2, borderColor: theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12
  },
  content: { flex: 1 }
});

const ReviewItem = ({ review }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.rating}><Text color="primary" fontWeight="bold">{review.rating}</Text></View>
        <View style={styles.content}>
          <Text fontWeight="bold">{review.user?.username}</Text>
          <Text color="textSecondary">{format(new Date(review.createdAt), 'dd.MM.yyyy')}</Text>
          <Text>{review.text}</Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewItem;