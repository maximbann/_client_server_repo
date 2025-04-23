import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

interface InventoryItem {
  id: number;
  name: string;
  image: string;
  room: string;
}

export default function InventoryScreen() {
  const router = useRouter();

  const [roomFilters, setRoomFilters] = useState<string[]>([
    "Living Room",
    "Kitchen",
    "Garage",
    "Bathroom",
    "Bedroom",
  ]);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("Living Room");
  const [isEditingRooms, setIsEditingRooms] = useState<boolean>(false);
  const [isEditingItems, setIsEditingItems] = useState<boolean>(false);

  const handleAddRoom = () => {
    Alert.prompt("Add Room", "Enter new room name:", (roomName) => {
      if (roomName && !roomFilters.includes(roomName)) {
        setRoomFilters((prev) => [...prev, roomName]);
        setSelectedRoom(roomName);
      }
    });
  };

  const handleRenameRoom = (index: number) => {
    Alert.prompt("Rename Room", "Enter new room name:", (newName) => {
      if (newName && newName.trim() !== "") {
        setRoomFilters((prev) => {
          const updated = [...prev];
          updated[index] = newName;
          return updated;
        });
      }
    });
  };

  const handleDeleteRoom = (index: number) => {
    const roomName = roomFilters[index];
    Alert.alert("Delete Room", `Are you sure you want to delete "${roomName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setRoomFilters((prev) => prev.filter((_, i) => i !== index));
          if (selectedRoom === roomName) {
            setSelectedRoom(roomFilters[0] || "");
          }
        },
      },
    ]);
  };

  const handleRenameItem = (id: number) => {
    Alert.prompt("Rename Item", "Enter new item name:", (newName) => {
      if (newName && newName.trim() !== "") {
        setInventoryItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, name: newName } : item
          )
        );
      }
    });
  };

  const handleDeleteItem = (id: number) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setInventoryItems((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  const openImagePicker = async (callback: (uri: string) => void) => {
    Alert.alert("Select Image", "Choose an option", [
      {
        text: "Take Photo",
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) return;
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
          });
          if (!result.canceled && result.assets?.length > 0) {
            callback(result.assets[0].uri);
          }
        },
      },
      {
        text: "Choose from Gallery",
        onPress: async () => {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) return;
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
          });
          if (!result.canceled && result.assets?.length > 0) {
            callback(result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleAddItem = () => {
    Alert.prompt("Add Item", "Enter item name:", (itemName) => {
      if (itemName && itemName.trim() !== "") {
        openImagePicker((imageUri) => {
          const newItem: InventoryItem = {
            id: Date.now(),
            name: itemName,
            image: imageUri,
            room: selectedRoom,
          };
          setInventoryItems((prev) => [...prev, newItem]);
        });
      }
    });
  };

  const handleRetakePhoto = (id: number) => {
    openImagePicker((newUri) => {
      setInventoryItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, image: newUri } : item))
      );
    });
  };

  const filteredItems = inventoryItems.filter(
    (item) => item.room === selectedRoom
  );

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-14">
      <View className="mb-4 flex-row items-center justify-center relative">
        <Pressable
          onPress={() => router.back()}
          style={{ position: "absolute", left: 0 }}
        >
          <Text className="text-sm text-indigo-600">← Back</Text>
        </Pressable>
        <Text className="text-xl font-bold text-gray-800 text-center">Inventory</Text>
      </View>


      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row items-center space-x-2">
          {roomFilters.map((room, index) => (
            <View
              key={`${room}-${index}`}
              className={`relative px-4 py-2 rounded-full flex-row items-center ${
                selectedRoom === room ? "bg-black" : "bg-gray-200"
              }`}
            >
              {isEditingRooms ? (
                <Pressable onPress={() => handleRenameRoom(index)}>
                  <Text
                    className={`text-sm underline ${
                      selectedRoom === room ? "text-white" : "text-black"
                    }`}
                  >
                    {room}
                  </Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => setSelectedRoom(room)}>
                  <Text
                    className={`text-sm ${
                      selectedRoom === room ? "text-white" : "text-black"
                    }`}
                  >
                    {room}
                  </Text>
                </Pressable>
              )}
              {isEditingRooms && (
                <Pressable onPress={() => handleDeleteRoom(index)} className="ml-2">
                  <Text
                    className={`text-sm font-bold ${
                      selectedRoom === room ? "text-white" : "text-black"
                    }`}
                  >
                    ×
                  </Text>
                </Pressable>
              )}
            </View>
          ))}

          <View className="flex-row items-center space-x-2 ml-4">
            <Pressable
              onPress={() => setIsEditingRooms(!isEditingRooms)}
              className={`px-4 py-2 rounded-full ${
                isEditingRooms ? "bg-black" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-sm ${
                  isEditingRooms ? "text-white" : "text-black"
                }`}
              >
                {isEditingRooms ? "Done" : "Edit"}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleAddRoom}
              className="w-9 h-9 rounded-full items-center justify-center bg-gray-200"
            >
              <Text className="text-xl text-black font-medium">+</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View className="space-y-4 mb-4">
        {filteredItems.length === 0 ? (
          <Text className="text-gray-400 text-center mt-10">
            There are currently no items in {selectedRoom}
          </Text>
        ) : (
          filteredItems.map((item) => {
            const ItemContent = (
              <View
                key={item.id}
                className="rounded-lg overflow-hidden border border-gray-200 relative"
              >
                <Pressable
                  onPress={() => isEditingItems && handleRetakePhoto(item.id)}
                  className="w-full h-48"
                >
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                  {isEditingItems && (
                    <View className="absolute top-0 left-0 w-full h-full bg-black/30 items-center justify-center">
                      <Text className="text-white text-sm font-bold">Tap to Edit</Text>
                    </View>
                  )}
                </Pressable>
                <View className="p-3 bg-gray-100">
                  {isEditingItems ? (
                    <Pressable onPress={() => handleRenameItem(item.id)}>
                      <Text className="text-base font-medium underline">
                        {item.name}
                      </Text>
                    </Pressable>
                  ) : (
                    <Text className="text-base font-medium">{item.name}</Text>
                  )}
                </View>
                {isEditingItems && (
                  <Pressable
                    onPress={() => handleDeleteItem(item.id)}
                    className="absolute top-2 right-2 bg-white/80 rounded-full px-2"
                  >
                    <Text className="text-black text-sm font-bold">×</Text>
                  </Pressable>
                )}
              </View>
            );

            return isEditingItems ? (
              ItemContent
            ) : (
              <Link
                key={item.id}
                href={{
                  pathname: "/Item/[id]",
                  params: {
                    id: item.id.toString(),
                    name: item.name,
                  },
                }}
                asChild
              >
                <Pressable>{ItemContent}</Pressable>
              </Link>
            );
          })
        )}
      </View>

      <View className="flex-row justify-start gap-3 mb-10 mt-4">
        <Pressable
          onPress={() => setIsEditingItems(!isEditingItems)}
          className={`w-32 py-2 rounded-md items-center ${
            isEditingItems ? "bg-black" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-sm ${
              isEditingItems ? "text-white" : "text-black"
            }`}
          >
            {isEditingItems ? "Done" : "Manage"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleAddItem}
          className="w-32 py-2 rounded-md items-center bg-gray-200"
        >
          <Text className="text-sm text-black">Add Item</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
