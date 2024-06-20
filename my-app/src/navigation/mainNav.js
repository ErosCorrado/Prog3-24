import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Register from '../screens/Register';
import Login from '../screens/Login';
import TabNav from './TabNav';

const Stack = createNativeStackNavigator();

function mainNav() {

    return (
        <NavigationContainer> 
            <Stack.Navigator>
                <Stack.Screen
                    name='register'
                    component={Register}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='login'
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='tabNav'
                    component={TabNav}
                    options={{ headerShown: false }}
                />

            </Stack.Navigator>
        </NavigationContainer>


    )
}
export default mainNav