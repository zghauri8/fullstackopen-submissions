import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';
import { relayStylePagination } from '@apollo/client/utilities';

const createApolloClient = ({ authStorage }) => {
  const httpLink = createHttpLink({
    uri: Constants.expoConfig?.extra?.apolloUri || 'http://localhost:4000/graphql',
  });

  const authLink = setContext(async () => {
    try {
      const token = await authStorage.getAccessToken();
      return { headers: { authorization: token ? `Bearer ${token}` : '' } };
    } catch {
      return { headers: {} };
    }
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          repositories: relayStylePagination(),
        },
      },
      Repository: {
        fields: {
          reviews: relayStylePagination(),
        },
      },
    },
  });

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache,
  });
};

export default createApolloClient;