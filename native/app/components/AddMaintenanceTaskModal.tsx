import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SEASONS = ['Winter', 'Spring', 'Summer', 'Autumn'] as const;
const FREQUENCY_NUMBERS = ['None', ...Array.from({ length: 30 }, (_, i) => `${i + 1}`)];
const FREQUENCY_UNITS = ['None', 'Days', 'Weeks', 'Months', 'Years'];

type Season = typeof SEASONS[number];

type TaskItem = {
  task: string;
  frequency: string;
  completed: boolean;
  notes?: string;
};

type AddMaintenanceTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (task: TaskItem, season: Season, index?: number) => void;
  editingTask?: { task: TaskItem; season: Season; index: number } | null;
  onDelete?: (season: Season, index: number) => void;
};

export default function AddMaintenanceTaskModal({
  visible,
  onClose,
  onSave,
  editingTask = null,
  onDelete,
}: AddMaintenanceTaskModalProps) {
  const [task, setTask] = useState('');
  const [season, setSeason] = useState<Season>('Winter');
  const [frequencyNumber, setFrequencyNumber] = useState('None');
  const [frequencyUnit, setFrequencyUnit] = useState('None');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask.task.task);
      setSeason(editingTask.season);
      setNotes(editingTask.task.notes || '');
      if (editingTask.task.frequency && editingTask.task.frequency !== 'None') {
        const parts = editingTask.task.frequency.split(' ');
        setFrequencyNumber(parts[1]);
        setFrequencyUnit(parts[2]);
      } else {
        setFrequencyNumber('None');
        setFrequencyUnit('None');
      }
    } else {
      setTask('');
      setSeason('Winter');
      setFrequencyNumber('None');
      setFrequencyUnit('None');
      setNotes('');
    }
  }, [editingTask]);

  const handleSave = () => {
    if (!task.trim()) {
      alert('Please enter a task name');
      return;
    }
    const frequency =
      frequencyNumber === 'None' || frequencyUnit === 'None'
        ? 'None'
        : `Every ${frequencyNumber} ${frequencyUnit}`;

    const taskObj = {
      task,
      frequency,
      completed: editingTask ? editingTask.task.completed : false,
      notes,
    };

    if (editingTask) {
      onSave(taskObj, season, editingTask.index);
    } else {
      onSave(taskObj, season);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editingTask && onDelete) {
      onDelete(editingTask.season, editingTask.index);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
          <Text style={styles.title}>{editingTask ? 'Edit Task' : 'Add Maintenance Task'}</Text>
          <TouchableOpacity onPress={handleSave}><Text style={styles.save}>Save</Text></TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Task</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Clean gutters"
            placeholderTextColor="#555"
            value={task}
            onChangeText={setTask}
          />

          <Text style={styles.label}>Season</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={season}
              onValueChange={(val) => setSeason(val as Season)}
              style={{ color: '#333' }}
              dropdownIconColor="#333"
            >
              {SEASONS.map(seasonOption => (
                <Picker.Item key={seasonOption} label={seasonOption} value={seasonOption} color="#333" />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Frequency</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Picker
                selectedValue={frequencyNumber}
                onValueChange={(val) => setFrequencyNumber(val)}
                style={{ color: '#333' }}
                dropdownIconColor="#333"
              >
                {FREQUENCY_NUMBERS.map(num => (
                  <Picker.Item key={num} label={num} value={num} color="#333" />
                ))}
              </Picker>
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={frequencyUnit}
                onValueChange={(val) => setFrequencyUnit(val)}
                style={{ color: '#333' }}
                dropdownIconColor="#333"
              >
                {FREQUENCY_UNITS.map(unit => (
                  <Picker.Item key={unit} label={unit} value={unit} color="#333" />
                ))}
              </Picker>
            </View>
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            placeholder="e.g., Remind to buy sealant"
            placeholderTextColor="#555"
            value={notes}
            onChangeText={setNotes}
          />

          {editingTask && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteText}>Delete Task</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: { fontSize: 18, fontWeight: '600' },
  cancel: { color: '#666', fontSize: 16 },
  save: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  formContainer: { padding: 20 },
  label: { fontSize: 16, marginBottom: 6, marginTop: 12, color: '#111' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#111',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  deleteButton: {
    marginTop: 30,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffdddd',
    alignItems: 'center',
  },
  deleteText: {
    color: '#cc0000',
    fontWeight: '600',
    fontSize: 16,
  },
});