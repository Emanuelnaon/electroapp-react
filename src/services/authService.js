// frontend/src/services/authService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://electroapp-backend.railway.app/api';

class AuthService {
  
  // 📝 REGISTRO
  async register(email, password, nombre, apellido, telefono) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nombre, apellido, telefono })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      // Guardar token en el dispositivo
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));

      return data;
    } catch (error) {
      throw error;
    }
  }

  // 🔓 LOGIN
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Guardar token
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));

      return data;
    } catch (error) {
      throw error;
    }
  }

  // 🚪 LOGOUT
  async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
  }

  // 🎫 OBTENER TOKEN
  async getToken() {
    return await AsyncStorage.getItem('token');
  }

  // 👤 OBTENER USUARIO ACTUAL
  async getCurrentUser() {
    const usuarioStr = await AsyncStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  // ✅ VERIFICAR SI ESTÁ LOGUEADO
  async isAuthenticated() {
    const token = await this.getToken();
    return token !== null;
  }
}

export default new AuthService();