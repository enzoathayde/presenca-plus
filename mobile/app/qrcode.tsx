import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllEvents } from '../services/event.service';
import React from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';


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

    const paginatedEvents = events.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  }, []);



  return (
    <>
      <View style={styles.header} />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Eventos - QRcode
        </Text>

        <FlatList
          data={events}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false} // Opcional: esconde a barra de rolagem
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
        />

              <TouchableOpacity 
              style={styles.btn} 
              onPress={() => router.replace('/dashboard')}
              accessibilityRole="button"
              accessibilityLabel="Voltar para a tela de módulos"
            >
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.btn_text}>Voltar para a tela de módulos</Text>
            </TouchableOpacity>
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
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#69b932',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  btn_text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
});
export default QRCodeScreen