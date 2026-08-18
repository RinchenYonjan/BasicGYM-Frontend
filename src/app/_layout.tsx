import { Stack } from "expo-router";

export default function baseLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#fff' },
        headerShown: false
      }}
    />
  );
}