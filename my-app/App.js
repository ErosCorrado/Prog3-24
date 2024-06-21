import { StyleSheet, Text, View } from 'react-native';
import Register from './src/screens/Register';
import MainNav from './src/navigation/mainNav';

export default function App() {
  return (
    <View
     style = {styles.contenedorMain}>
       <MainNav/>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorMain:{
    width: '100%'
  }
})