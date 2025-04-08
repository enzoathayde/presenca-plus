import React from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { signIn, signUp } from '../services/auth.service';
// import RegisterScreen from '../RegisterScreen';



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
        navigation.replace('Logged');
      }


      return response
    } catch (error: any) {
      console.log(error);

      setLoading(false);
      setMessage("Usuário/senha incorretos.")
    }
  };

  const handleSignUp = async () => {
    navigation.replace('Register')
    // try {
    //   const response = await signUp(email, password);
    //   console.info(response)
    // } catch (error: any) {
    //   console.log(error);

    // }
  };


  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/logo.png')}
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
            <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
              <Text style={styles.btn_text}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.btn_text}>Cadastre-se</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    width: '85%',
    marginTop: 30
  },
  btn: {
    width: '60%',
    padding: 10,
    marginTop: 20,
    borderWidth: 1.5,
    borderRadius: 4,
    backgroundColor: '#DDD',
    borderColor: '#000',
  },
  btn_text: { fontWeight: 'bold' },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textLogin: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'blue',
  },
  smallPadding: {  
    paddingTop: 10
  },
  errorMessage: {
    paddingTop: 30,
    fontSize: 14,
    color: '#FC0505'
  }
});


export default LoginScreen;
