import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "react-native";
export function LoadingScreen(){
    return(
        <SafeAreaView>
            <Text style={{ fontSize: 16, alignSelf: "center" }}>Loading...</Text>
        </SafeAreaView>
    )
}