import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { getUserProfile } from '../../services/ProfileService';

export default function HeaderComp() {

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

            console.log(
                "Header profile error:",
                error?.response?.data || error?.message || error
            );

        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    return (
        <View style={styles.container}>

            <View>

                <View style={styles.greetingRow}>

                    <Text style={styles.profileHeader}>
                        Good Morning
                    </Text>

                    <MaterialCommunityIcons
                        name="hand-wave"
                        size={18}
                        color="#F59E0B"
                    />

                </View>

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
                    }}
                />

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        margin: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    greetingRow: {
        flexDirection: "row",
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