import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import findUserByEmail from '../services/user.signin.service';
import { editUser } from '../services/user.service';
import { useRequireRole } from '../hooks/useRequireRole'; // Hook de segurança

const UserView: React.FC = () => {
  useRequireRole("professor");

  const { userEmail } = useLocalSearchParams<{ userEmail: string }>();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [registration, setRegistration] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await findUserByEmail(userEmail);
        const userData = response.data[0];
        setUser(userData);
        setName(userData.name || '');
        setEmail(userData.email || '');
        setCourse(userData.course || '');
        setRole(userData.role || '');
        setRegistration(userData.registration || '');
      } catch (error) {
        console.error("Erro ao buscar dados do usuário", error);
      }
    };
    if (userEmail) {
      fetchUser();
    }
  }, [userEmail]);

  const handleEdit = async () => {
    try {
      const updatedUser = { name, email, course, role, registration };
      await editUser(user._id, updatedUser);
      Alert.alert('Sucesso', 'Usuário editado com sucesso');
      router.push('/listAlunos');
    } catch (error) {
      console.error('Erro ao editar usuário', error);
      Alert.alert('Erro', 'Não foi possível editar o usuário');
    }
  };

  if (!user) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visualizar e Editar Usuário</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} value={course} onChangeText={setCourse} placeholder="Curso" />
      <TextInput style={styles.input} value={registration} onChangeText={setRegistration} placeholder="Matrícula" />
      <TextInput style={styles.input} value={role} onChangeText={setRole} placeholder="Cargo (admin, professor, aluno)" />

      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#69b932',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default UserView;
