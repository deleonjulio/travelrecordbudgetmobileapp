/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-get-random-values';

// I need to declare this or else the the app will crash (only on android)
new Intl.NumberFormat()

AppRegistry.registerComponent(appName, () => App);
