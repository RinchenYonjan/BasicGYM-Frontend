import { CartProvider } from "@/context/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient()
const BG_Color = "#fff";

export default function RootLayout() {

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex:1, backgroundColor: BG_Color }} edges={['top']}>
            <Stack 
              screenOptions={{
                headerShown: false,
                contentStyle: {backgroundColor: BG_Color},
              }}
            />
            <Toast />
          </SafeAreaView>
        </SafeAreaProvider>
      </CartProvider>
    </QueryClientProvider>
  );

}