import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { findUsersByRole, deleteUser } from "../services/user.service";
import { router } from "expo-router";
import { useRequireRole } from "../hooks/useRequireRole"; // Hook de segurança

const AdminAlunosScreen: React.FC = () => {
  useRequireRole("professor"); // ✅ Proteção de acesso

  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState<any>(null);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await findUsersByRole("aluno");
        setAlunos(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  const handleDelete = async () => {
    try {
      if (alunoToDelete) {
        await deleteUser(alunoToDelete._id);
        setAlunos(alunos.filter(aluno => aluno._id !== alunoToDelete._id));
        Alert.alert("Sucesso", "Aluno excluído com sucesso");
      }
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      Alert.alert("Erro", "Não foi possível excluir o aluno");
    } finally {
      setModalVisible(false);
    }
  };

  const pushUserView = (alunoEmail: string) => {
    router.push({
      pathname: "/userView",
      params: { userEmail: alunoEmail },
    });
  };

  const confirmDelete = (aluno: any) => {
    setAlunoToDelete(aluno);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Administrar Alunos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#69b932" />
      ) : (
        alunos.map((aluno, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.item}>
              <Text style={styles.label}>Nome:</Text> {aluno.name}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Email:</Text> {aluno.email}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Matrícula:</Text> {aluno.registration}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Curso:</Text> {aluno.course || "Não informado"}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.buttonVer} onPress={() => pushUserView(aluno.email)}>
                <FontAwesome5 name="eye" size={16} color="white" />
                <Text style={styles.buttonText}>Ver</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonExcluir} onPress={() => confirmDelete(aluno)}>
                <FontAwesome5 name="trash" size={16} color="white" />
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza que deseja excluir este aluno?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.modalButton}>
                <Text>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/dashboard')}>
        <Text style={styles.btn_text}> Voltar para a tela de módulos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start",
    color: "#333",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  item: {
    fontSize: 14,
    marginBottom: 5,
    color: "#444",
  },
  label: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  buttonVer: {
    backgroundColor: "#69b932",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 5,
  },
  btn: {
    backgroundColor: '#69b932',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  btn_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonExcluir: {
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#69b932",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export default AdminAlunosScreen;
