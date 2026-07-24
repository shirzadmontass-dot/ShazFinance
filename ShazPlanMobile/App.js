import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, ActivityIndicator } from "react-native";

import Dashboard from "./screens/Dashboard";
import { useStore } from "./store";

const Drawer = createDrawerNavigator();

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
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#0f172a",
          },
          drawerActiveTintColor: "#22c55e",
          drawerInactiveTintColor: "#fff",
        }}
      >
        <Drawer.Screen name="Dashboard">
          {(props) => <Dashboard {...props} store={store} />}
        </Drawer.Screen>

        {/* Add more screens here later */}
        {/* <Drawer.Screen name="Income" component={IncomeScreen} /> */}
        {/* <Drawer.Screen name="Commitments" component={CommitmentsScreen} /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}