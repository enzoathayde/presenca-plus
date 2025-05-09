import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView
} from 'react-native';
import { createNewEvent } from '../services/event.service';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import MaskInput from 'react-native-mask-input';

export default function RegisterEventQuickForm() {
  const [step, setStep] = useState(1); 

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [userId, setUserId] = useState<any>(null);
  const [error, setError] = useState('');

  const parseToISO = (dateStr: string, timeStr: string) => {
    const [day, month, year]: any = dateStr.split('/');
    const [hours, minutes]: any = timeStr.split(':');
    const date = new Date(year, month - 1, day, hours, minutes);
    return date.toISOString();
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const response = await AsyncStorage.getItem('id');
      setUserId(response);
    };

    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      const location = await Location.getCurrentPositionAsync({});
      console.log('ds');
      
      console.log(location);
      
      const { latitude, longitude } = location.coords;
      console.log(latitude, longitude);
      
      setLat(latitude);
      setLng(longitude);
    };

    fetchUserId();
    fetchLocation();
  }, []);

  const handleRegister = async () => {
    if (!title || !description || !locationName || !maxParticipants || !type || !category) {
      setError('Por favor, preencha todos os campos obrigatórios.');

      setTimeout(() => {
        setError('')
      }, 2000)
      return;
    }

    try {
      setError('');

      const eventPayload = {
        title: title,
        description: description,
        startDate: parseToISO(startDate, startTime),
        endDate: parseToISO(endDate, endTime),
        location: {
          name: locationName,
          coordinates: { lat: lat, lng: lng },
        },
        maxParticipants: parseInt(maxParticipants),
        createdBy: userId,
        type: type,
        category: category,
      };

      console.log(eventPayload);
      const res = await createNewEvent(eventPayload);
      console.log('Evento criado:', res);
      Alert.alert('Sucesso', 'Evento registrado com sucesso!');
      router.push('/events');
    } catch (err) {
      console.log(err)
      setError('Erro ao registrar evento. Verifique os dados.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Evento</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.formContainer}>
        {step === 1 && (
          <>
            <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} multiline />
            <TextInput style={styles.input} placeholder="Tipo (ex: workshop)" value={type} onChangeText={setType} />
            <TextInput style={styles.input} placeholder="Categoria (ex: tecnologia)" value={category} onChangeText={setCategory} />
          </>
        )}

        {step === 2 && (
          <>
            <MaskInput
              style={styles.input}
              placeholder="Data início (DD/MM/YYYY)"
              value={startDate}
              onChangeText={setStartDate}
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
              keyboardType="number-pad"
            />
            <MaskInput
              style={styles.input}
              placeholder="Hora início (HH:mm)"
              value={startTime}
              onChangeText={setStartTime}
              mask={[/\d/, /\d/, ':', /\d/, /\d/]}
              keyboardType="number-pad"
            />
            <MaskInput
              style={styles.input}
              placeholder="Data fim (DD/MM/YYYY)"
              value={endDate}
              onChangeText={setEndDate}
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
              keyboardType="number-pad"
            />
            <MaskInput
              style={styles.input}
              placeholder="Hora fim (HH:mm)"
              value={endTime}
              onChangeText={setEndTime}
              mask={[/\d/, /\d/, ':', /\d/, /\d/]}
              keyboardType="number-pad"
            />
          </>
        )}

        {step === 3 && (
          <>
            <TextInput style={styles.input} placeholder="Nome do local" value={locationName} onChangeText={setLocationName} />
            <TextInput style={styles.input} placeholder="Máximo de participantes" keyboardType="numeric" value={maxParticipants} onChangeText={setMaxParticipants} />
          </>
        )}
      </View>

      <View style={styles.btnGroup}>
        {step === 1 && (
          <TouchableOpacity style={styles.btnSecondaryDisabled} onPress={() => setStep(step - 1)} disabled>
            <Text style={styles.font_text}>Voltar</Text>
          </TouchableOpacity>
        )}

        {step > 1 && (
          <TouchableOpacity style={styles.btnSecondary} onPress={() => setStep(step - 1)}>
            <Text style={styles.font_text}>Voltar</Text>
          </TouchableOpacity>
        )}

        {step < 3 && (
          <TouchableOpacity style={styles.btn} onPress={() => setStep(step + 1)}>
            <Text style={styles.font_text}>Próximo</Text>
          </TouchableOpacity>
        )}

        {step === 3 && (
          <TouchableOpacity style={styles.btn} onPress={handleRegister}>
            <Text style={styles.font_text}>Registrar Evento</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity style={styles.btnBackToEvents} onPress={() => router.push('/events')}>
        <Text style={styles.font_text}>Voltar para Eventos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    paddingHorizontal: 20,  
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 80,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,  
    justifyContent: 'center',  
    width: '100%',
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#006653',
    width: '100%',
    fontSize: 16,
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10, 
  },
  btn: {
    backgroundColor: '#69b932',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    width: '49%',
  },
  btnSecondary: {
    backgroundColor: '#69b932',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    width: '49%',
  },
  btnSecondaryDisabled: {
    backgroundColor: '#69b932',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    opacity: 0.6,
    width: '49%',
  },
  font_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnBackToEvents: {
    backgroundColor: '#69b932',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,  
  },
  error: {
    marginTop: 30,
    color: 'red',
    textAlign: 'center',
  },
});
