import AsyncStorage from '@react-native-async-storage/async-storage';


export const getToken = async()=>{

    const t = await AsyncStorage.getItem("token");
    return t;

}


export const setToken = async(value:string)=>{

    const t = await AsyncStorage.setItem("token",value);
    return t;

}