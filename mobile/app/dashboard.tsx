import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

type DashboardStackParamList = {
  Dashboard: undefined;
  Camera: undefined;
  QRCode: undefined;
};

type DashboardScreenNavigationProp = StackNavigationProp<DashboardStackParamList, 'Dashboard'>;
interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const handleNavigateCamera = () => {
    router.push("/camera")
  }
  const handleNavigateQR = () => {
    router.push("/qrcode")
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header} />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Bem vindo, <Text style={{ fontWeight: 'bold' }}>Aluno</Text>
        </Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={handleNavigateCamera}>
            <FontAwesome5 name="camera" size={40} color="white" />
            <Text style={styles.cardText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleNavigateQR}>
            <FontAwesome5 name="qrcode" size={40} color="white" />
            <Text style={styles.cardText}>Código QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  header: {
    height: 100,
    backgroundColor: '#69b932',
    width: '100%',
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
    fontSize: 16,
    marginBottom: 20,
    alignSelf: 'flex-start',
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

export default DashboardScreen;
