// src/utils/authUtils.js
import { jwtDecode } from 'jwt-decode';
 
export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if the token has expired
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.error('Token has expired.');
      return null;
    }

    // Return the 'unique_name' or whichever key you want to return
    return decodedToken.unique_name; // Adjust based on your token structure
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
