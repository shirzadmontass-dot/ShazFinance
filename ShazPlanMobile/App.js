import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { useState } from "react";

import Dashboard from "./screens/Dashboard";
import Sidebar from "./components/Sidebar";
import { navigationRef } from "./components/navigationRef";
import { useStore } from "./store";

const Stack = createNativeStackNavigator();

export default function App() {
  const { store } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!store) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#020617",
        }}
      >
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={{ flex: 1 }}>
        {sidebarOpen && (
          <Sidebar
            navigation={navigationRef}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dashboard">
            {(props) => (
              <Dashboard
                {...props}
                store={store}
                openSidebar={() => setSidebarOpen(true)}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}