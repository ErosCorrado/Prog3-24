import { FlatList, Text, View } from 'react-native'
import React, { Component } from 'react'
import Coments from '../components/Coments'
import { db } from '../firebase/config'



class Comentarios extends Component {
    constructor(props){
        super(props)
        this.state={
          infoPost: null,
          comentarios:[]
        }

       
    }
    






  render() {
    return (
      <View>
        <Text>Comentarios</Text>
      </View>
    )
  }
}