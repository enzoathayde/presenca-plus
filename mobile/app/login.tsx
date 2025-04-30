import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { useState } from 'react';
import { signIn } from '../services/auth.service'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import findUserByEmail from '../services/user.signin.service';





const LoginScreen: React.FC<any> = () => {

  const [emailData, setEmailData] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true)

    try {
      const response = await signIn(emailData, password);
      
      if(response) {
        const response = await findUserByEmail(emailData);

        const { _id ,name, email, role, course} = response.data[0];


        AsyncStorage.setItem('id', _id)
        AsyncStorage.setItem('nome', name)
        AsyncStorage.setItem('email', email)
        AsyncStorage.setItem('perfil', role)
        AsyncStorage.setItem('curso', course)

        console.log(name);
        console.log(email);
        console.log(role);
        console.log(course);
        
        

        setMessage(null)
        router.push("/dashboard")
      }

      setLoading(false)
      return response
    } catch (error: any) {
      console.log(error);

      setLoading(false);
      setMessage("Usuário/senha incorretos.")

      setTimeout(() => {
        setMessage(null)
      },2000)
    }
  };

  const handleSignUp = async () => {
    router.push("/register")
  };


  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>

      <View style={styles.container}>

        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.errorMessage}>{message}</Text>
        <View style={styles.form}>
          <Text style={styles.textLogin}>Faça login ou cadastre-se</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailData}
            onChangeText={setEmailData}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {loading ? (
            <ActivityIndicator size="small" color="#222"/>
          ) : (
            <>
              <TouchableOpacity style={styles.btn_login} onPress={handleLogin} disabled={loading}>
                <Text style={styles.btn_text}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn_register} onPress={handleSignUp} disabled={loading}>
                <Text style={styles.btn_text_register}>Cadastre-se</Text>
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
  logo: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  form: {
    width: '95%',
    marginTop: 30,
    alignItems: 'center',
  },
  textLogin: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#02250c',
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#006653',
    width: '95%',
    fontSize: 16,
  },
  btn_login: {
    width: '95%',
    padding: 12,
    marginTop: 15,
    borderRadius: 6,
    backgroundColor: '#69b932',
    alignItems: 'center',
  },
  btn_register: {
    width: '95%',
    padding: 12,
    marginTop: 15,
    borderRadius: 6,
    borderColor: '#69b932',
    borderWidth: 1.5,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  btn_text: {
    fontWeight: 'bold',
    color: '#f4f4f4',
    fontSize: 16,
  },
  btn_text_register: {
    fontWeight: 'bold',
    color: '#69b932',
    fontSize: 16,
  },
  errorMessage: {
    paddingTop: 3,
    fontSize: 15.5,
    color: '#FC0505',
    textAlign: 'center',
  },
});


export default LoginScreen;
