import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../graphql/mutations';
import Text from './Text';
import FormikTextInput from './FormikTextInput';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';
import theme from '../theme';

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: theme.colors.white },
  button: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

const SignUp = () => {
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async ({ username, password, passwordConfirm }) => {
    try {
      await createUser({ variables: { user: { username, password } } });
      await signIn({ username, password });
      navigate('/');
    } catch (e) { console.log(e); }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ username: '', password: '', passwordConfirm: '' }}
        onSubmit={onSubmit}
        validationSchema={Yup.object({
          username: Yup.string().min(5).max(30).required(),
          password: Yup.string().min(5).max(50).required(),
          passwordConfirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required()
        })}
      >
        {({ handleSubmit }) => (
          <View>
            <FormikTextInput name="username" placeholder="Username" />
            <FormikTextInput name="password" placeholder="Password" secureTextEntry />
            <FormikTextInput name="passwordConfirm" placeholder="Confirm password" secureTextEntry />
            <Pressable onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Sign up</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignUp;