// pages/createUser.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { createUser } from '../services/user.service'; // criaremos essa função no service

const CreateUser: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registration, setRegistration] = useState('');
  const [course, setCourse] = useState('');
  const [role, setRole] = useState('aluno'); // default

  const handleCreate = async () => {
    if (!name || !email || !password || !registration) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const newUser = {
        name,
        email,
        password,
        registration,
        course,
        role,
      };

      await createUser(newUser);
      Alert.alert("Sucesso", "Usuário criado com sucesso!");
      router.push("/listAlunos");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.response?.data?.error || "Erro ao criar usuário.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Novo Usuário</Text>

      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Matrícula" value={registration} onChangeText={setRegistration} />
      <TextInput style={styles.input} placeholder="Curso" value={course} onChangeText={setCourse} />
      <TextInput style={styles.input} placeholder="Cargo (aluno, professor, admin)" value={role} onChangeText={setRole} />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#69b932',
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CreateUser;
