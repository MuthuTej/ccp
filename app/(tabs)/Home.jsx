import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, SafeAreaView, StatusBar, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [isSimulatingAccident, setIsSimulatingAccident] = useState(false);
  const [speed, setSpeed] = useState(48);
  const [impact, setImpact] = useState(0.2);
  const [coordinates, setCoordinates] = useState({ lat: 13.0827, lng: 80.2707 });
  const [showFirstAidModal, setShowFirstAidModal] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for map marker
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Mock sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSimulatingAccident) {
        setSpeed(Math.floor(40 + Math.random() * 20));
        setImpact(parseFloat((0.1 + Math.random() * 0.3).toFixed(1)));
        setCoordinates(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001,
        }));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isSimulatingAccident]);

  const handleSOSConfirm = () => {
    setShowSOSModal(false);
    setSosSent(true);
    setTimeout(() => setSosSent(false), 4000);
  };

  const toggleAccidentSimulation = () => {
    if (!isSimulatingAccident) {
      setIsSimulatingAccident(true);
      setSpeed(0);
      setImpact(8.5); // High impact
      setShowSOSModal(true); // Auto-trigger SOS dialog
    } else {
      setIsSimulatingAccident(false);
      setSpeed(48);
      setImpact(0.2);
    }
  };

  const getImpactColor = (val) => {
    if (val < 1) return "#10b981"; // Safe
    if (val < 4) return "#f59e0b"; // Warning
    return "#ef4444"; // Dangerous
  };

  const firstAidSteps = [
    { title: "Safety First", text: "Ensure your own safety before helping others.", icon: "shield" },
    { title: "Stay Calm", text: "Call 108 or 112 immediately for medical help.", icon: "call" },
    { title: "Assess Scene", text: "Check for fire, fuel leaks, or traffic hazards.", icon: "search" },
    { title: "Control Bleeding", text: "Apply firm pressure to wounds with clean cloth.", icon: "bandage" },
    { title: "Do Not Move", text: "Avoid moving victims unless there is immediate danger.", icon: "hand-left" },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-3xl font-bold text-gray-900">Dashboard</Text>
              <Text className="text-gray-500">IoT Safety Portal</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowFirstAidModal(true)}
              className="bg-red-50 p-2 rounded-full border border-red-100"
            >
              <Ionicons name="medical" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* Vehicle Status Card */}
          <View className={`rounded-3xl p-6 shadow-sm border ${isSimulatingAccident ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="bg-white p-3 rounded-2xl mr-4 shadow-sm">
                  <Ionicons name="car-outline" size={28} color={isSimulatingAccident ? "#ef4444" : "#374151"} />
                </View>
                <View>
                  <Text className="text-xl font-bold text-gray-800">
                    {isSimulatingAccident ? "Collision Detected!" : "Vehicle Status"}
                  </Text>
                  <View className="flex-row items-center">
                    <View className={`w-2 h-2 rounded-full mr-2 ${isSimulatingAccident ? 'bg-red-500' : 'bg-green-500'}`} />
                    <Text className={`font-semibold uppercase text-xs tracking-wider ${isSimulatingAccident ? 'text-red-600' : 'text-green-600'}`}>
                      {isSimulatingAccident ? "Emergency Protocol Active" : "System Active"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="h-px bg-gray-200 w-full mb-6" />

            <View className="flex-row justify-between mb-6">
              <View className="items-center flex-1">
                <Text className="text-gray-400 text-xs uppercase font-bold mb-1">Live Speed</Text>
                <Text className="text-2xl font-black text-gray-800">{speed}<Text className="text-sm font-medium"> km/h</Text></Text>
              </View>
              <View className="w-px bg-gray-200 h-10" />
              <View className="items-center flex-1">
                <Text className="text-gray-400 text-xs uppercase font-bold mb-1">Impact Force</Text>
                <Text className={`text-2xl font-black ${impact > 5 ? 'text-red-600' : 'text-gray-800'}`}>{impact}<Text className="text-sm font-medium"> G</Text></Text>
              </View>
            </View>

            {/* Impact Bar Indicator */}
            <View className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((impact / 10) * 100, 100)}%`,
                  backgroundColor: getImpactColor(impact)
                }}
              />
            </View>

            <TouchableOpacity
              onPress={toggleAccidentSimulation}
              className={`rounded-2xl p-4 flex-row items-center justify-center border ${isSimulatingAccident ? 'bg-white border-red-200' : 'bg-white border-gray-100'}`}
            >
              <Ionicons name={isSimulatingAccident ? "refresh-circle" : "shield-half"} size={20} color={isSimulatingAccident ? "#ef4444" : "#10b981"} />
              <Text className={`ml-2 font-medium ${isSimulatingAccident ? 'text-red-700' : 'text-gray-700'}`}>
                {isSimulatingAccident ? "Reset Normal State" : "Simulate Accident"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Live Location Section */}
          <View className="mt-8">
            <Text className="text-lg font-bold text-gray-800 mb-4">Live Location Tracking</Text>
            <View className="rounded-3xl bg-gray-100 h-48 w-full overflow-hidden border border-gray-200 relative justify-center items-center">
              {/* Fake Map Grid */}
              <View className="absolute inset-0 opacity-10">
                {[...Array(10)].map((_, i) => (
                  <View key={i} className="flex-row h-10">
                    {[...Array(10)].map((_, j) => (
                      <View key={j} className="w-10 border border-gray-400" />
                    ))}
                  </View>
                ))}
              </View>

              <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center">
                <View className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
              </Animated.View>

              <View className="absolute bottom-3 left-3 bg-white/90 px-3 py-2 rounded-xl backdrop-blur-md">
                <Text className="text-[10px] font-bold text-gray-400 uppercase">Current Marker</Text>
                <Text className="text-xs font-mono font-bold text-gray-800">{coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}</Text>
              </View>

              <View className="absolute top-3 right-3 bg-blue-600 px-2 py-1 rounded-lg">
                <Text className="text-[8px] font-black text-white uppercase italic">LIVE TRACKING</Text>
              </View>
            </View>
          </View>

          {/* SOS Section */}
          <View className="mt-10 pb-10">
            {sosSent && (
              <View className="bg-green-100 p-4 rounded-2xl mb-4 flex-row items-center border border-green-200">
                <Ionicons name="checkmark-circle" size={24} color="#059669" />
                <Text className="ml-3 text-green-800 font-bold">SOS ALERT SENT SUCCESSFULLY</Text>
              </View>
            )}

            <View className="items-center mb-6">
              <Text className="text-gray-400 font-medium">Automatic SOS enabled on severe impact</Text>
            </View>

            <TouchableOpacity
              className="rounded-3xl bg-red-600 py-6 shadow-2xl shadow-red-500/50 flex-row justify-center items-center"
              activeOpacity={0.9}
              onPress={() => setShowSOSModal(true)}
            >
              <Ionicons name="warning-outline" size={28} color="white" />
              <Text className="text-center text-white text-2xl font-black ml-3 tracking-widest">
                SOS EMERGENCY
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* First Aid Modal */}
      <Modal visible={showFirstAidModal} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] p-8 h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">First Aid Guide</Text>
              <TouchableOpacity onPress={() => setShowFirstAidModal(false)} className="bg-gray-100 p-2 rounded-full">
                <Ionicons name="close" size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {firstAidSteps.map((step, idx) => (
                <View key={idx} className="flex-row mb-6 items-start">
                  <View className="bg-red-50 p-4 rounded-2xl mr-4">
                    <Ionicons name={step.icon} size={24} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">{step.title}</Text>
                    <Text className="text-gray-500 leading-5">{step.text}</Text>
                  </View>
                </View>
              ))}
              <View className="h-20" />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* SOS Confirmation Modal */}
      <Modal visible={showSOSModal} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/60 justify-center p-6">
          <View className="bg-white rounded-3xl p-8 items-center border-4 border-red-500/20 shadow-2xl">
            <View className="bg-red-600 p-6 rounded-full mb-6 relative">
              <Ionicons name="alert-circle" size={50} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Trigger SOS?</Text>
            <Text className="text-gray-500 text-center mb-8 leading-6">
              This will send your current location and vehicle data to emergency services and your contacts.
            </Text>

            <View className="flex-row w-full space-x-4">
              <TouchableOpacity className="flex-1 py-4 rounded-2xl border border-gray-200" onPress={() => setShowSOSModal(false)}>
                <Text className="text-center text-gray-600 font-bold text-lg">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-4 rounded-2xl bg-red-600" onPress={handleSOSConfirm}>
                <Text className="text-center text-white font-bold text-lg">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


