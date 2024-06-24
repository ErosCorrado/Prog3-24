import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '../screens/Register';
import Login from '../screens/Login';
import TabNav from './TabNav';
import UserProfile from '../screens/UserProfile';
import Comentarios from '../screens/Comentarios'

const Stack = createNativeStackNavigator();

function mainNav() {
    return (
        <NavigationContainer> 
            <Stack.Navigator initialRouteName="login">
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
                <Stack.Screen
                    name='UserProfile'
                    component={UserProfile}
                />
                <Stack.Screen
                    name='Comments'
                    component={Comentarios}
                    options={{headerShown: true}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default mainNav;
