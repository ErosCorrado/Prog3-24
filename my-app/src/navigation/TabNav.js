import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Home from '../screens/Home';
import CrearPost from '../screens/CrearPost';
import Profile from '../screens/Profile';
import Buscador from '../screens/Buscador'; // Asegúrate de importar Buscador

const Tab = createBottomTabNavigator();

export default class TabNav extends Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name='Home'
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: () => <FontAwesome name='home' size={24} color='black' />
          }}
        />
        <Tab.Screen
          name='CrearPost'
          component={CrearPost}
          options={{
            headerShown: false,
            tabBarIcon: () => <FontAwesome name="edit" size={24} color="black" />
          }}
        />
        <Tab.Screen 
          name='Buscador' 
          component={Buscador}
          options={{
            headerShown: false,
            tabBarIcon: () => <FontAwesome name="search" size={24} color="black" />
          }}
        />
        <Tab.Screen 
          name='Perfil' 
          component={Profile}
          options={{
            headerShown: false,
            tabBarIcon: () => <FontAwesome name="user" size={24} color="black" />
          }}
        />

      </Tab.Navigator>
      
    );
  }
}
