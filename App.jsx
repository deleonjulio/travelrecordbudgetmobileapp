import * as React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {RealmWrapper} from './src/realm/RealmWrapper';
import {ThemeProvider} from './src/context';
import {Navigation} from './src/components/Navigation';
import {PaperProvider} from 'react-native-paper';

function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <RealmWrapper>
          <ThemeProvider>
            <PaperProvider>
              <BottomSheetModalProvider>
                {/* to make IOS status bar white */}
                <SafeAreaView
                  edges={[]}
                  style={{flex: 1, backgroundColor: 'white'}}>
                  <StatusBar
                    animated={false}
                    backgroundColor="white"
                    barStyle={'dark-content'}
                  />
                  <Navigation />
                </SafeAreaView>
              </BottomSheetModalProvider>
            </PaperProvider>
          </ThemeProvider>
        </RealmWrapper>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
