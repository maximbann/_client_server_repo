import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActionSheetIOS,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

type ManualImage = { uri: string; label: string };

export default function ItemDetails() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();

  const [item, setItem] = useState({
    id,
    name: typeof name === "string" ? name : "Unnamed Item",
    manualImages: [] as ManualImage[],
    notes: "",
  });

  const [editingNotes, setEditingNotes] = useState(false);
  const [isEditingManuals, setIsEditingManuals] = useState(false);
  const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(null);
  const [labelText, setLabelText] = useState("");
  const [notesText, setNotesText] = useState(item.notes);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const handleUploadManual = async () => {
    const options = ["Take Photo", "Choose from Gallery", "Cancel"];
    const cancelButtonIndex = 2;

    const handleSelect = async (type: "camera" | "gallery") => {
      const permission = type === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission Required", `${type === "camera" ? "Camera" : "Gallery"} access is needed.`);
        return;
      }

      const result =
        type === "camera"
          ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 })
          : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });

      if (!result.canceled && result.assets?.length > 0) {
        const newImage: ManualImage = {
          uri: result.assets[0].uri,
          label: "Untitled",
        };
        setItem((prev) => ({
          ...prev,
          manualImages: [...prev.manualImages, newImage],
        }));
      }
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex },
        (buttonIndex) => {
          if (buttonIndex === 0) handleSelect("camera");
          else if (buttonIndex === 1) handleSelect("gallery");
        }
      );
    } else {
      Alert.alert("Upload Manual", "Choose an option:", [
        { text: "Take Photo", onPress: () => handleSelect("camera") },
        { text: "Choose from Gallery", onPress: () => handleSelect("gallery") },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleEditManualImage = (index: number) => {
    const options = ["Edit Label", "Replace Image", "Delete Image", "Cancel"];
    const cancelButtonIndex = 3;

    const handleEditLabel = () => {
      setLabelText(item.manualImages[index].label);
      setEditingLabelIndex(index);
    };

    const handleReplace = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setItem((prev) => {
          const updated = [...prev.manualImages];
          updated[index].uri = result.assets[0].uri;
          return { ...prev, manualImages: updated };
        });
      }
    };

    const handleDelete = () => {
      setItem((prev) => {
        const updated = prev.manualImages.filter((_, i) => i !== index);
        return { ...prev, manualImages: updated };
      });
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex },
        (buttonIndex) => {
          if (buttonIndex === 0) handleEditLabel();
          else if (buttonIndex === 1) handleReplace();
          else if (buttonIndex === 2) handleDelete();
        }
      );
    } else {
      Alert.alert("Edit Manual Image", "Choose an action:", [
        { text: "Edit Label", onPress: handleEditLabel },
        { text: "Replace Image", onPress: handleReplace },
        { text: "Delete Image", onPress: handleDelete },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleSaveLabel = () => {
    if (editingLabelIndex !== null) {
      setItem((prev) => {
        const updated = [...prev.manualImages];
        updated[editingLabelIndex].label = labelText.trim() || "Untitled";
        return { ...prev, manualImages: updated };
      });
      setEditingLabelIndex(null);
      setLabelText("");
    }
  };

  const handleSaveNotes = () => {
    setItem((prev) => ({
      ...prev,
      notes: notesText,
    }));
    setEditingNotes(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <Pressable onPress={() => router.back()} className="absolute top-14 left-4 z-10">
        <Text className="text-blue-600 text-sm">← Back</Text>
      </Pressable>

      <ScrollView className="flex-1 px-4 pt-14">
        <View className="mb-4">
          <Text className="text-xl font-bold text-gray-800 text-center">{item.name}</Text>
        </View>



        <View className="space-y-4 mb-6">
          {item.manualImages.length === 0 ? (
            <Image
              source={{ uri: "https://via.placeholder.com/300x150?text=No+Manuals" }}
              className="w-full h-40 rounded-md"
              resizeMode="contain"
            />
          ) : (
            item.manualImages.map((img, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  if (isEditingManuals) {
                    handleEditManualImage(index);
                  } else {
                    setSelectedImageUri(img.uri);
                    setFullscreenVisible(true);
                  }
                }}
                className="relative"
              >
                <Image
                  source={{ uri: img.uri }}
                  className="w-full h-40 rounded-md"
                  resizeMode="cover"
                />
                <View className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded">
                  <Text className="text-white text-xs font-medium">
                    {img.label}
                  </Text>
                </View>
                {isEditingManuals && (
                  <View className="absolute top-0 left-0 w-full h-full bg-black/30 items-center justify-center">
                    <Text className="text-white font-semibold">Tap to Edit</Text>
                  </View>
                )}
              </Pressable>
            ))
          )}
        </View>

        <View className="flex-row gap-4 mb-6 px-4">
          <Pressable
            onPress={handleUploadManual}
            className="bg-gray-800 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-medium">Upload</Text>
          </Pressable>

          <Pressable
            onPress={() => setIsEditingManuals((prev) => !prev)}
            className="bg-gray-500 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-medium">
              {isEditingManuals ? "Done" : "Edit"}
            </Text>
          </Pressable>
        </View>

        <View className="space-y-2 mb-10">
          <Text className="text-lg font-semibold">Notes</Text>
          <Pressable onPress={() => setEditingNotes(true)}>
            <Text className="text-gray-700">
              {item.notes ? item.notes : "Tap to Edit Notes"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={editingLabelIndex !== null} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/30 px-6">
          <View className="bg-white p-4 rounded-xl w-full space-y-4">
            <TextInput
              value={labelText}
              onChangeText={setLabelText}
              className="border border-gray-300 p-3 rounded-md text-gray-800"
              placeholder="Type here"
              placeholderTextColor="#666"
              autoFocus
            />
            <View className="flex-row justify-end gap-6">
              <Pressable
                onPress={() => {
                  setEditingLabelIndex(null);
                  setLabelText("");
                }}
              >
                <Text className="text-gray-500">Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSaveLabel}>
                <Text className="text-blue-600 font-semibold">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={editingNotes} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/30 px-6">
          <View className="bg-white p-4 rounded-xl w-full space-y-4">
            <TextInput
              value={notesText}
              onChangeText={setNotesText}
              multiline
              className="border border-gray-700 rounded-md p-3 text-gray-700"
              placeholder="Type your notes here..."
              placeholderTextColor="#4B5563"
            />
            <View className="flex-row justify-end gap-6">
              <Pressable onPress={() => setEditingNotes(false)}>
                <Text className="text-gray-500">Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSaveNotes}>
                <Text className="text-blue-600 font-semibold">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={fullscreenVisible} animationType="fade" transparent>
        <Pressable
          onPress={() => setFullscreenVisible(false)}
          className="flex-1 bg-black items-center justify-center"
        >
          {selectedImageUri && (
            <Image
              source={{ uri: selectedImageUri }}
              resizeMode="contain"
              className="w-full h-full"
            />
          )}
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
