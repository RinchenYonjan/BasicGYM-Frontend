import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from "react-native";

export default function HeaderComp(){
    return (
        <View style={styles.container}>
            <View>
                <View style={{flexDirection:'row'}}>
            <Text style={styles.profileHeader}>Good Morning</Text>
             <MaterialCommunityIcons name="hand-wave" size={18} color="#F59E0B" />
             </View>
            <Text style={styles.profileName}>Raghav Singh</Text>
            <Text style={styles.profileHeader1}>Stay Strong, stay consistent!</Text>
            </View>
            <View>
                <Image style={styles.profilePicture} source={{
                    uri: 'https://img.magnific.com/free-photo/young-handsome-man-wearing-casual-tshirt-blue-background-happy-face-smiling-with-crossed-arms-looking-camera-positive-person_839833-12963.jpg?semt=ais_test_b&w=740&q=80'
                }}/>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container:{
        margin: 14,
        flexDirection:"row",
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    profileHeader:{
        color: "#000",
        textAlign: 'left',
        fontSize: 14,
        fontWeight: 'light'
    },
     profileHeader1:{
        color: "#000",
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 'light'
    },
    profileName:{
        color: '#000',
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    profilePicture:{
        width: 50,
        height: 50,
         borderRadius: 40,
    }
    
});