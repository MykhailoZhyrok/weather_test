/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Main from './src/Main';
import { Provider } from 'react-redux';
import store from './src/store/store';


function App(): React.JSX.Element {
 

  return (
    <Provider store={store}>
    <Main/>
    </Provider>
  )
}



export default App;
