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


const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [users, setUsers] = useState<Event[]>([]);

  useEffect(() => {
    const url = `${API_URL}/api/events/getAll`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setUsers(data); 
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
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
