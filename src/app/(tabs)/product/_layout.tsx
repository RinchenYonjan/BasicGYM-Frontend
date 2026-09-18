import { Stack } from "expo-router";

export default function ProductStackLayout() {

  return (
    <Stack screenOptions={{ 
      headerShown: false, 
      contentStyle: {backgroundColor: "#f1f1f1"}
    }}/>
  )

}