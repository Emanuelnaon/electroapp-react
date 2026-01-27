// frontend/src/screens/PrivacyConsentScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking
} from 'react-native';
import { Checkbox } from 'react-native-paper';

export default function PrivacyConsentScreen({ navigation }) {
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [aceptaUbicacion, setAceptaUbicacion] = useState(false);

  const puedeRegistrarse = aceptaTerminos && aceptaPrivacidad && aceptaUbicacion;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Antes de comenzar</Text>
      <Text style={styles.subtitle}>
        Lee y acepta nuestras políticas para usar ElectroApp
      </Text>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={aceptaTerminos ? 'checked' : 'unchecked'}
          onPress={() => setAceptaTerminos(!aceptaTerminos)}
        />
        <Text style={styles.checkboxText}>
          Acepto los{' '}
          <Text 
            style={styles.link}
            onPress={() => Linking.openURL('https://electroapp.com/terminos')}
          >
            Términos y Condiciones
          </Text>
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={aceptaPrivacidad ? 'checked' : 'unchecked'}
          onPress={() => setAceptaPrivacidad(!aceptaPrivacidad)}
        />
        <Text style={styles.checkboxText}>
          Acepto la{' '}
          <Text 
            style={styles.link}
            onPress={() => Linking.openURL('https://electroapp.com/privacidad')}
          >
            Política de Privacidad
          </Text>
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={aceptaUbicacion ? 'checked' : 'unchecked'}
          onPress={() => setAceptaUbicacion(!aceptaUbicacion)}
        />
        <Text style={styles.checkboxText}>
          Autorizo el uso de mi ubicación GPS para encontrar centros de reciclaje cercanos
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !puedeRegistrarse && styles.buttonDisabled]}
        onPress={() => navigation.navigate('Register')}
        disabled={!puedeRegistrarse}
      >
        <Text style={styles.buttonText}>Continuar con el Registro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10
  },
  link: {
    color: '#10B981',
    textDecorationLine: 'underline'
  },
  button: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});