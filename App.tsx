/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import NfcManager, { Ndef, NfcEvents, NfcTech } from 'react-native-nfc-manager';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './AppNavigator';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [hasNfc, setHasNFC ] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported()
      setHasNFC(deviceIsSupported)
      if (deviceIsSupported) {
        console.log("started")
        await NfcManager.start()
      }
    }

    checkIsSupported()

    NfcManager.setEventListener(NfcEvents.DiscoverTag, () => {
      console.log('tag found')
    })

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }
  }, [])


  const readTag = async () => {
    await NfcManager.registerTagEvent();
  }

  const writeNFC = async() => {
    let result = false;

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([Ndef.uriRecord('https://blog.logrocket.com/')]);

      if (bytes) {
        await NfcManager.ndefHandler
          .writeNdefMessage(bytes);
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  }

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
      console.log("found")
    } catch (ex) {
      console.warn('Oops!', ex);
      console.log("d")
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  if (!hasNfc) {
    return (
      <View style={styles.sectionContainer}>
        <Text>NFC not supported</Text>
      </View>
    )
  }

  return (
    // <SafeAreaView style={styles.sectionContainer}>
    //   <Text>Hello world</Text>
    //   <TouchableOpacity onPress={readTag}>
    //     <Text >Scan Tag</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={writeNFC}>
    //     <Text >Write Tag</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={readNdef}>
    //     <Text>Scan a Tag</Text>
    //   </TouchableOpacity>
    // </SafeAreaView>
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer>
  );
  
  // return (
  //   <SafeAreaView style={backgroundStyle}>
  //     <StatusBar
  //       barStyle={isDarkMode ? 'light-content' : 'dark-content'}
  //       backgroundColor={backgroundStyle.backgroundColor}
  //     />
  //     <ScrollView
  //       contentInsetAdjustmentBehavior="automatic"
  //       style={backgroundStyle}>
  //       <Header />
  //       <View
  //         style={{
  //           backgroundColor: isDarkMode ? Colors.black : Colors.white,
  //         }}>
  //         <Section title="Step One">
  //           Edit <Text style={styles.highlight}>App.tsx</Text> to change this
  //           screen and then come back to see your edits.
  //         </Section>
  //         <Section title="See Your Changes">
  //           <ReloadInstructions />
  //         </Section>
  //         <Section title="Debug">
  //           <DebugInstructions />
  //         </Section>
  //         <Section title="Learn More">
  //           Read the docs to discover what to do next:
  //         </Section>
  //         <LearnMoreLinks />
  //       </View>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
