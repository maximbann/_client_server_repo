// Home.tsx

import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
  ImageBackground,
  Linking,
} from "react-native";
import { UserCircle } from "lucide-react-native";
import { Link } from "expo-router";
import { useState } from "react";

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalSpent: "$678.90",
    totalSaved: "$405.90",
    services: "3",
    tasks: "25",
  });

  const handleChange = (key: keyof typeof stats, value: string) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const services = [
    {
      name: "Plumb Works Inc.",
      image: "https://images.unsplash.com/photo-1581579185169-47a1f9c8d7f3", // Plumbing
      url: "https://www.plumbworksinc.com/",
    },
    {
      name: "TE Certified Electricians",
      image: "https://images.unsplash.com/photo-1581091870622-1d1cdad9ba9f", // Electrical
      url: "https://www.tecertifiedelectricians.com/",
    },
    {
      name: "Coolray Heating & Cooling",
      image: "https://images.unsplash.com/photo-1597471445254-6e8c1f90b6d7", // HVAC
      url: "https://www.coolray.com/",
    },
    {
      name: "Findlay Roofing",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be", // Roofing
      url: "https://www.findlayroofing.com/",
    },
    {
      name: "Gibbs Landscape Company",
      image: "https://images.unsplash.com/photo-1597004071214-d914b8e9c1b3", // Landscaping
      url: "https://gibbslandscape.com/",
    },
  ];
  

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      }}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Homi</Text>
            <UserCircle size={64} color="#aaa" />
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              label="Total Spent"
              value={stats.totalSpent}
              editable={isEditing}
              onChange={(val) => handleChange("totalSpent", val)}
            />
            <StatCard
              label="Total Saved"
              value={stats.totalSaved}
              editable={isEditing}
              onChange={(val) => handleChange("totalSaved", val)}
            />
            <StatCard
              label="Services Done"
              value={stats.services}
              editable={isEditing}
              onChange={(val) => handleChange("services", val)}
            />
            <StatCard
              label="Completed Tasks"
              value={stats.tasks}
              editable={isEditing}
              onChange={(val) => handleChange("tasks", val)}
            />
          </View>

          {/* Edit Button */}
          <View style={styles.editButtonWrapper}>
            <Pressable
              onPress={() => setIsEditing((prev) => !prev)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? "Done" : "Edit"}
              </Text>
            </Pressable>
          </View>

          {/* Featured Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Services Nearby</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {services.map((service, index) => (
                <Pressable
                  key={index}
                  style={styles.featuredCard}
                  onPress={() => Linking.openURL(service.url)}
                >
                  <Image
                    source={{ uri: service.image }}
                    style={styles.featuredImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.dealCaption}>{service.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Inventory Button */}
          <Link href="/Inventory" asChild>
            <Pressable style={styles.inventoryButton}>
              <Text style={styles.inventoryButtonText}>Manage Inventory</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

function StatCard({
  label,
  value,
  editable = false,
  onChange,
}: {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (val: string) => void;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChange}
          style={styles.statInput}
        />
      ) : (
        <Text style={styles.statValue}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    columnGap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statLabel: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  statInput: {
    fontSize: 18,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 2,
    color: "#111827",
  },
  editButtonWrapper: {
    alignItems: "flex-end",
    marginVertical: 20,
  },
  editButton: {
    backgroundColor: "rgba(229, 231, 235, 0.6)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  featuredCard: {
    width: 280,
    marginRight: 12,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    overflow: "hidden",
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  featuredImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dealCaption: {
    padding: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  inventoryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  inventoryButtonText: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
