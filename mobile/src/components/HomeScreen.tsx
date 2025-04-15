import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { API_URL } from '@env';

type RootStackParamList = {
  Home: undefined;
  Friends: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface User {
  _id: string;
  name: string;
  email: string;
  course: string;
  registration: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const url = `${API_URL}/api/users/getAll`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Home!</Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Friends')}>
        <Text style={styles.btn_text}>Ver Amigos</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    color: '#006653',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#019F71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  btn_text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#006653',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006653',
  },
  userEmail: {
    fontSize: 14,
    color: '#333333',
  },
});

export default HomeScreen;
