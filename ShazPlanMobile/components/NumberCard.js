import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NumberCard({
  title,
  value,
  color = "#22c55e",
}) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>
        £
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 6,
  },

  title: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
  },

  value: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
});