import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
// import { API_URL } from '@env';

interface EventLocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: EventLocation;
  maxParticipants: number;
  createdBy: string;
  type: "class" | "lecture" | "workshop" | "other";
  category: string;
  qrCodeData: string;
  attendees: string[];
  waitingList: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const EventsScreen: React.FC<any> = ({ navigation }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [markedEvents, setMarkedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const url = "";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // Função para marcar/desmarcar um evento
  const toggleMarkEvent = (eventId: string) => {
    setMarkedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      {/* Título da Lista */}
      <Text style={styles.title}>Próximos Eventos</Text>

      {/* Exibindo os eventos */}
      <FlatList
        data={events}
        keyExtractor={(item) => item._id} 
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            {/* Título do evento */}
            <Text style={styles.eventTitle}>{item.title}</Text>

            {/* Botão de marcação */}
            <TouchableOpacity
              style={[
                styles.markButton,
                markedEvents.has(item._id) && styles.markedButton,
              ]}
              onPress={() => toggleMarkEvent(item._id)}
            >
              <Text style={styles.markButtonText}>
                {markedEvents.has(item._id) ? "Desmarcar" : "Marcar"}
              </Text>
            </TouchableOpacity>

            {/* Botão de Marcar Presença */}
            {markedEvents.has(item._id) && (
              <TouchableOpacity
                style={styles.presenceButton}
                onPress={() => Alert.alert(`Presença marcada no evento: ${item.title}`)}
              >
                <Text style={styles.presenceButtonText}>Marcar Presença</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default EventsScreen;

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  eventContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  markButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markedButton: {
    backgroundColor: '#dc3545',
  },
  markButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  presenceButton: {
    marginTop: 8,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presenceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});