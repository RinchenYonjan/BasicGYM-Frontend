import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: {backgroundColor: "#f1f1f1"}
    }}/>
  );
  
}