import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.white, padding: 15 },
  topRow: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 4, marginRight: 12 },
  info: { flex: 1 },
  language: { alignSelf: 'flex-start', backgroundColor: theme.colors.primary, color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 6 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' }
});

const formatK = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n);

const Stat = ({ label, value }) => (
  <View style={styles.stat}>
    <Text fontWeight="bold">{formatK(value)}</Text>
    <Text color="textSecondary">{label}</Text>
  </View>
);

const RepositoryItem = ({ item, showOpenButton }) => {
  return (
    <View testID="repositoryItem" style={styles.container}>
      <View style={styles.topRow}>
        <Image source={{ uri: item.ownerAvatarUrl }} style={styles.avatar} />
        <View style={styles.info}>
          <Text fontWeight="bold" fontSize="subheading">{item.fullName}</Text>
          <Text color="textSecondary">{item.description}</Text>
          {item.language ? <Text style={styles.language}>{item.language}</Text> : null}
        </View>
      </View>
      <View style={styles.statsRow}>
        <Stat label="Stars" value={item.stargazersCount} />
        <Stat label="Forks" value={item.forksCount} />
        <Stat label="Reviews" value={item.reviewCount} />
        <Stat label="Rating" value={item.ratingAverage} />
      </View>
      {showOpenButton}
    </View>
  );
};

export default RepositoryItem;