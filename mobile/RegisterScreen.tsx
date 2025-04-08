import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { userRegistration } from './src/services/auth.service';



type RootStackParamList = {
  Register: undefined;
  Login: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('');
  const [registration, setRegistration] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    setLoading(true);
    setMessage(null);

    if (!name || !email || !password || !course) {
      setMessage('Todos os campos obrigatórios devem ser preenchidos.');
      setLoading(false);
      return;
    }

    try {
      const response = await userRegistration({ name, email, password, course, registration, role: 'aluno' });
      console.log(response);

      setMessage('Cadastro realizado com sucesso!');
      setLoading(false);

      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error.message);
      setMessage(error.message || 'Ocorreu um erro ao cadastrar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastre-se</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Curso"
          value={course}
          onChangeText={setCourse}
        />
        <TextInput
          style={styles.input}
          placeholder="Matrícula (opcional)"
          value={registration}
          onChangeText={setRegistration}
        />

        {/* Exibe mensagem de feedback */}
        {message && <Text style={styles.message}>{message}</Text>}

        {loading ? (
          <ActivityIndicator size="small" color="#222" style={styles.smallPadding} />
        ) : (
          <>
            <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.btn_text}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => navigation.replace('Login')}>
              <Text style={styles.link_text}>Já tem uma conta? Faça login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  btn: {
    width: '100%',
    padding: 10,
    marginTop: 20,
    backgroundColor: '#DDD',
    borderColor: '#000',
    borderWidth: 1.5,
    borderRadius: 4,
  },
  btn_text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    color: '#FC0505',
    fontSize: 14,
  },
  smallPadding: {
    paddingTop: 10,
  },
  link: {
    marginTop: 15,
  },
  link_text: {
    textAlign: 'center',
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;