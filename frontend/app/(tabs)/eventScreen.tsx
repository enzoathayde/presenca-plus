import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { getAllEvents } from '../../services/eventService';
import { Link } from 'expo-router'; // Importação do Link

const EventsListScreen: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        setEvents(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar eventos');
      }
    };

    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Cadastrados</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Título</DataTable.Title>
          <DataTable.Title>Descrição</DataTable.Title>
          <DataTable.Title>Local</DataTable.Title>
          <DataTable.Title>Dia</DataTable.Title>
        </DataTable.Header>

        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <DataTable.Row>
              <DataTable.Cell>{item.title}</DataTable.Cell>
              <DataTable.Cell>{item.description}</DataTable.Cell>
              <DataTable.Cell>{item.location.name}</DataTable.Cell>
              <DataTable.Cell>{new Date(item.startDate).toLocaleDateString()}</DataTable.Cell>
            </DataTable.Row>
          )}
        />
      </DataTable>

      <Link href="/createEvent">
        <View style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar Evento</Text>
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

export default EventsListScreen;
