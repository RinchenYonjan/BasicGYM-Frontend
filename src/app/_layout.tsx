import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function baseLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />

      <Toast />
    </>
  );
}