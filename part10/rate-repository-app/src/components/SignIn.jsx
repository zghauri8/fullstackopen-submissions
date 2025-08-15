import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormikTextInput from './FormikTextInput';
import Text from './Text';
import theme from '../theme';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: theme.colors.white },
  button: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export const SignInContainer = ({ onSubmit }) => (
  <View style={styles.container}>
    <Formik initialValues={{ username: '', password: '' }} onSubmit={onSubmit}
      validationSchema={Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
      })}
    >
      {({ handleSubmit }) => (
        <View>
          <FormikTextInput name="username" placeholder="Username" />
          <FormikTextInput name="password" placeholder="Password" secureTextEntry />
          <Pressable onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  </View>
);

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      await signIn(values);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  return <SignInContainer onSubmit={onSubmit} />;
};

export default SignIn;