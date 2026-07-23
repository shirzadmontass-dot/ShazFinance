import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

import Dashboard from "./screens/Dashboard";
import { useStore } from "./store";

const Stack = createNativeStackNavigator();

export default function App() {
  const { store } = useStore();

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard">
          {(props) => <Dashboard {...props} store={store} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}