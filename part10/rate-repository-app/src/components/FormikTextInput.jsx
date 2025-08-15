import React from 'react';
import { useField } from 'formik';
import { TextInput as NativeTextInput, StyleSheet, View } from 'react-native';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: theme.colors.white
  },
  errorBorder: {
    borderColor: theme.colors.error
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: 8
  }
});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [styles.input, error && styles.errorBorder, style];
  return <NativeTextInput style={textInputStyle} {...props} />;
};

const FormikTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched && meta.error;
  return (
    <View>
      <TextInput
        onChangeText={value => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={!!showError}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </View>
  );
};

export default FormikTextInput;