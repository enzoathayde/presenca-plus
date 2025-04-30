import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { fetchAllEvents } from '../services/event.service';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setNativeProps } from 'react-native-reanimated';
import { selectAttendance, setAttendanceType, setEventId } from '../slices/attendanceSlice';
import { findAttendancesByUserId } from '../services/attendance.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';


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
  const [markedEvent, setMarkedEvent] = useState<any>(null);
  const [attendancesByUserLogged, setattendancesByUserLogged] = useState<any>(null)
  const dispatch = useDispatch();
  useSelector(selectAttendance);
  const [userId, setUserId] = useState<any>(null)
  const [userRole, setuserRole] = useState<any>(null)
  const [attendancesFromLoggedUser, setAttendancesFromLoggedUser] = useState<any>([])



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

  useEffect(() => {

    const fetchAttendancesByUser = async (userId: string) => {
      try {
        const response: any = await findAttendancesByUserId(userId);

        setAttendancesFromLoggedUser(response.data)

      } catch (error) {
        throw error;
      }
    }

    if (userId) {
      fetchAttendancesByUser(userId)
    }

  }, [userId])


  useEffect(() => {





  }, [userRole])


  const toggleMarkEvent = (eventId: string) => {
    setMarkedEvent(eventId)
  };

  const toogleCancelMarkEvent = () => {
    setMarkedEvent(null)

  }

  const setAttendanceMode = (attendanceType: string, eventId: string) => {
    dispatch(setAttendanceType(''))
    dispatch(setEventId(''))
    dispatch(setAttendanceType(attendanceType))
    dispatch(setEventId(eventId))
    router.push('/camera')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próximos Eventos</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{item.title}</Text>

            <Text style={styles.eventDescription}>{item.description}</Text>

            {!attendancesFromLoggedUser.some((e: any) => e.eventId === item._id) && (
              <TouchableOpacity style={styles.markButton} onPress={() => toggleMarkEvent(item._id)}>
                <Text style={styles.markButtonText}> Marcar Presença</Text>
              </TouchableOpacity>
            )}

            {attendancesFromLoggedUser.some((e: any) => e.eventId === item._id) && (
              <TouchableOpacity style={styles.markButton} disabled>
                <Text style={styles.markButtonText}> Presença registrada</Text>
              </TouchableOpacity>
            )}

            {(markedEvent === item._id) && (
              <>
                <Text style={styles.titleMarked}>Informe como você quer marcar sua presença:</Text>
                <TouchableOpacity style={styles.markButton} onPress={() => setAttendanceMode('qr', item._id)}>
                  <Text style={styles.markButtonText}> QR code</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.markButton} onPress={() => setAttendanceMode('manual', item._id)}>
                  <Text style={styles.markButtonText}> Foto com localização </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.markedButton} onPress={() => toogleCancelMarkEvent()}>
                  <Text style={styles.markButtonText}> Cancelar Marcação </Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        )}
      />

      {(userRole === "professor" || userRole === 'admin') && (
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/dashboard')}>
            <Text style={styles.btn_text}> Voltar para a tela de módulos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => router.push("/eventsRegistry")}>
            <Text style={styles.btn_text}>Registrar Evento</Text>
          </TouchableOpacity>
        </View>
      )}

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
  btn_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  btn: {
    backgroundColor: '#69b932',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 35,
    textAlign: 'center',
  },
  eventDescription: {
    marginBlock: 12,
    fontSize: 16
  },
  vacancyDescription: {
    marginBlock: 12,
    fontSize: 16,
    textAlign: 'right',
    paddingRight: 10
  },
  titleMarked: {
    marginTop: 50,
    textAlign: 'left',
    fontWeight: 'bold',
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
    marginTop: 12,
    backgroundColor: '#69b932',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerEvent: {
    width: 200,
    marginTop: 12,
    backgroundColor: '#69b932',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    textAlign: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  registerEventText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold'
  },
  markedButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
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