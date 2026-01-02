import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator, Text, Image, Pressable } from 'react-native';
import "./globals.css";
export default function Home() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FB923C', '#F97316', '#EF4444']}
      className="flex-1 justify-center items-center px-6"
    >


      {/* Login Button */}
      <Pressable
        onPress={() => router.push("/(tabs)")}
        className="w-full bg-yellow-300 py-4 rounded-full shadow-lg"
      >
        <Text className="text-red-500 font-bold text-lg text-center">
          Home
        </Text>
      </Pressable>

    </LinearGradient>
  );
}
