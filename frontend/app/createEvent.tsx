import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { createEvent, CreateEventDTO } from '../services/eventService'; // Importando o serviço para criar evento
import { Picker } from '@react-native-picker/picker';

export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationCoordinates, setLocationCoordinates] = useState({ lat: 0, lng: 0 });
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [type, setType] = useState<'class' | 'lecture' | 'workshop' | 'other'>('workshop');
  const [category, setCategory] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');

  // Função para validar se a data é válida
  const isValidDate = (date: any) => {
    return date && new Date(date).toString() !== 'Invalid Date';
  };

  // Função para validar os dados do evento
  const handleCreateEvent = async () => {
    if (
      !title || !startDate || !endDate || !locationName || !maxParticipants || !type || !category
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      Alert.alert('Erro', 'As datas de início e fim são inválidas.');
      return;
    }

    if (locationCoordinates.lat === 0 || locationCoordinates.lng === 0) {
      Alert.alert('Erro', 'As coordenadas de localização são inválidas.');
      return;
    }

    if (maxParticipants <= 0) {
      Alert.alert('Erro', 'O número máximo de participantes deve ser maior que 0.');
      return;
    }

    const eventData: CreateEventDTO = {
      title,
      description,
      startDate,
      endDate,
      location: {
        name: locationName,
        coordinates: locationCoordinates,
      },
      maxParticipants,
      createdBy: '12345', // Aqui você pode pegar o id do usuário logado
      type,
      category,
      qrCodeData: qrCodeData || undefined, // Deixe o qrCodeData como opcional
    };

    try {
      await createEvent(eventData); // Chama a função para criar o evento
      Alert.alert('Sucesso', 'Evento criado com sucesso!');
      // Após criar o evento, você pode redirecionar ou limpar os campos
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar evento.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Evento</Text>

      {/* Campos de entrada */}
      <TextInput
        style={styles.input}
        placeholder="Título do Evento"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição do Evento"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Início"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Fim"
        value={endDate}
        onChangeText={setEndDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Localização (Nome)"
        value={locationName}
        onChangeText={setLocationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={locationCoordinates.lat.toString()}
        onChangeText={(text) => setLocationCoordinates({ ...locationCoordinates, lat: parseFloat(text) })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={locationCoordinates.lng.toString()}
        onChangeText={(text) => setLocationCoordinates({ ...locationCoordinates, lng: parseFloat(text) })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Número Máximo de Participantes"
        value={maxParticipants.toString()}
        onChangeText={(text) => setMaxParticipants(parseInt(text))}
        keyboardType="numeric"
      />

      {/* Tipo do Evento */}
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue: any) => {
            setType(itemValue);
            // You can add more code here if needed
        }}
      >
        <Picker.Item label="Workshop" value="workshop" />
        <Picker.Item label="Class" value="class" />
        <Picker.Item label="Lecture" value="lecture" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      {/* Categoria do Evento */}
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={category}
        onChangeText={setCategory}
      />

      {/* QR Code Data */}
      <TextInput
        style={styles.input}
        placeholder="QR Code (opcional)"
        value={qrCodeData}
        onChangeText={setQrCodeData}
      />

      {/* Botão de Criar Evento */}
      <Button title="Criar Evento" onPress={handleCreateEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 10,
  },
});
