import React from 'react';
import AppNavigator from './src/AppNavigator';
import { FavoritesProvider } from './src/contexts/FavoritesContext';

function App(): React.JSX.Element {
  return (
    <FavoritesProvider>
      <AppNavigator />
    </FavoritesProvider>
  );
}

export default App;