import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type EditProfileScreenProps = {
  onSave: () => void;
};

export default function EditProfileScreen({ onSave }: EditProfileScreenProps) {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  const [phone, setPhone] = useState('+1 234 567 8901');
  const [address, setAddress] = useState('1234 Maple Street, Atlanta, GA 30303');
  const [homeType, setHomeType] = useState('Single-family home');
  const [homeSize, setHomeSize] = useState('2,000 sq ft');
  const [ownership, setOwnership] = useState('Owner-occupied');
  const [numResidents, setNumResidents] = useState('4');

  const handleSave = () => {
    alert('Profile saved!');
    onSave();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onSave}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />

        <Text style={styles.label}>Home Type</Text>
        <TextInput style={styles.input} value={homeType} onChangeText={setHomeType} />

        <Text style={styles.label}>Home Size</Text>
        <TextInput style={styles.input} value={homeSize} onChangeText={setHomeSize} />

        <Text style={styles.label}>Ownership</Text>
        <TextInput style={styles.input} value={ownership} onChangeText={setOwnership} />

        <Text style={styles.label}>Number of Residents</Text>
        <TextInput style={styles.input} value={numResidents} onChangeText={setNumResidents} keyboardType="numeric" />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    marginHorizontal: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});