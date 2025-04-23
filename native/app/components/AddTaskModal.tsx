import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Platform, TouchableOpacity,
  SafeAreaView, ScrollView
} from 'react-native';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_LOCATIONS = ['Kitchen', 'Bathroom', 'Bedroom', 'Living Room', 'Hallway', 'Garage', 'Custom...'];
const FREQUENCY_NUMBERS = ['None', ...Array.from({ length: 30 }, (_, i) => `${i + 1}`)];
const FREQUENCY_UNITS = ['None', 'Hours', 'Days', 'Weeks', 'Months', 'Years'];

export default function AddTaskModal({
  onClose,
  onSaveTask,
  editingTask
}: {
  onClose: () => void;
  onSaveTask: (task: any, isEdit: boolean) => void;
  editingTask?: any;
}) {
  const [taskName, setTaskName] = useState('');
  const [location, setLocation] = useState('Kitchen');
  const [customLocation, setCustomLocation] = useState('');
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [frequencyNumber, setFrequencyNumber] = useState('None');
  const [frequencyUnit, setFrequencyUnit] = useState('None');
  const [showPicker, setPicker] = useState(true);
  useEffect(() => {
    if (editingTask) {
      setTaskName(editingTask.title);
      setLocation(DEFAULT_LOCATIONS.includes(editingTask.location) ? editingTask.location : 'Custom...');
      setCustomLocation(editingTask.location);
      setShowCustomLocation(!DEFAULT_LOCATIONS.includes(editingTask.location));
      setDate(new Date(editingTask.dueDate));
      setNotes(editingTask.notes || '');
      if (editingTask.frequency && editingTask.frequency !== 'None') {
        const [_, num, unit] = editingTask.frequency.split(' ');
        setFrequencyNumber(num);
        setFrequencyUnit(unit);
      }
    }
  }, [editingTask]);

  const handleSave = () => {
    if (!taskName.trim()) {
      alert('Please enter a task name');
      return;
    }

    const finalLocation = showCustomLocation ? customLocation : location;
    if (showCustomLocation && !customLocation.trim()) {
      alert('Please enter a custom location');
      return;
    }

    const task = {
      id: editingTask?.id || Date.now().toString(),
      title: taskName,
      location: finalLocation,
      dueDate: date.toISOString(),
      notes,
      frequency:
        frequencyNumber === 'None' || frequencyUnit === 'None'
          ? 'None'
          : `Every ${frequencyNumber} ${frequencyUnit}`,
    };

    onSaveTask(task, !!editingTask);
    onClose();
  };
  const handleChangeDate = (e : DateTimePickerEvent, selectedDate? : Date) => {
    if(e.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }
    setPicker(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>{editingTask ? 'Edit Task' : 'New Task'}</Text>
        <TouchableOpacity onPress={handleSave}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Task Name</Text>
          <TextInput style={styles.input} placeholder="e.g., Replace air filter" placeholderTextColor="#555" value={taskName} onChangeText={setTaskName} />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Location</Text>
          <Picker selectedValue={location} onValueChange={(value) => {
            setShowCustomLocation(value === 'Custom...');
            setLocation(value);
          }} style={{ color: '#333' }} dropdownIconColor="#333">
            {DEFAULT_LOCATIONS.map(loc => (
              <Picker.Item key={loc} label={loc} value={loc} color="#333" />
            ))}
          </Picker>
          {showCustomLocation && (
            <TextInput style={styles.input} placeholder="Custom location" placeholderTextColor="#555" value={customLocation} onChangeText={setCustomLocation} />
          )}
        </View>

        <View style={styles.fieldContainer}>
        {Platform.OS === 'ios' ? (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={handleChangeDate}
          />
        ) : (
          <>
            <TouchableOpacity
              onPress={() =>
                DateTimePickerAndroid.open({
                  value: date,
                  mode: 'date',
                  is24Hour: true,
                  onChange: handleChangeDate,
                })
              }
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#111' }}>{date.toLocaleString()}</Text>
            </TouchableOpacity>
          </>
        )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Frequency</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Picker selectedValue={frequencyNumber} onValueChange={(val) => setFrequencyNumber(val)} style={{ color: '#333' }} dropdownIconColor="#333">
                {FREQUENCY_NUMBERS.map((num) => (
                  <Picker.Item key={num} label={num} value={num} color="#333" />
                ))}
              </Picker>
            </View>
            <View style={{ flex: 1 }}>
              <Picker selectedValue={frequencyUnit} onValueChange={(val) => setFrequencyUnit(val)} style={{ color: '#333' }} dropdownIconColor="#333">
                {FREQUENCY_UNITS.map((unit) => (
                  <Picker.Item key={unit} label={unit} value={unit} color="#333" />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput style={[styles.input, { height: 100 }]} placeholder="Optional notes..." placeholderTextColor="#555" multiline value={notes} onChangeText={setNotes} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  cancelText: { fontSize: 16, color: '#444' },
  saveText: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  formContainer: { padding: 20 },
  fieldContainer: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 6, color: '#111' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    color: '#111',
  },
});
