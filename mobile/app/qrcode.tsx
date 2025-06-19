import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllEvents } from '../services/event.service';
import React from 'react';


type DashboardStackParamList = {
  Dashboard: undefined;
  Camera: undefined;
  QRCode: undefined;
};

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

const QRCodeScreen: React.FC<any> = ({ navigation }) => {

  const [events, setEvents] = useState<Event[]>([]);
  const [userId, setUserId] = useState<any>(null)
  const [userRole, setuserRole] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2; 

  const paginatedEvents = events.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );


  useEffect(() => {

    const fetchUserId = async () => {
      const response = await AsyncStorage.getItem('id')

      setUserId(response)
    }

    const fetchUserRole = async () => {
      const response: any = await AsyncStorage.getItem('perfil');

      setuserRole(response)
    }

    const fetchEvents = async () => {
      try {
        const response: any = await fetchAllEvents();

        setEvents(response.data)

      } catch (error) {
        throw error;
      }

    }

    fetchUserId()
    fetchUserRole()
    fetchEvents()

  }, []);



  return (
    <>
      <View style={styles.header} />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Eventos - QRcode
        </Text>

        <FlatList
          data={paginatedEvents}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.cardEvent}>
              <Text style={styles.title}>{item.title}</Text>
              {(userRole === "professor" || userRole === 'admin') && (
                <QRCode
                  value={item.qrCodeData}
                  size={150}
                  color="black"
                  backgroundColor="white"
                />
              )}
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.paginationContainer}>
              <TouchableOpacity 
                style={[styles.pageButton, currentPage === 0 && styles.pageButtonDisabled]}
                onPress={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <Text>Anterior</Text>
              </TouchableOpacity>
              
              <Text style={styles.pageText}>
                Página {currentPage + 1} de {Math.ceil(events.length / itemsPerPage)}
              </Text>
              
              <TouchableOpacity 
                style={[styles.pageButton, 
                  currentPage === Math.ceil(events.length / itemsPerPage) - 1 && 
                  styles.pageButtonDisabled
                ]}
                onPress={() => setCurrentPage(prev => 
                  Math.min(Math.ceil(events.length / itemsPerPage) - 1, prev + 1)
                )}
                disabled={currentPage === Math.ceil(events.length / itemsPerPage) - 1}
              >
                <Text>Próxima</Text>
              </TouchableOpacity>
            </View>
          )}
        />

      </View>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
    flatListContent: {
    paddingHorizontal: 10,
  },
  header: {
    height: 100,
    backgroundColor: '#69b932',
    width: '100%',
  },
  cardEvent: {
    backgroundColor: '#EEE',
    marginBottom: 10,
    padding: 40,
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    borderRadius: 10
  },
  content: {
    backgroundColor: "#f4f4f4",
    width: '100%',
    height: '90%',
    borderRadius: 8,
    marginTop: -20,
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },  
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: "#f4f4f4",
    gap: 20,
  },
  card: {
    backgroundColor: '#69b932',
    width: 120,
    height: 120,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  cardText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  pageButton: {
    backgroundColor: '#69b932',
    padding: 10,
    borderRadius: 5,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
export default QRCodeScreen