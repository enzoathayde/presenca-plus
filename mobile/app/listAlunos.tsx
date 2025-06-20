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
  Dimensions,
  Platform,
  AccessibilityInfo,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { findUsersByRole, deleteUser } from "../services/user.service";
import { router } from "expo-router";
import { useRequireRole } from "../hooks/useRequireRole";

const { width } = Dimensions.get('window');

const AdminAlunosScreen: React.FC = () => {
  useRequireRole("professor");

  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState<any>(null);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };
    checkScreenReader();
  }, []);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await findUsersByRole("aluno");
        setAlunos(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de alunos");
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

  const renderCard = (aluno: any, index: number) => (
    <>
    <View 
      key={index} 
      style={styles.card}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Aluno ${aluno.name}, Email: ${aluno.email}, Matrícula: ${aluno.registration}`}
    >
      <Text style={styles.item} accessibilityRole="text">
        <Text style={styles.label}>Nome:</Text> {aluno.name}
      </Text>
      <Text style={styles.item} accessibilityRole="text">
        <Text style={styles.label}>Email:</Text> {aluno.email}
      </Text>
      <Text style={styles.item} accessibilityRole="text">
        <Text style={styles.label}>Matrícula:</Text> {aluno.registration}
      </Text>
      <Text style={styles.item} accessibilityRole="text">
        <Text style={styles.label}>Curso:</Text> {aluno.course || "Não informado"}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.buttonVer} 
          onPress={() => pushUserView(aluno.email)}
          accessibilityRole="button"
          accessibilityLabel="Ver detalhes do aluno"
          accessibilityHint="Toque duas vezes para ver os detalhes completos do aluno"
        >
          <FontAwesome5 name="eye" size={16} color="white" />
          <Text style={styles.buttonText}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buttonExcluir} 
          onPress={() => confirmDelete(aluno)}
          accessibilityRole="button"
          accessibilityLabel="Excluir aluno"
          accessibilityHint="Toque duas vezes para excluir este aluno"
        >
          <FontAwesome5 name="trash" size={16} color="white" />
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
    
  );

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title} accessibilityRole="header">Administrar Alunos</Text>
      <TouchableOpacity 
        style={styles.buttonCriar} 
        onPress={() => router.push("/createUser")}
        accessibilityRole="button"
        accessibilityLabel="Criar novo usuário"
        accessibilityHint="Toque duas vezes para adicionar um novo aluno"
      >
        <Text style={styles.buttonCriarText}>+ Criar Novo Usuário</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#69b932" />
      ) : (
        alunos.map(renderCard)
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza que deseja excluir este aluno?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                style={styles.modalButton}
                accessibilityRole="button"
                accessibilityLabel="Cancelar exclusão"
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDelete} 
                style={[styles.modalButton, styles.modalButtonConfirm]}
                accessibilityRole="button"
                accessibilityLabel="Confirmar exclusão"
                accessibilityHint="Toque duas vezes para confirmar a exclusão do aluno"
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => router.push('/dashboard')}
        accessibilityRole="button"
        accessibilityLabel="Voltar para a tela de módulos"
      >
        <MaterialIcons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.btn_text}>Voltar para a tela de módulos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    minHeight: '100%',
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 24 : 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start",
    color: "#333",
  },
  buttonCriar: {
    backgroundColor: '#69b932',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'flex-end',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonCriarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonConfirm: {
    backgroundColor: "#e74c3c",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
    lineHeight: 24,
  },
  label: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    gap: 12,
  },
  buttonVer: {
    backgroundColor: "#69b932",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
