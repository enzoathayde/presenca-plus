import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { signIn } from '../src/services/auth.service';
import { router } from 'expo-router'


type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Register: undefined;
  Logged: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)

    try {
      const response = await signIn(email, password);
      console.log(response);
      setLoading(false)

      if(response) {
        setMessage(null)
        router.push("/dashboard")
      }


      return response
    } catch (error: any) {
      console.log(error);

      setLoading(false);
      setMessage("Usuário/senha incorretos.")
    }
  };

  const handleSignUp = async () => {
    router.push("/register")
    // try {
    //   const response = await signUp(email, password);
    //   console.info(response)
    // } catch (error: any) {
    //   console.log(error);

    // }
  };


  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>

      <View style={styles.container}>

        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />

        <View style={styles.form}>
          <Text style={styles.textLogin}>Faça login ou cadastre-se</Text>
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
          {/* <Button title="Entrar" onPress={() => navigation.replace('Main')} /> */}
          {loading ? (
            <ActivityIndicator size="small" color="#222"  style={styles.smallPadding}/>
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
        <Text style={styles.errorMessage}>{message}</Text>
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
    marginBottom: 20,
  },
  form: {
    width: '85%',
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
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#006653',
    width: '80%',
    fontSize: 16,
  },
  btn_login: {
    width: '80%',
    padding: 12,
    marginTop: 15,
    borderRadius: 6,
    backgroundColor: '#69b932',
    alignItems: 'center',
  },
  btn_register: {
    width: '80%',
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
    paddingTop: 30,
    fontSize: 14,
    color: '#FC0505',
    textAlign: 'center',
  },
  smallPadding: {
    paddingTop: 10,
  },
});


export default LoginScreen;
