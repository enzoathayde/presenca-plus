<<<<<<< Updated upstream
// pages/createUser.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { createUser } from '../services/user.service'; // criaremos essa função no service
=======
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
} from 'react-native';
import { router } from 'expo-router';
import { userRegistration } from '../services/auth.service';
import { User } from '../interfaces/User';
>>>>>>> Stashed changes

const { width, height } = Dimensions.get('window');

const CreateUser: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registration, setRegistration] = useState('');
  const [course, setCourse] = useState('');
<<<<<<< Updated upstream
  const [role, setRole] = useState('aluno'); // default
=======
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageSuccessfull, setMessageSuccessfull] = useState<string | null>(null);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };
    checkScreenReader();
  }, []);
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
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

            <TextInput 
              style={styles.input} 
              placeholder="Nome" 
              value={name} 
              onChangeText={setName}
              accessibilityLabel="Campo para inserir o nome do aluno"
              accessibilityHint="Digite o nome completo do aluno"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Campo para inserir o email do aluno"
              accessibilityHint="Digite o email do aluno"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Senha" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry
              accessibilityLabel="Campo para inserir a senha"
              accessibilityHint="Digite a senha do aluno"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Matrícula" 
              value={registration} 
              onChangeText={setRegistration}
              keyboardType="numeric"
              accessibilityLabel="Campo para inserir a matrícula"
              accessibilityHint="Digite o número da matrícula do aluno"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Curso" 
              value={course} 
              onChangeText={setCourse}
              accessibilityLabel="Campo para inserir o curso"
              accessibilityHint="Digite o curso do aluno"
            />

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
                  onPress={() => router.push('/listAlunos')}
                  accessibilityRole="button"
                  accessibilityLabel="Voltar para a lista de alunos"
                  accessibilityHint="Toque duas vezes para voltar à lista de alunos"
                >
                  <Text style={styles.link_text}>Voltar para a tela de alunos</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
>>>>>>> Stashed changes
  );
};

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
=======
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
>>>>>>> Stashed changes
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  input: {
<<<<<<< Updated upstream
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
=======
    backgroundColor: '#f4f4f4',
    padding: Platform.OS === 'ios' ? 15 : 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#006653',
    width: '100%',
    fontSize: 16,
    color: '#333',
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
>>>>>>> Stashed changes
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
  },
});

export default CreateUser;
