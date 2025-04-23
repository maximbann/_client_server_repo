import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddMaintenanceTaskModal from '../components/AddMaintenanceTaskModal';

type Season = 'Winter' | 'Spring' | 'Summer' | 'Autumn';

type TaskItem = {
  task: string;
  frequency: string;
  completed: boolean;
};

type SeasonalTasks = {
  [key in Season]: TaskItem[];
};

const initialTasks: SeasonalTasks = {
  Winter: [
    { task: 'Insulate exposed pipes', frequency: 'Every year', completed: false },
    { task: 'Check roof for ice dams', frequency: 'Every year', completed: false },
    { task: 'Cover/drain outdoor faucets', frequency: 'Every year', completed: false },
    { task: 'Test smoke & CO detectors', frequency: 'Every 6 months', completed: false },
    { task: 'Reverse ceiling fans (clockwise)', frequency: 'Every year', completed: false },
    { task: 'Service furnace/heating system', frequency: 'Every year', completed: false },
  ],
  Spring: [
    { task: 'Clean gutters', frequency: 'Every 6 months', completed: false },
    { task: 'Check HVAC system', frequency: 'Every year', completed: false },
    { task: 'Inspect roof for winter damage', frequency: 'Every year', completed: false },
    { task: 'Power wash siding & driveway', frequency: 'Every year', completed: false },
    { task: 'Air out the house', frequency: 'Every 6 months', completed: false },
    { task: 'Inspect outdoor deck/furniture	', frequency: 'Every year', completed: false },
  ],
  Summer: [
    { task: 'Test smoke detectors', frequency: 'Every year', completed: false },
    { task: 'Trim trees and bushes', frequency: 'Every year', completed: false },
    { task: 'Clean fans and vents', frequency: 'Every 6 months', completed: false },
    { task: 'Seal driveway', frequency: 'Every year', completed: false },
    { task: 'Inspect for pest entry points', frequency: 'Every 6 months', completed: false },
    { task: 'Clean windows/screens', frequency: 'Every 6 months', completed: false },
    { task: 'Test home security before vacations', frequency: 'Every year', completed: false },
  ],
  Autumn: [
    { task: 'Rake leaves and clean yard', frequency: 'Every year', completed: false },
    { task: 'Service furnace', frequency: 'Every year', completed: false },
    { task: 'Check weather stripping on doors/windows', frequency: 'Every year', completed: false },
    { task: 'Cover/store patio furniture', frequency: 'Every year', completed: false },
    { task: 'Test sump pump & battery	', frequency: 'Every year', completed: false },
  ],
};

const seasonEmojis: { [key in Season]: string } = {
  Winter: '❄️',
  Spring: '🌸',
  Summer: '☀️',
  Autumn: '🍂',
};

export default function MaintenancePage() {
  const [tasksBySeason, setTasksBySeason] = useState<SeasonalTasks>(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleTask = (season: Season, index: number) => {
    const updated = { ...tasksBySeason };
    updated[season][index].completed = !updated[season][index].completed;
    setTasksBySeason(updated);
  
    // Optional: auto-remove after delay
    if (updated[season][index].completed) {
      setTimeout(() => {
        setTasksBySeason(prev => ({
          ...prev,
          [season]: prev[season].filter((_, i) => i !== index)
        }));
      }, 800);
    }
  };
  
  const handleAddTask = (newTask: TaskItem, season: Season) => {
    setTasksBySeason(prev => ({
      ...prev,
      [season]: [...prev[season], newTask],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maintenance</Text>
      <ScrollView>
        {Object.entries(tasksBySeason).map(([season, tasks]) => (
          <View key={season} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {seasonEmojis[season as Season]} {season}
            </Text>
            {tasks.map((item, index) => (
              <View key={index} style={styles.taskItem}>
                <TouchableOpacity onPress={() => toggleTask(season as Season, index)}>
                  <Ionicons
                    name={item.completed ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={item.completed ? '#4CAF50' : '#888'}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.taskText, item.completed && styles.completedText]}
                  >
                    {item.task}
                  </Text>
                  <Text style={styles.freqText}>{item.frequency}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="pencil-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#000" />
      </TouchableOpacity>

      <AddMaintenanceTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 30, 
    paddingBottom: 10
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
  },
  freqText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    right: 25,
    bottom: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
