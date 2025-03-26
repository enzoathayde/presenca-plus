import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { getAllUsers } from '../services/userService';
import { Link } from 'expo-router';
import { useFocusEffect } from 'expo-router'; // Importando useFocusEffect

export default function UsersListScreen() {
  const [users, setUsers] = useState<any[]>([]);

  // Função para pegar os usuários
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data); // Atualiza a lista de usuários
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar usuários');
    }
  };

  // Recarregar os usuários sempre que a tela for exibida
  useFocusEffect(
    React.useCallback(() => {
      fetchUsers(); // Atualiza os usuários sempre que a tela for exibida
    }, []) // Dependência vazia para garantir que a atualização ocorra apenas quando a tela for acessada
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

        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <DataTable.Row>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell>{item.email}</DataTable.Cell>
              <DataTable.Cell>{item.course}</DataTable.Cell>
              <DataTable.Cell>{item.role}</DataTable.Cell>
            </DataTable.Row>
          )}
        />
      </DataTable>

      <Link href="/createUser">
        <View style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar Usuário</Text>
        </View>
      </Link>
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
