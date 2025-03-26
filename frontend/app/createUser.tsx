import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { createUser } from '../services/userService';
import { useNavigation } from 'expo-router';

export default function CreateUserScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('');
  const [registration, setRegistration] = useState('');
  const [role, setRole] = useState('');
  const navigation = useNavigation();

  const handleCreateUser = async () => {
    if (!name || !email || !password || !course || !registration || !role) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await createUser({ name, email, password, course, registration, role });
      Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      navigation.goBack(); // Volta para a tela de visualização de usuários
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar usuário.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Usuário</Text>
      <Input label="Nome" value={name} onChangeText={setName} placeholder="Nome completo" />
      <Input label="E-mail" value={email} onChangeText={setEmail} placeholder="email@exemplo.com" />
      <Input label="Senha" value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry />
      <Input label="Curso" value={course} onChangeText={setCourse} placeholder="Nome do curso" />
      <Input label="Matrícula" value={registration} onChangeText={setRegistration} placeholder="Número de matrícula" />
      <Input label="Cargo" value={role} onChangeText={setRole} placeholder="Aluno ou Professor" />
      <Button title="Criar Usuário" onPress={handleCreateUser} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
    },
  });
