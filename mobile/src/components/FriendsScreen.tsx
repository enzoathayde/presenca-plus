import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Friends: undefined;
};

type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>;

interface Props {
  navigation: FriendsScreenNavigationProp;
}

const FriendsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>Add friends here!</Text>
      <Button title="Back to home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default FriendsScreen;
