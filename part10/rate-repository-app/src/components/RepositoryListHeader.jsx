import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import theme from '../theme';

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.background, padding: 10 },
  search: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 }
});

const RepositoryListHeader = ({ order, setOrder, search, setSearch }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search repositories"
        value={search}
        onChangeText={setSearch}
      />
      <Picker selectedValue={order} onValueChange={(v) => setOrder(v)}>
        <Picker.Item label="Latest repositories" value="latest" />
        <Picker.Item label="Highest rated repositories" value="highest" />
        <Picker.Item label="Lowest rated repositories" value="lowest" />
      </Picker>
    </View>
  );
};

export default RepositoryListHeader;