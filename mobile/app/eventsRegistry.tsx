import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createNewEvent } from '../services/event.service';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import MaskInput from 'react-native-mask-input';


export default function RegisterEventQuickForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [locationName, setLocationName] = useState('')
  const [lat, setLat] = useState<number>(0)
  const [lng, setLng] = useState<number>(0)
  const [maxParticipants, setMaxParticipants] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [userId, setUserId] = useState<any>(null)

  const [error, setError] = useState('');

  const parseToISO = (dateStr: any, timeStr: any) => {
    const [day, month, year] = dateStr.split('/');
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(year, month - 1, day, hours, minutes);
    return date.toISOString();
  };

  useEffect(() => {

    const fetchUserId = async () => {
      const response = await AsyncStorage.getItem('id')

      setUserId(response)
    }

    const fetchLocation = async () => {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setLat(latitude)
      setLng(longitude)
    }

    fetchUserId()
    fetchLocation()

  }, [])


  const handleRegister = async () => {
    if (!title || !description || !locationName || !maxParticipants || !type || !category) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {

      setError('')

      const eventPayload = {
        title,
        description,
        startDate: parseToISO(startDate, startTime),
        endDate: parseToISO(endDate, endTime),
        location: {
          name: locationName,
          coordinates: {
            lat: lat,
            lng: lng,
          },
        },
        maxParticipants: parseInt(maxParticipants),
        createdBy: userId,
        type,
        category,
        qrCodeData,
      };

      const res = await createNewEvent(eventPayload)

      console.log('Evento criado:', res);
      Alert.alert('Sucesso', 'Evento registrado com sucesso!');
    } catch (err) {
      setError('Erro ao formatar as datas. Use o formato correto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Evento</Text>

      {error ? <Text style={styles.message}>{error}</Text> : null}

      <TextInput placeholder="Título" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Descrição" style={styles.inputDesc} value={description} onChangeText={setDescription} multiline />

      <MaskInput
        style={styles.input}
        placeholder="Data início (DD/MM/YYYY)"
        value={startDate}
        onChangeText={(text) => setStartDate(text)}
        mask={[
          /\d/,
          /\d/,
          '/',
          /\d/,
          /\d/,
          '/',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]} // DD/MM/YYYY
        keyboardType="number-pad"
      />

      <MaskInput
        style={styles.input}
        placeholder="Hora início (HH:mm)"
        value={startTime}
        onChangeText={(text) => setStartTime(text)}
        mask={[
          /\d/,
          /\d/,
          ':',
          /\d/,
          /\d/,
        ]} // HH:mm
        keyboardType="number-pad"
      />

      <MaskInput
        style={styles.input}
        placeholder="Data fim (DD/MM/YYYY)"
        value={endDate}
        onChangeText={(text) => setEndDate(text)}
        mask={[
          /\d/,
          /\d/,
          '/',
          /\d/,
          /\d/,
          '/',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        keyboardType="number-pad"
      />
      <MaskInput
        style={styles.input}
        placeholder="Hora fim (HH:mm)"
        value={endTime}
        onChangeText={(text) => setEndTime(text)}
        mask={[
          /\d/,
          /\d/,
          ':',
          /\d/,
          /\d/,
        ]}
        keyboardType="number-pad"
      />


      <TextInput placeholder="Nome do local" style={styles.input} value={locationName} onChangeText={setLocationName} />
      <TextInput placeholder="Máximo de participantes" keyboardType="numeric" style={styles.input} value={maxParticipants} onChangeText={setMaxParticipants} />
      <TextInput placeholder="Tipo (ex: workshop)" style={styles.input} value={type} onChangeText={setType} />
      <TextInput placeholder="Categoria (ex: tecnologia)" style={styles.input} value={category} onChangeText={setCategory} />

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/events')}>
          <Text style={styles.btn_text}> Voltar para os eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btn_text}>Registrar Evento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#02250c',
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#006653',
    marginBottom: 15,
    fontSize: 16,
  },
  inputDesc: {
    backgroundColor: '#f4f4f4',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#006653',
    fontSize: 16,
    marginBottom: 10,
    height: 6100
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
  message: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
