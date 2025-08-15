import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import theme from '../theme';
import AppBarTab from './AppBarTab';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '../graphql/queries';
import { useAuthStorage } from '../context/AuthStorageContext';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    paddingHorizontal: 10,
  },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

const AppBar = () => {
  const { data } = useQuery(GET_CURRENT_USER);
  const me = data?.me;
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scroll} showsHorizontalScrollIndicator={false}>
        <AppBarTab to="/" text="Repositories" />
        {me ? (
          <>
            <AppBarTab to="/create-review" text="Create a review" />
            <AppBarTab to="/my-reviews" text="My reviews" />
            <AppBarTab onPress={signOut} text="Sign out" />
          </>
        ) : (
          <>
            <AppBarTab to="/signin" text="Sign in" />
            <AppBarTab to="/signup" text="Sign up" />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;