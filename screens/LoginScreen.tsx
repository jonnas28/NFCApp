import { Button, Image, Input, useTheme } from '@rneui/themed';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Text } from '@rneui/themed';
const LoginScreen = ({navigation}:any) =>{
    const { theme } = useTheme();
    return (
        <View style={styles.container}>
            <Image source={require('../assets/Logo.png')} containerStyle={styles.backgroundImage}></Image>
            <Text h1 style={{marginBottom:10}}>Sign In</Text>
            <Text style={{color:theme.colors.grey3,marginBottom:20}}>Hi there! Nice to see you again.</Text>
            <Input label="Email"></Input>
            <Input label="Password"></Input>
            <Button 
                onPress={() => navigation.navigate('Home')}
                buttonStyle={styles.button}
            >Sign In</Button>
            <Text style={{color:theme.colors.grey3,textAlign:'center'}}>Or Tap Your ID to Login</Text>
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

