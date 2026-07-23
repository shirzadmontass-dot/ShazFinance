import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ChartCard({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}