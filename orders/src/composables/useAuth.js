import { ref } from 'vue';
import * as jwtDecode from 'jwt-decode'; // Use named import for better compatibility

const tokenKey = 'jwt_token';

export function useAuth() {
  const isAuthenticated = ref(false);
  const user = ref(null);

  const login = async (credentials) => {
    const response = await fetch('https://6707d2988e86a8d9e42d1397.mockapi.io/order/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem(tokenKey, data.token);
      isAuthenticated.value = true;
      user.value = jwtDecode(data.token); // Decode the token to get user data
    }
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    isAuthenticated.value = false;
    user.value = null;
  };

  const checkAuth = () => {
    const token = localStorage.getItem(tokenKey);
    if (token) {
      isAuthenticated.value = true;
      user.value = jwtDecode(token); // Decode the token to get user data
    }
  };

  return { isAuthenticated, login, logout, checkAuth, user };
}
