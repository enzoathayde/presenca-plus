import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DashboardStackParamList = {
	Dashboard: undefined;
	Camera: undefined;
	QRCode: undefined;
};

const DashboardScreen: React.FC<any> = () => {
	const [user, setUser] = useState<any>("");
	const [role, setRole] = useState<any>("");

	const handleNavigateCamera = () => {
		router.push("/camera");
	};
	const handleNavigateQR = () => {
		router.push("/qrcode");
	};

	const handleNavigateEvents = () => {
		router.push("/events");
	};

	useEffect(() => {
		const fetchUserName = async () => {
			const userName: any = await AsyncStorage.getItem("nome");
			setUser(userName);
		};
		const fetchRole = async () => {
			const role: any = await AsyncStorage.getItem("perfil");
			setRole(role);
		};

		fetchUserName();
		fetchRole();
	}, []);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.header} />
			<View style={styles.content}>
				{user && (
					<Text style={styles.welcomeText}>
						Bem vindo, <Text style={{ fontWeight: "bold" }}>{user}</Text>
					</Text>
				)}

				<View style={styles.grid}>
					{role === "aluno" ? (
						<>
							<TouchableOpacity
								style={styles.card}
								onPress={handleNavigateEvents}
							>
								<FontAwesome5 name="calendar-plus" size={40} color="white" />
								<Text style={styles.cardText}>Eventos</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.card} onPress={handleNavigateQR}>
								<FontAwesome5 name="qrcode" size={40} color="white" />
								<Text style={styles.cardText}>Código QR</Text>
							</TouchableOpacity>
						</>
					) : role === "professor" ? (
						<>
							<TouchableOpacity
								style={styles.card}
								onPress={() => router.push("/listAlunos")}
							>
								<FontAwesome5 name="users" size={40} color="white" />
								<Text style={styles.cardText}>Administrar Alunos</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.card}
								onPress={handleNavigateEvents}
							>
								<FontAwesome5 name="list" size={40} color="white" />
								<Text style={styles.cardText}>Lista de Eventos</Text>
							</TouchableOpacity>
						</>
					) : null}
				</View>
					<TouchableOpacity style={styles.btn_login} >
						<Text style={styles.btn_text}>Login</Text>
					</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: "#FFFFFF",
		alignItems: "center"
	},
	header: {
		height: 100,
		backgroundColor: "#69b932",
		width: "100%",
	},
	content: {
		backgroundColor: "#f4f4f4",
		width: "100%",
		height: "90%",
		borderRadius: 8,
		marginTop: -20,
		padding: 20,
		alignItems: "center",
	},
	welcomeText: {
		fontSize: 16,
		marginBottom: 40,
		alignSelf: "flex-start",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		backgroundColor: "#f4f4f4",
		gap: 20,
	},
	card: {
		backgroundColor: "#69b932",
		width: 120,
		height: 120,
		margin: 10,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	cardText: {
		paddingTop: 10,
		color: "white",
		textAlign: "center",
		marginTop: 10,
		fontSize: 14,
	},
	  btn_login: {
    width: '95%',
    padding: 12,
    marginTop: 15,
    borderRadius: 6,
    backgroundColor: '#69b932',
    alignItems: 'center',
  },
	  btn_text: {
    fontWeight: 'bold',
    color: '#f4f4f4',
    fontSize: 16,
  },
});

export default DashboardScreen;
