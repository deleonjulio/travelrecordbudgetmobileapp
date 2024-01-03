// import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
// import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
// import { verticalScale, scale, moderateScale } from 'react-native-size-matters';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { RealmContext } from '../../realm/RealmWrapper';
// import { Biometric } from '../../realm/Schema';

// export const BiometricsScreen = ({navigation}) => {
  
//   const { useRealm, useObject, useQuery } = RealmContext
//   const realm = useRealm()

//   let biometricData = useQuery(Biometric)
//   biometricData = biometricData[0]
//   const updateBiometric = useObject(Biometric, biometricData._id);

//   const useBiometrics = async () => {
//     const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })
//     const { biometryType } = await rnBiometrics.isSensorAvailable()

//     if (biometryType === BiometryTypes.TouchID) {
//       const {success, error} = await rnBiometrics.simplePrompt({
//         promptMessage: 'Confirmation',
//       })
//       if (success) {
//         realm.write(() => {
//           updateBiometric.useBiometric = !biometricData.useBiometric
//           navigation.goBack();
//         });
//       }
//     }

//     if (biometryType === BiometryTypes.FaceID) {
//       const {success, error} = await rnBiometrics.simplePrompt({
//         promptMessage: 'Confirmation',
//       })
//       if (success) {
//         realm.write(() => {
//           updateBiometric.useBiometric = !biometricData.useBiometric
//           navigation.goBack();
//         });
//       }
//     }

//     if (biometryType === BiometryTypes.Biometrics) {
//       const {success} = await rnBiometrics.simplePrompt({
//         promptMessage: 'Confirmation',
//       })

//       if (success) {
//         realm.write(() => {
//           updateBiometric.useBiometric = !biometricData.useBiometric
//           navigation.goBack();
//         });
//       }
//     }
//   }
//   return (
//     <View style={styles.container}>
//       <View style={styles.topContainer}>
//         <Text style={styles.title}>Enable biometric access</Text>
//         <Text style={styles.description}>Access the app with fingerprint, face id or passcode.</Text>
//       </View>
//       <View style={styles.middleContainer}>
//         <Icon name="fingerprint" color="black" size={moderateScale(120)} />
//       </View>
//       <View style={styles.bottomContainer}>
//         <TouchableOpacity style={styles.button} onPress={useBiometrics}>
//           <Text style={styles.buttonText}>Enable</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingHorizontal:  scale(24)
//   },
//   topContainer: {
//     flex: 1,
//     justifyContent: 'center'
//   },  
//   middleContainer: {
//     flex: 5,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   bottomContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     paddingBottom: verticalScale(12)
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: moderateScale(24),
//     color: 'black'
//   },
//   description: {
//     fontWeight: '300',
//     fontSize: moderateScale(17),
//     color: 'black'
//   },
//   button: {
//     backgroundColor: 'black',
//     padding: moderateScale(12),
//     borderRadius: moderateScale(6),
//     alignItems: 'center'
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: moderateScale(16)
//   },
// });
