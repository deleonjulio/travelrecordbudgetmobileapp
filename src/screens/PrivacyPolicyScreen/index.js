import React from 'react';
import {PRIVACY_POLICY_URL} from '../../config';
import {WebView} from 'react-native-webview';

export const PrivacyPolicyScreen = () => {
  return <WebView source={{uri: PRIVACY_POLICY_URL}} style={{flex: 1}} />;
};
