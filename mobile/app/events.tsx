import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
  Modal,
} from "react-native";
import { fetchAllEvents } from "../services/event.service";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAttendance,
  setAttendanceType,
  setEventId,
} from "../slices/attendanceSlice";
import { findAttendancesByUserId } from "../services/attendance.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { SyncStatus } from "../components/SyncStatus";
import {
  saveEventsOffline,
  getOfflineEvents,
  isOnline,
} from "../services/offline.service";

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

interface Attendance {
  _id?: string;
  eventId: string;
  userId: string;
  checkInMethod: string;
  checkInTime: number;
  location: {
    lat: number;
    long: number;
  };
  deviceInfo: {
    brand: string | null;
    modelName: string | null;
    osName: string;
    osVersion: string;
  };
  qrCode?: string;
  synced?: boolean;
}

const EventsScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get("window").width;
  const [events, setEvents] = useState<Event[]>([]);
  const [markedEvent, setMarkedEvent] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [attendancesFromLoggedUser, setAttendancesFromLoggedUser] = useState<
    Attendance[]
  >([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const dispatch = useDispatch();
  useSelector(selectAttendance);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("id");
        const storedUserRole = await AsyncStorage.getItem("perfil");
        setUserId(storedUserId);
        setUserRole(storedUserRole);
        console.log("Dados do usuário carregados:", {
          storedUserId,
          storedUserRole,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const connected = await isOnline();
        setIsConnected(connected);

        if (connected) {
          // Online - busca do servidor
          try {
            const response = await fetchAllEvents();
            const eventsData = response.data || response;
            setEvents(eventsData || []);
            // Salva offline para backup
            await saveEventsOffline(eventsData || []);
          } catch (apiError) {
            // Fallback para dados offline se API falhar
            const offlineEvents = await getOfflineEvents();
            setEvents(offlineEvents);
            if (offlineEvents.length > 0) {
              Alert.alert("Aviso", "Carregando eventos salvos offline");
            }
          }
        } else {
          // Offline - busca do cache local
          const offlineEvents = await getOfflineEvents();
          setEvents(offlineEvents);
          if (offlineEvents.length === 0) {
            Alert.alert("Offline", "Nenhum evento salvo offline disponível");
          }
        }
      } catch (error) {
        console.error("Erro geral ao carregar eventos:", error);
        Alert.alert("Erro", "Não foi possível carregar os eventos");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadAttendances = async () => {
      if (userId) {
        try {
          console.log("Carregando presenças para o usuário:", userId);
          const attendances = await findAttendancesByUserId(userId);
          const attendanceData = attendances.data || attendances || [];
          console.log("Presenças carregadas:", attendanceData);
          setAttendancesFromLoggedUser(attendanceData);
        } catch (error) {
          console.error("Erro ao carregar presenças:", error);
        }
      }
    };

    loadAttendances();
  }, [userId]);

  const isUserRegisteredInEvent = (eventId: string) => {
    const isRegistered = attendancesFromLoggedUser.some((attendance) => {
      console.log("Comparando:", {
        attendanceEventId: attendance.eventId,
        currentEventId: eventId,
        isMatch: attendance.eventId === eventId,
      });
      return attendance.eventId === eventId;
    });
    console.log("Usuário está registrado no evento?", {
      eventId,
      isRegistered,
    });
    return isRegistered;
  };

  const toggleMarkEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const setAttendanceMode = (type: string, eventId: string) => {
    dispatch(setAttendanceType(type));
    dispatch(setEventId(eventId));
    router.replace("/camera");
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <>
      <View style={[styles.eventContainer, { width: windowWidth - 32 }]}>
        <View style={styles.eventHeader}>
          <MaterialIcons name="event" size={24} color="#69b932" />
          <Text style={styles.eventTitle}>{item.title}</Text>
          {!isConnected && (
            <MaterialIcons name="cloud-off" size={16} color="#ff6b6b" />
          )}
        </View>

        <Text style={styles.eventDescription}>{item.description}</Text>

        {!isUserRegisteredInEvent(item._id) ? (
          <TouchableOpacity
            style={styles.markButton}
            onPress={() => toggleMarkEvent(item)}
            accessibilityLabel="Marcar presença no evento"
            accessibilityHint="Toque para marcar sua presença neste evento"
          >
            <MaterialIcons name="check-circle" size={20} color="#fff" />
            <Text style={styles.markButtonText}> Marcar Presença</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.markButton, styles.registeredButton]}
            disabled
            accessibilityLabel="Presença já registrada"
          >
            <MaterialIcons name="check-circle" size={20} color="#fff" />
            <Text style={styles.markButtonText}>Presença registrada</Text>
          </TouchableOpacity>
        )}

        {markedEvent === item._id && (
          <View style={styles.markingOptions}>
            <Text style={styles.titleMarked}>
              Informe como você quer marcar sua presença:
            </Text>

            <TouchableOpacity
              style={styles.markButton}
              onPress={() => setAttendanceMode("qr", item._id)}
              accessibilityLabel="Marcar presença usando QR code"
            >
              <MaterialIcons name="qr-code" size={20} color="#fff" />
              <Text style={styles.markButtonText}> QR code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.markButton}
              onPress={() => setAttendanceMode("manual", item._id)}
              accessibilityLabel="Marcar presença com foto e localização"
            >
              <MaterialIcons name="location-on" size={20} color="#fff" />
              <Text style={styles.markButtonText}> Foto com localização</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
  

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { paddingTop: insets.top },
        ]}
      >
        <MaterialIcons name="hourglass-empty" size={48} color="#69b932" />
        <Text style={styles.loadingText}>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Próximos Eventos</Text>

      {/* Componente de status de sincronização */}
      <SyncStatus />

      {events.length === 0 ? (
        <View style={styles.centerContent}>
          <MaterialIcons name="event-busy" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {isConnected
              ? "Nenhum evento disponível"
              : "Nenhum evento salvo offline"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEventCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {(userRole === "professor" || userRole === "admin") && (
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.replace("/eventsRegistry")}
            accessibilityLabel="Registrar novo evento"
          >
            <MaterialIcons name="add-circle" size={20} color="#fff" />
            <Text style={styles.btn_text}>Registrar Evento</Text>
          </TouchableOpacity>
        </View>
      )} 

      {(userRole === "aluno") && ( 
        <View style={styles.btnContainer}>
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
      )}

      <AttendanceModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={handleCloseModal}
        onSelectQR={(eventId) => {
          setAttendanceMode("qr", eventId);
          handleCloseModal();
        }}
        onSelectManual={(eventId) => {
          setAttendanceMode("manual", eventId);
          handleCloseModal();
        }}
      />
    </View>
  );
};

const AttendanceModal = ({
  visible,
  event,
  onClose,
  onSelectQR,
  onSelectManual,
}: {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
  onSelectQR: (eventId: string) => void;
  onSelectManual: (eventId: string) => void;
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            Como você vai marcar sua presença no evento ?{" "}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => event && onSelectQR(event._id)}
        >
          <MaterialIcons name="qr-code" size={24} color="#fff" />
          <Text style={styles.modalButtonText}>QR code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => event && onSelectManual(event._id)}
        >
          <MaterialIcons name="location-on" size={24} color="#fff" />
          <Text style={styles.modalButtonText}>Foto com localização</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  btn_text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  btnContainer: {
    padding: 16,
    gap: 12,
  },
  btn: {
    backgroundColor: "#69b932",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  back_btn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#69b932',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '95%',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 24,
    textAlign: "center",
  },
  eventContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
    flex: 1,
  },
  eventDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 16,
  },
  markingOptions: {
    marginTop: 16,
    gap: 12,
  },
  titleMarked: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  markButton: {
    backgroundColor: "#69b932",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  registeredButton: {
    backgroundColor: "#28a745",
  },
  markedButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  markButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  eventTitleModal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#69b932",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default EventsScreen;
