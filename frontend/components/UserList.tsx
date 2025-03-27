import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { getAllUsers } from '../services/userService';
import { Link } from 'expo-router';
import { useFocusEffect } from 'expo-router';

export default function UsersListScreen() {
  const [users, setUsers] = useState<any[]>([]);

  
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();

      setUsers(response.data); 
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      Alert.alert('Erro', 'Falha ao carregar usuários');
    }
  };

  // Recarregar os usuários sempre que a tela for exibida
  useFocusEffect(
    React.useCallback(() => {
      fetchUsers(); 
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários Cadastrados</Text>


      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Nome</DataTable.Title>
          <DataTable.Title>E-mail</DataTable.Title>
          <DataTable.Title>Curso</DataTable.Title>
          <DataTable.Title>Cargo</DataTable.Title>
        </DataTable.Header>

        {users.length > 0 ? (
          users.map((user) => (
            <DataTable.Row key={user._id}>
              <DataTable.Cell>{user.name}</DataTable.Cell>
              <DataTable.Cell>{user.email}</DataTable.Cell>
              <DataTable.Cell>{user.course}</DataTable.Cell>
              <DataTable.Cell>{user.role}</DataTable.Cell>
            </DataTable.Row>
          ))
        ) : (
          <DataTable.Row>
            <DataTable.Cell  style={{ justifyContent: 'center' }}>
              <Text>Nenhum usuário cadastrado</Text>
            </DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable>


      <Link href="/createUser" style={styles.button}>
        <Text style={styles.buttonText}>Cadastrar Usuário</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});