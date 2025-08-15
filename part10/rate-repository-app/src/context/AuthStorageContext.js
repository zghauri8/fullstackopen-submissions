import React from 'react';
import AuthStorage from '../utils/authStorage';

const AuthStorageContext = React.createContext(new AuthStorage());
export const AuthStorageProvider = AuthStorageContext.Provider;
export const useAuthStorage = () => React.useContext(AuthStorageContext);