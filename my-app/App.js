import { StyleSheet, Text, View } from 'react-native';

import Home from './src/screens/Home';


function App() {
    return (
      <View style = {styles.contenedorMain}>
        {/* <CrearPost/> */}
        <MainNav/>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    contenedorMain:{
      width: '100%'
    }
  })
  export default App