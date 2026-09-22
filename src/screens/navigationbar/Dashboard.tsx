import BodySection from "@/components/dashboard/BodySection";
import PaymentDueCard from "@/components/dashboard/PaymentDueCard";
import RecentPayment from "@/components/dashboard/RecentPayment";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, View } from "react-native";
import { getUserProfile } from '../../services/profile.service';


export default function DashboardScreen() {

    const [username, setUsername] = useState('');

    const fetchProfile = async () => {

        try {
            const response = await getUserProfile();

            console.log("Header user:", response);

            const data = response?.data;

            if (data) {
                setUsername(data.username ?? '');
            }

        } catch (error: any) {

            console.log("Header profile error:",error?.response?.data || error?.message || error);

        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

return (
    <View style={styles.container}>

        <View style={styles.subContainer}>
            <View>
                <Text style={styles.profileName}>
                    {username || "User"}
                </Text>

                <Text style={styles.profileHeader1}>
                    Stay Strong, stay consistent!
                </Text>
            </View>

            <View>
                <Image
                    style={styles.profilePicture}
                    source={{
                        uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            username || "User"
                        )}&background=DDDDDD&color=555555&size=256`,
                    }}/>
            </View>
        </View>
        <SummaryCard/>
        <PaymentDueCard/>
        <BodySection/>
        <RecentPayment/>
    </View>
)}

const styles = StyleSheet.create({

    container: {
        flex:1, 
    },

    subContainer: {
        margin: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    profileHeader: {
        color: "#000",
        fontSize: 14,
        fontWeight: "400",
        marginRight: 5,
    },

    profileHeader1: {
        color: "#000",
        fontSize: 16,
        fontWeight: "400",
    },

    profileName: {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
    },

    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 40,
    },

});