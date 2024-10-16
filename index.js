/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { WeConnectApp } from './src/WeConnectApp';
import './src/utils/gesture-handler';
AppRegistry.registerComponent(appName, () => WeConnectApp);
