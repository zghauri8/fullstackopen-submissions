import { useMutation, useApolloClient } from '@apollo/client';
import { AUTHENTICATE } from '../graphql/mutations';
import { useAuthStorage } from '../context/AuthStorageContext';

const useSignIn = () => {
  const [mutate, result] = useMutation(AUTHENTICATE);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signIn = async ({ username, password }) => {
    const { data } = await mutate({ variables: { credentials: { username, password } } });
    const token = data?.authenticate?.accessToken;
    if (token) {
      await authStorage.setAccessToken(token);
      await apolloClient.resetStore();
    }
    return { data };
  };

  return [signIn, result];
};

export default useSignIn;