import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Platform,
  AccessibilityInfo,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { userRegistration } from '../services/auth.service';
import { User } from '../interfaces/User';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const CreateUser: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registration, setRegistration] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageSuccessfull, setMessageSuccessfull] = useState<string | null>(null);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };
    checkScreenReader();
  }, []);

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

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!registration.trim()) {
      newErrors.registration = 'Matrícula é obrigatória';
    }

    if (!course.trim()) {
      newErrors.course = 'Curso é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    setMessage(null);
    setMessageSuccessfull(null);
    setErrors({});

    // Validar campos
    if (!validateFields()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os campos destacados em vermelho');
      return;
    }

    setLoading(true);

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
          router.replace('/listAlunos');
        }, 2000);
      } else {
        throw new Error();
      }
    } catch (error: any) {
      setLoading(false);
      
      // Tratamento de erro mais específico
      let errorMessage = 'Erro ao criar usuário';
      
      if (error.response) {
        // Erro da API
        if (error.response.status === 400) {
          errorMessage = 'Dados inválidos. Verifique as informações inseridas.';
        } else if (error.response.status === 409) {
          errorMessage = 'Email ou matrícula já cadastrados.';
        } else if (error.response.status === 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = error.response.data?.error || error.response.data?.message || 'Erro desconhecido';
        }
      } else if (error.request) {
        // Erro de rede
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ImageBackground style={styles.background}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text 
              style={styles.title}
              accessibilityRole="header"
            >
              Cadastrar Novo Aluno
            </Text>

            {messageSuccessfull && (
              <Text 
                style={styles.messageSuccessfull}
                accessibilityRole="alert"
              >
                {messageSuccessfull}
              </Text>
            )}

            <View style={styles.inputContainer}>
              <TextInput 
                style={[styles.input, errors.name && styles.inputError]} 
                placeholder="Nome" 
                value={name} 
                onChangeText={setName}
                accessibilityLabel="Campo para inserir o nome do aluno"
                accessibilityHint="Digite o nome completo do aluno"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput 
                style={[styles.input, errors.email && styles.inputError]} 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Campo para inserir o email do aluno"
                accessibilityHint="Digite o email do aluno"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput 
                style={[styles.input, errors.password && styles.inputError]} 
                placeholder="Senha" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
                accessibilityLabel="Campo para inserir a senha"
                accessibilityHint="Digite a senha do aluno"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput 
                style={[styles.input, errors.registration && styles.inputError]} 
                placeholder="Matrícula" 
                value={registration} 
                onChangeText={setRegistration}
                keyboardType="numeric"
                accessibilityLabel="Campo para inserir a matrícula"
                accessibilityHint="Digite o número da matrícula do aluno"
              />
              {errors.registration && <Text style={styles.errorText}>{errors.registration}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput 
                style={[styles.input, errors.course && styles.inputError]} 
                placeholder="Curso" 
                value={course} 
                onChangeText={setCourse}
                accessibilityLabel="Campo para inserir o curso"
                accessibilityHint="Digite o curso do aluno"
              />
              {errors.course && <Text style={styles.errorText}>{errors.course}</Text>}
            </View>

            {message && (
              <Text 
                style={styles.message}
                accessibilityRole="alert"
              >
                {message}
              </Text>
            )}

            {loading ? (
              <ActivityIndicator 
                size="large" 
                color="#69b932" 
                style={styles.loading}
                accessibilityLabel="Carregando"
              />
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.btn} 
                  onPress={handleCreate}
                  accessibilityRole="button"
                  accessibilityLabel="Cadastrar aluno"
                  accessibilityHint="Toque duas vezes para cadastrar o aluno"
                >
                  <Text style={styles.btn_text}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.link} 
                  onPress={() => router.replace('/listAlunos')}
                  accessibilityRole="button"
                  accessibilityLabel="Voltar para a lista de alunos"
                  accessibilityHint="Toque duas vezes para voltar à lista de alunos"
                >
                  <MaterialIcons name="arrow-back" size={20} color="#fff" />
                  <Text style={styles.link_text}>Voltar para a tela de alunos</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    width: width * 0.9,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 24 : 22,
    fontWeight: 'bold',
    color: '#02250c',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: Platform.OS === 'ios' ? 15 : 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#006653',
    width: '100%',
    fontSize: 16,
    color: '#333',
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
  btn: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 15 : 12,
    marginTop: 15,
    borderRadius: 8,
    backgroundColor: '#69b932',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    fontWeight: '500',
  },
  messageSuccessfull: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  loading: {
    marginTop: 20,
  },
  link: {
    marginTop: 15,
    padding: 10,
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

