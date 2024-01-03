import { createContext, useContext, useReducer } from 'react';
import { DefaultTheme } from '@react-navigation/native';

const ThemeContext = createContext(null);

const ThemeDispatchContext = createContext(null);

const initialTheme = DefaultTheme;

export function ThemeProvider({ children }) {
  const [theme, dispatch] = useReducer(
    themeReducer,
    initialTheme
  );

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={dispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeDispatch() {
  return useContext(ThemeDispatchContext);
}

function themeReducer(theme, action) {
  switch (action.type) {
    case 'change': {
        return action.theme
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
