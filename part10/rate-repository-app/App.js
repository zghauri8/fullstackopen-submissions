import React from 'react';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client';
import createApolloClient from './src/apolloClient';
import Main from './src/components/Main';
import AuthStorage from './src/utils/authStorage';
import { AuthStorageProvider } from './src/context/AuthStorageContext';

const authStorage = new AuthStorage();
const apolloClient = createApolloClient({ authStorage });

export default function App() {
  return (
    <AuthStorageProvider value={authStorage}>
      <ApolloProvider client={apolloClient}>
        <NativeRouter>
          <Main />
        </NativeRouter>
      </ApolloProvider>
    </AuthStorageProvider>
  );
}