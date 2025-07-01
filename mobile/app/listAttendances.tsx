import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRequireRole } from "../hooks/useRequireRole";
import { listAllAttendances } from "../services/attendance.service";
import { getEventById, fetchAllEvents } from "../services/event.service";
import { getUserById } from "../services/user.service";
import { router } from "expo-router";

const ListAttendances: React.FC = () => {
  useRequireRole("professor");

  const [presencas, setPresencas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  useEffect(() => {
    const loadAttendances = async () => {
      try {
        setLoading(true);

        const response = await listAllAttendances();
        const attendances = Array.isArray(response) ? response : response.data;

        if (!Array.isArray(attendances)) {
          console.error("Attendances não é array:", attendances);
          setLoading(false);
          return;
        }

        const enriched = await Promise.all(
          attendances.map(async (item: any) => {
            const user = (await getUserById(item.userId)).data;
            const event = (await getEventById(item.eventId)).data;

            return {
              ...item,
              userName: user.name,
              eventName: event.title ?? event.name,
              eventId: item.eventId,
            };
          })
        );

        setPresencas(enriched);
      } catch (error) {
        console.error("Erro ao carregar presenças:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadEvents = async () => {
      try {
        const response = await fetchAllEvents();
        const eventsData = response.data || response;
        setEvents(eventsData);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      }
    };

    loadAttendances();
    loadEvents();
  }, []);

  const filteredPresencas =
    selectedEventId === ""
      ? presencas
      : presencas.filter((p) => p.eventId === selectedEventId);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#69b932" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Presenças Registradas</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedEventId}
          onValueChange={(value) => setSelectedEventId(value)}
        >
          <Picker.Item label="Todos os eventos" value="" />
          {events.map((event) => (
            <Picker.Item
              key={event._id}
              label={event.title}
              value={event._id}
            />
          ))}
        </Picker>
      </View>

      {filteredPresencas.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Nenhuma presença encontrada.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPresencas}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Usuário:</Text>
              <Text>{item.userName}</Text>

              <Text style={styles.label}>Evento:</Text>
              <Text>{item.eventName}</Text>

              <Image
                source={{ uri: `http://localhost:2047${item.imageCheckIn}` }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
        />
      )}

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace("/dashboard")}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela de módulos"
        >
          <Text style={styles.btn_text}>Voltar para o Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  pickerContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  label: {
    fontWeight: "bold",
    marginTop: 4,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
  btnContainer: {
    padding: 16,
  },
  btn: {
    backgroundColor: "#69b932",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  btn_text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ListAttendances;
