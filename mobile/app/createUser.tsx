import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { userRegistration } from '../services/auth.service'; // ⬅️ função atualizada
import { User } from '../interfaces/User';

const CreateUser: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registration, setRegistration] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageSuccessfull, setMessageSuccessfull] = useState<string | null>(null);

  const handleCreate = async () => {
    setMessage(null);
    setMessageSuccessfull(null);
    setLoading(true);

    if (!name || !email || !password || !registration || !course) {
      setMessage('Todos os campos obrigatórios devem ser preenchidos.');
      setLoading(false);
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    const newUser: User = {
      name,
      email,
      password,
      registration,
      course,
      role: 'aluno',
    };

    try {
      const response = await userRegistration(newUser);

      if (response?.status === 201) {
        setMessageSuccessfull('Usuário criado com sucesso!');
        setTimeout(() => {
          setMessageSuccessfull(null);
          setLoading(false);
          router.push('/listAlunos');
        }, 2000);
      } else {
        throw new Error();
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Erro ao criar usuário.';
      setMessage(msg);
      setTimeout(() => setMessage(null), 2000);
      setLoading(false);
    }
  };

  return (
    <ImageBackground style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastrar Novo Aluno</Text>

        {messageSuccessfull && <Text style={styles.messageSuccessfull}>{messageSuccessfull}</Text>}

        <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Matrícula" value={registration} onChangeText={setRegistration} />
        <TextInput style={styles.input} placeholder="Curso" value={course} onChangeText={setCourse} />

        {message && <Text style={styles.message}>{message}</Text>}

        {loading ? (
          <ActivityIndicator size="small" color="#222" style={styles.smallPadding} />
        ) : (
          <>
            <TouchableOpacity style={styles.btn} onPress={handleCreate}>
              <Text style={styles.btn_text}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => router.push('/listAlunos')}>
              <Text style={styles.link_text}>Voltar para a tela de alunos</Text>
            </TouchableOpacity>
          </>
        )}
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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#02250c',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#006653',
    width: '100%',
    fontSize: 16,
  },
  btn: {
    width: '100%',
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
  messageSuccessfull: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
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

export default CreateUser;
