// src/utils/authUtils.js
import { jwtDecode } from 'jwt-decode';

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    //console.log('DecodedToken:', decodedToken);
    return decodedToken.unique_name; // Assuming the token contains a `user` field
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
