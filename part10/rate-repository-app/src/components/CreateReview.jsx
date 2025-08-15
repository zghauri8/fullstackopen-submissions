import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useMutation } from '@apollo/client';
import { CREATE_REVIEW } from '../graphql/mutations';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormikTextInput from './FormikTextInput';
import Text from './Text';
import { useNavigate } from 'react-router-native';
import theme from '../theme';

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: theme.colors.white },
  button: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

const CreateReview = () => {
  const [mutate] = useMutation(CREATE_REVIEW);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const ratingNum = Number(values.rating);
    try {
      const { data } = await mutate({
        variables: {
          review: {
            ownerName: values.ownerName,
            repositoryName: values.repositoryName,
            rating: ratingNum,
            text: values.text || ''
          }
        }
      });
      const repoId = data?.createReview?.repositoryId;
      if (repoId) navigate(`/repository/${repoId}`);
    } catch (e) { console.log(e); }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ ownerName: '', repositoryName: '', rating: '', text: '' }}
        onSubmit={onSubmit}
        validationSchema={Yup.object({
          ownerName: Yup.string().required(),
          repositoryName: Yup.string().required(),
          rating: Yup.number().min(0).max(100).required(),
          text: Yup.string()
        })}
      >
        {({ handleSubmit }) => (
          <View>
            <FormikTextInput name="ownerName" placeholder="Repository owner name" />
            <FormikTextInput name="repositoryName" placeholder="Repository name" />
            <FormikTextInput name="rating" placeholder="Rating between 0 and 100" keyboardType="numeric" />
            <FormikTextInput name="text" placeholder="Review" multiline />
            <Pressable onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Create a review</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default CreateReview;