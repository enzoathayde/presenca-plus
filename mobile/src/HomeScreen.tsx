import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
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
    // Construindo a URL para a API
    const url = `${API_URL}/api/users/getAll`;

    // Fazendo a requisição
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setUsers(data); // Atualizando o estado com os dados recebidos
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []); // O array vazio [] faz a requisição apenas uma vez, quando o componente for montado

  return (
    <View>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Go to Friends" onPress={() => navigation.navigate('Friends')} />

      {/* Exibindo os usuários */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id} // Assumindo que o id é único
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
