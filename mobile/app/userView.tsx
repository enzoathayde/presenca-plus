import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import findUserByEmail from '../services/user.signin.service';
import { editUser } from '../services/user.service';
import { useRequireRole } from '../hooks/useRequireRole'; // Hook de segurança
import { MaterialIcons } from '@expo/vector-icons';

const UserView: React.FC = () => {
  useRequireRole("professor");

  const { userEmail } = useLocalSearchParams<{ userEmail: string }>();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [registration, setRegistration] = useState<string>('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
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
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
      }
    };
    if (userEmail) {
      fetchUser();
    }
  }, [userEmail]);

  const validateFields = () => {
    const newErrors: {[key: string]: string} = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    if (!course.trim()) {
      newErrors.course = 'Curso é obrigatório';
    }

    if (!role.trim()) {
      newErrors.role = 'Cargo é obrigatório';
    } else if (!['admin', 'professor', 'aluno'].includes(role.toLowerCase())) {
      newErrors.role = 'Cargo deve ser: admin, professor ou aluno';
    }

    if (!registration.trim()) {
      newErrors.registration = 'Matrícula é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = async () => {
    // Limpar erros anteriores
    setErrors({});

    // Validar campos
    if (!validateFields()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os campos destacados em vermelho');
      return;
    }

    try {
      const updatedUser = { name, email, course, role, registration };
      await editUser(user._id, updatedUser);
      Alert.alert('Sucesso', 'Usuário editado com sucesso');
      router.replace('/listAlunos');
    } catch (error: any) {
      console.error('Erro ao editar usuário', error);
      
      // Tratamento de erro mais específico
      let errorMessage = 'Não foi possível editar o usuário';
      
      if (error.response) {
        // Erro da API
        if (error.response.status === 400) {
          errorMessage = 'Dados inválidos. Verifique as informações inseridas.';
        } else if (error.response.status === 404) {
          errorMessage = 'Usuário não encontrado.';
        } else if (error.response.status === 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = `Erro: ${error.response.data?.message || 'Erro desconhecido'}`;
        }
      } else if (error.request) {
        // Erro de rede
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      Alert.alert('Erro', errorMessage);
    }
  };

  if (!user) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visualizar e Editar Usuário</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, errors.name && styles.inputError]} 
          value={name} 
          onChangeText={setName} 
          placeholder="Nome" 
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, errors.email && styles.inputError]} 
          value={email} 
          onChangeText={setEmail} 
          placeholder="Email" 
          keyboardType="email-address" 
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, errors.course && styles.inputError]} 
          value={course} 
          onChangeText={setCourse} 
          placeholder="Curso" 
        />
        {errors.course && <Text style={styles.errorText}>{errors.course}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, errors.registration && styles.inputError]} 
          value={registration} 
          onChangeText={setRegistration} 
          placeholder="Matrícula" 
        />
        {errors.registration && <Text style={styles.errorText}>{errors.registration}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, errors.role && styles.inputError]} 
          value={role} 
          onChangeText={setRole} 
          placeholder="Cargo (admin, professor, aluno)" 
        />
        {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/listAlunos')}>
        <MaterialIcons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.buttonText}>Voltar para a tela de alunos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  inputError: {
    borderColor: '#ff0000',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#69b932',
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserView;
