import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditProfileScreen from '../components/edit-profile'; // make sure this path is correct

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);

  const user = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234 567 8901',
    avatar: 'https://i.pravatar.cc/150?img=3',
    joined: 'January 2024',
    homeType: 'Single-family home',
    homeSize: '2,000 sq ft',
    location: 'Atlanta, GA',
    address: '1234 Maple Street, Atlanta, GA 30303',
    ownership: 'Owner-occupied',
    numResidents: 4,
  };
  

  if (isEditing) {
    return <EditProfileScreen onSave={() => setIsEditing(false)} />;
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.infoRow}><Text style={styles.label}>Phone:</Text><Text style={styles.value}>{user.phone}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Joined:</Text><Text style={styles.value}>{user.joined}</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Home Info</Text>
        <View style={styles.infoRow}><Text style={styles.label}>Type:</Text><Text style={styles.value}>{user.homeType}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Size:</Text><Text style={styles.value}>{user.homeSize}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Location:</Text><Text style={styles.value}>{user.location}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Address:</Text><Text style={styles.value}>{user.address}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Ownership:</Text><Text style={styles.value}>{user.ownership}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Residents:</Text><Text style={styles.value}>{user.numResidents}</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingRow} onPress={() => setIsEditing(true)}>
          <Ionicons name="person-circle-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.settingText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow}>
          <Ionicons name="log-out-outline" size={20} color="#c00" style={styles.icon} />
          <Text style={[styles.settingText, { color: '#c00' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
});
