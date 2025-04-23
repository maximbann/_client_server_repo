// app/_layout.tsx
import "./globals.css";
import { useState, useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/Login");
  }, []);
  return <Slot />;
}
