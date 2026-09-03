import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()


export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
    <SafeAreaProvider>
      <>
        <Stack screenOptions={{headerShown: false}}/>
        <Toast />
      </>
    </SafeAreaProvider>
    </QueryClientProvider>
  );
}