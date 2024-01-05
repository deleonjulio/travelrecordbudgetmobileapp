import { View, StyleSheet } from "react-native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, moderateScale, verticalScale } from "react-native-size-matters";

export const IconCard = ({icon, isDarkMode = false, iconColor = 'black', backgroundColor = 'lightgray'}) => {
  return (
    <View style={styles.card({backgroundColor})}>
      <Icon name={icon ? icon: 'progress-question'} size={moderateScale(22)} color={iconColor ? iconColor : 'black'} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: ({backgroundColor}) => ({
    backgroundColor: 'white',
    // padding: moderateScale(14), 
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(999),
    borderWidth: moderateScale(0.5),
    borderColor: 'lightgray',
    // elevation: moderateScale(2)
  }),
});
