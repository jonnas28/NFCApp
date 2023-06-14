import { Text } from "@rneui/themed"
import { useEffect, useState } from "react";
import {View} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const baseUrl = 'http://mdms.cypherph.com/';

const HomeScreen = () =>{
    const [nfcID,setNfcID]=useState('')
    const [memberInfo,setMemberInfo]=useState({address:'',email:''});
    useEffect(()=>{
        getMemberById();
    },[nfcID])
    const getMemberById = async()=>{
        const nfcID = await AsyncStorage.getItem('NFC_ID');
        setNfcID(nfcID!);
        const requestString = `${baseUrl}api/member/${nfcID}`
        await axios.get(requestString)
        .then((response)=>{
            setMemberInfo(response.data);
        })
    }
    return(
        <View>
            <Text>Welcome to NFC App {memberInfo.email}</Text>
        </View>
    )
}



export default HomeScreen