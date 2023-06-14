import { Button, Dialog, Image, Input, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {View, StyleSheet} from 'react-native';
import { Text } from '@rneui/themed';
import NfcManager, { Ndef, NfcEvents, NfcTech } from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({navigation}:any) =>{
    const { theme } = useTheme();
    const baseUrl = 'http://mdms.cypherph.com/';

    const [isInvalidNFC,setIsInvalidNFC]=useState(false);

    useEffect(() => {
        startNfc();
        () => NfcManager.cancelTechnologyRequest(); // unmount the scanner on navigate away.
    },[navigation]);

    
    const startNfc = async () => {
        try {
            const supported = await NfcManager.isSupported();
            const nfcScanning = await NfcManager.isEnabled();
            if(!(supported && nfcScanning)){
                console.warn("NFC Not workings")
            }
            if (supported && nfcScanning) {
                console.warn("Started")
                await NfcManager.start();
                let tag: any;
                await NfcManager.requestTechnology(NfcTech.Ndef);
                tag = await NfcManager.getTag();
                
                if (tag) {
                    tag.ndefStatus = await NfcManager.ndefHandler.getNdefStatus();
                    const decodedData = Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
                await AsyncStorage.setItem('NFC_ID',decodedData.replace('https://www.en',''));
                await apiCall(decodedData.replace('https://www.en',''));
                }
                NfcManager.cancelTechnologyRequest(); // Have to reset nfc scanner.
                  };
        } catch (error) {
            NfcManager.cancelTechnologyRequest();
        }
    };

    const apiCall = async(nfcID:string)=>{
        const requestString = `${baseUrl}api/member/${nfcID}`
        await axios.get(requestString)
        .then((response)=>{
            navigation.navigate('Home');
        })
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/Logo.png')} containerStyle={styles.backgroundImage}></Image>
            <Text h1 style={{marginBottom:10}}>Sign In</Text>
            <Text style={{color:theme.colors.grey3,marginBottom:20}}>Hi there! Nice to see you again.</Text>
            <Input label="Email"></Input>
            <Input label="Password"></Input>
            <Button 
                onPress={() => {
                    navigation.navigate('Home');
                }
            }
                buttonStyle={styles.button}
            >Sign In</Button>
            <Text style={{color:theme.colors.grey3,textAlign:'center'}}>Or Tap Your ID to Login</Text>

            <Dialog
                isVisible={isInvalidNFC}
            >
                <Dialog.Title title="Login"/>
                <Text>Invalid NFC Card</Text>
            </Dialog>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        margin:30
    },
    button:{
        borderRadius:10
    },
    backgroundImage:{
        height:100,
        width:100
    }
})

export default LoginScreen;

