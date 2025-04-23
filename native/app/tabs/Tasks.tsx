// tasks.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  StatusBar,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddTaskModal from '../components/AddTaskModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LOCATIONS = ['All', 'Kitchen', 'Bathroom', 'Bedroom', 'Living Room', 'More'];

type Task = {
  id: number;
  title: string;
  location: string;
  dueDate: string;
  notes?: string;
  frequency?: string;
  completed?: boolean;
};

const SAMPLE_TASKS: Task[] = [
  { id: 1, title: 'Clean refrigerator', location: 'Kitchen', dueDate: new Date().toISOString(), completed: false },
  { id: 2, title: 'Unclog drain', location: 'Bathroom', dueDate: new Date().toISOString(), completed: false },
];

export default function TasksScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);

  const toggleTask = (taskId: number) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    
    // Remove completed tasks after a delay (optional)
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setTimeout(() => {
        setTasks(currentTasks => currentTasks.filter(t => t.id !== taskId || !t.completed));
      }, 800);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSaveTask = async(task: Task, isEdit: boolean) => {
    if (isEdit) {
      setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
    } else {
      setTasks(prev => [...prev, task]);
    }
    const newTask = {
      ...task,
      taskid: task.id,
      title: task.title || '',
      notes: task.notes || '',
      frequency: task.frequency || 'None',
      completed: task.completed || false,
      householdid: 1 
    };
    
  };

  const formatDueDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const groupedTasks = sortedTasks.reduce((groups: { [key: string]: Task[] }, task) => {
    const dueLabel = formatDueDateLabel(task.dueDate);
    if (!groups[dueLabel]) groups[dueLabel] = [];
    groups[dueLabel].push(task);
    return groups;
  }, {});

  const filteredGroupedTasks = selectedLocation !== 'All'
    ? Object.keys(groupedTasks).reduce((filtered: { [key: string]: Task[] }, label) => {
        const locationTasks = groupedTasks[label].filter(task => task.location === selectedLocation);
        if (locationTasks.length > 0) filtered[label] = locationTasks;
        return filtered;
      }, {})
    : groupedTasks;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Daily Tasks</Text>
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
          {LOCATIONS.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterPill, selectedLocation === location && styles.selectedFilterPill]}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setSelectedLocation(location);
              }}
            >
              <Text style={styles.filterPillText}>{location}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.taskListWrapper}>
        <ScrollView style={styles.taskListContainer}>
          {Object.keys(filteredGroupedTasks).map((label, index) => (
            <View key={index} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{label}</Text>
              {filteredGroupedTasks[label].map((task) => (
                <View key={task.id} style={styles.taskCard}>
                  <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkboxContainer}>
                    <Ionicons
                      name={task.completed ? 'checkbox' : 'square-outline'}
                      size={24}
                      color={task.completed ? '#4CAF50' : '#888'}
                      style={{ marginRight: 10 }}
                    />
                  </TouchableOpacity>
                  
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, task.completed && styles.completedText]}>
                      {task.title}
                    </Text>
                    <Text style={[styles.taskLocation, task.completed && styles.completedText]}>
                      {task.location}
                    </Text>
                    {task.frequency && task.frequency !== 'None' && (
                      <Text style={styles.taskFrequency}>{task.frequency}</Text>
                    )}
                  </View>

                  <TouchableOpacity onPress={() => handleEditTask(task)} style={styles.editButton}>
                    <Ionicons name="pencil-outline" size={20} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}

          {Object.keys(filteredGroupedTasks).length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No tasks for {selectedLocation || 'this filter'}
              </Text>
            </View>
          )}

          <View style={{ height: 80 }} />
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => { setEditingTask(null); setModalVisible(true); }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#000" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddTaskModal
          onClose={() => setModalVisible(false)}
          onSaveTask={handleSaveTask}
          editingTask={editingTask}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  title: { fontSize: 34, fontWeight: '700', color: '#000' },
  filtersWrapper: { paddingBottom: 0 },
  filtersContainer: { paddingHorizontal: 15, paddingBottom: 10 },
  filterPill: {
    backgroundColor: '#EBEBEB',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 45,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  selectedFilterPill: { backgroundColor: '#D1D1D1' },
  filterPillText: { fontSize: 16, color: '#000' },
  taskListWrapper: { flex: 1 },
  taskListContainer: { flex: 1, paddingHorizontal: 20 },
  sectionContainer: { marginBottom: 15, width: '100%' },
  sectionTitle: { fontSize: 24, fontWeight: '600', marginBottom: 8, marginTop: 5 },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 5,
  },
  taskContent: { 
    flex: 1,
  },
  taskTitle: { fontSize: 20, fontWeight: '500', marginBottom: 4 },
  taskLocation: { fontSize: 16, color: '#555' },
  taskFrequency: { fontSize: 14, color: '#999', marginTop: 2 },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  editButton: {
    padding: 5,
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 50 },
  emptyStateText: { fontSize: 16, color: '#888', textAlign: 'center' },
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