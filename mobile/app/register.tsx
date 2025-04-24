import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import userRegistration  from '../services/user.registration.service';
import { router } from 'expo-router';




const RegisterScreen: React.FC<any> = ({ navigation }) => {
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

      if(response.status === 201) {
        setMessage('Cadastro realizado com sucesso!');
        setLoading(false);
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
        
      } else {
        setMessage('Falha ao registrar usuário. Entre em contato com os administradores do sistema.');
        setLoading(false);
      }

  
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error.message);
      setMessage(error.message || 'Ocorreu um erro ao cadastrar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>

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
              <TouchableOpacity style={styles.link} onPress={() => router.push("/login")}>
                <Text style={styles.link_text}>Já tem uma conta? Faça login</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#02250c',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#006653',
    width: '80%',
    fontSize: 16,
  },
  btn: {
    width: '80%',
    padding: 12,
    marginTop: 15,
    borderRadius: 6,
    backgroundColor: '#69b932',
    alignItems: 'center',
  },
  btn_text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
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
    color: '#006653',
    fontWeight: '500',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default RegisterScreen;