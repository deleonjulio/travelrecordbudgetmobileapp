import {useState} from 'react';
import {Text, View, StyleSheet, Pressable, Appearance} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../config';
import { RealmContext } from '../../realm/RealmWrapper';
import { Theme } from '../../realm/Schema';
import { useGetTheme } from '../../hooks/useGetTheme';
import { useTheme, useThemeDispatch } from '../../context';
import { useIsDarkMode } from '../../hooks/useIsDarkMode';

const options = [
  {
    key: 1,
    title: 'Device Settings',
    value: 'device settings',
    description: "Use your devices's default mode",
  },
  {
    key: 2,
    title: 'Light',
    value: 'light',
    description: 'Always use light mode',
  },
  {
    key: 3,
    title: 'Dark',
    value: 'dark',
    description: 'Always use dark mode',
  },
];

export const AppearanceScreen = () => {
  const contextTheme = useTheme()
  const dispatch = useThemeDispatch()

  const { useRealm, useObject } = RealmContext
  const realm = useRealm()
  const { themeFromRealm } = useGetTheme()
  const isDarkMode = useIsDarkMode(contextTheme);
  const themeUpdate = useObject(Theme, themeFromRealm?._id);

  const [appearance, setAppearance] = useState(themeFromRealm.theme);

  const changeAppearance = async (value) => {
    if(themeFromRealm) {
      if (themeUpdate) {
        realm.write(() => {
          themeUpdate.theme = value
        });
      }
    } 

    setAppearance(value);
    if (value === 'dark' || value === 'light') {
      dispatch({
        type: 'change',
        theme: value
      }); 
    } else {
      dispatch({
        type: 'change',
        theme:  Appearance.getColorScheme(),
      }); 
    }
  };

  return (
    <View style={styles.container({isDarkMode})}>
      {options.map(
        (option) => (
          <Pressable
            key={option.key}
            style={
              appearance === option.value
                ? styles.optionContainerSelected({isDarkMode})
                : styles.optionContainer({isDarkMode})
            }
            onPress={() => changeAppearance(option.value)}>
            <View style={styles.flexDirectionRow}>
              <View style={styles.flex09}>
                <Text style={appearance === option.value ? styles.optionTitleBoldSelected({isDarkMode}) : styles.optionTitleBold({isDarkMode})}>{option.title}</Text>
                <Text style={appearance === option.value ? styles.optionTitleSelected({isDarkMode}) : styles.optionTitle({isDarkMode})}>{option.description}</Text>
              </View>
              <View
                style={[
                  styles.flex01,
                  styles.alignItemsFlexEnd,
                  styles.justifyContentCenter,
                ]}>
                {appearance === option.value && (
                  <Icon
                    name="check"
                    size={scale(24)}
                    color={
                      isDarkMode ? colors.textPrimaryDark : colors.textPrimary
                    }
                  />
                )}
              </View>
            </View>
          </Pressable>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: ({isDarkMode = false}) => ({
    height: '100%', 
    backgroundColor: isDarkMode ? 'black' : 'white'
  }),
  headerContainer: {padding: scale(16)},
  headerTitle: {fontSize: verticalScale(24), fontWeight: 'bold'},
  flex01: {flex: 0.1},
  flex09: {flex: 0.9},
  flexDirectionRow: {flexDirection: 'row'},
  optionContainer: ({isDarkMode = false}) => ({
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(16),
    marginHorizontal: scale(8),
    color: isDarkMode ? 'white' : 'black',
  }),
  optionContainerSelected: ({isDarkMode = false}) => ({
    backgroundColor: isDarkMode ? colors.backgroundSecondaryDark : 'black',
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(16),
    marginHorizontal: scale(8),
    color: isDarkMode ? colors.textPrimaryDark : colors.textPrimary,
  }),
  optionTitleBold: ({isDarkMode = false}) => ({
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: isDarkMode ? 'white' : 'black',
  }),
  optionTitleBoldSelected: ({isDarkMode = false}) => ({
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: 'white',
  }),
  optionTitle: ({isDarkMode = false}) => ({
    fontSize: moderateScale(16),
    color: isDarkMode ? 'white' : 'black',
  }),
  optionTitleSelected: ({isDarkMode = false}) => ({
    fontSize: moderateScale(16),
    color: 'white',
  }),
  alignItemsFlexEnd: {alignItems: 'flex-end'},
  justifyContentCenter: {justifyContent: 'center'},
});