
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Bot, Send } from "lucide-react-native";

type Message = {
  sender: "user" | "ai";
  text: string;
};

const OPENAI_API_KEY = "cant see this";


export default function Search() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage: Message = { sender: "user", text: query.trim() };
    setConversation((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant for home maintenance questions." },
            ...conversation.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            { role: "user", content: query },
          ],
        }),
      });

      const data = await response.json();
      if (!data.choices || !data.choices.length) {
        throw new Error(JSON.stringify(data));
      }

      const reply = data.choices[0].message.content;
      const aiMessage: Message = { sender: "ai", text: reply };
      setConversation((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI fetch error:", err);
      Alert.alert("Error", "Failed to fetch AI response. Please try again.");
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Bot size={24} color="#4B5563" />
          <Text style={styles.headerText}>Search</Text>
        </View>

        {/* Conversation */}
        <ScrollView style={styles.chatBox}>
          {conversation.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.sender === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
          {loading && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <ActivityIndicator color="#4F46E5" />
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Ask how to fix something..."
            placeholderTextColor="#9CA3AF"
            editable={!loading}
          />
          <Pressable
            style={styles.sendButton}
            onPress={handleSend}
            disabled={loading}
          >
            <Send size={20} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 40,
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  chatBox: {
    flex: 1,
    marginBottom: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#D1D5DB",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#E0E7FF",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#111827",
    fontSize: 14,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingRight: 8,
    color: "#111827",
  },
  sendButton: {
    backgroundColor: "#4F46E5",
    padding: 8,
    borderRadius: 999,
  },
});
