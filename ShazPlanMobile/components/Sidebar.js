import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

export default function Sidebar({ navigation, onClose }) {
  const slideAnim = useRef(new Animated.Value(-260)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false
    }).start();
  }, []);

  const menu = [
    "Dashboard",
    "Income",
    "Commitments",
    "Debt",
    "Savings",
    "Deposit",
    "Reports",
    "Settings",   // ← Settings is here
    "Tools"
  ];

  return (
    <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.title}>ShazPlan</Text>

      {menu.map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.item}
          onPress={() => {
            navigation.navigate(item);
            onClose();
          }}
        >
          <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "#0f172a",
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 200,
    borderRightWidth: 1,
    borderRightColor: "#1e293b"
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 300
  },
  closeText: {
    color: "#22c55e",
    fontSize: 32,
    fontWeight: "700"
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    marginBottom: 10
  },
  itemText: {
    color: "white",
    fontSize: 16
  }
});