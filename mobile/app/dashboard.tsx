import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	useWindowDimensions,
	Platform,
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
	const { width, height } = useWindowDimensions();
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

	const cardSize = Math.min(width * 0.4, 160);
	const headerHeight = Platform.OS === 'ios' ? 120 : 100;

	return (
		<ScrollView 
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
			<View style={[styles.header, { height: headerHeight }]} />
			<View style={[styles.content, { minHeight: height * 0.9 }]}>
				{user && (
					<Text style={styles.welcomeText} accessibilityRole="header">
						Bem vindo, <Text style={styles.welcomeTextBold}>{user}</Text>
					</Text>
				)}

				<View style={styles.grid}>
					{role === "aluno" ? (
						<>
							<TouchableOpacity
								style={[styles.card, { width: cardSize, height: cardSize }]}
								onPress={handleNavigateEvents}
								accessibilityLabel="Acessar eventos"
								accessibilityHint="Toque para ver a lista de eventos disponíveis"
							>
								<FontAwesome5 name="calendar-plus" size={cardSize * 0.3} color="white" />
								<Text style={styles.cardText}>Eventos</Text>
							</TouchableOpacity>

							<TouchableOpacity 
								style={[styles.card, { width: cardSize, height: cardSize }]} 
								onPress={handleNavigateQR}
								accessibilityLabel="Acessar código QR"
								accessibilityHint="Toque para gerar seu código QR"
							>
								<FontAwesome5 name="qrcode" size={cardSize * 0.3} color="white" />
								<Text style={styles.cardText}>Código QR</Text>
							</TouchableOpacity>
						</>
					) : role === "professor" ? (
						<>
							<TouchableOpacity
								style={[styles.card, { width: cardSize, height: cardSize }]}
								onPress={() => router.push("/listAlunos")}
								accessibilityLabel="Administrar alunos"
								accessibilityHint="Toque para gerenciar a lista de alunos"
							>
								<FontAwesome5 name="users" size={cardSize * 0.3} color="white" />
								<Text style={styles.cardText}>Administrar Alunos</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.card, { width: cardSize, height: cardSize }]}
								onPress={handleNavigateEvents}
								accessibilityLabel="Lista de eventos"
								accessibilityHint="Toque para ver a lista de eventos"
							>
								<FontAwesome5 name="list" size={cardSize * 0.3} color="white" />
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
		backgroundColor: "#69b932",
		width: "100%",
	},
	content: {
		backgroundColor: "#f4f4f4",
		width: "100%",
		borderRadius: 8,
		marginTop: -20,
		padding: 20,
		alignItems: "center",
	},
	welcomeText: {
		fontSize: 18,
		marginBottom: 40,
		alignSelf: "flex-start",
		color: "#333",
	},
	welcomeTextBold: {
		fontWeight: "bold",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		backgroundColor: "#f4f4f4",
		gap: 20,
		paddingVertical: 10,
	},
	card: {
		backgroundColor: "#69b932",
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		padding: 15,
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
	cardText: {
		color: "white",
		textAlign: "center",
		marginTop: 10,
		fontSize: 16,
		fontWeight: "500",
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
