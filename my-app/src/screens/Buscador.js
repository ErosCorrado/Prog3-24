import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import Search from '../components/Search'
import { db, auth} from '../firebase/config'

export default class Buscador extends Component {
  constructor(props) {
    super()
    this.state = {
      users: [],
      backUp: [],
      busqueda: false
    }
  }

  componentDidMount() {
    db.collection('users')
      .onSnapshot((docs) => {
        let users = [];
        docs.forEach((doc) => {
          users.push({
            id: doc.id,
            data: doc.data()
          })
        })
        this.setState({
          users: users,
          backUp: users 
        })
      })
      {console.log('Estos son mis usuarios' + this.state.users)}
  }

  guardarBusqueda(valorInput) {
    this.setState({
      busqueda: valorInput
    })
  }

  filtroUsers(busqueda){
    let filteredUsers = this.state.backUp.filter((elm) => elm.data.name.toLowerCase().includes(busqueda.toLowerCase()))
    this.setState({
      users: filteredUsers
    })
  }

  render() {
    return (
      <View>
        {console.log('Mis usuarios' + this.state.users)}
        {console.log('Mi busqueda' + this.state.busqueda)}
        <Buscar guardarBusqueda={(valorInput) => this.guardarBusqueda(valorInput)} filtroUsers={(busqueda) => this.filtroUsers(busqueda)} />
        { this.state.busqueda !== '' ?
        (this.state.users.length !== 0 ?
          <View>
          <Text>Resultados para: {this.state.busqueda}</Text>
          <FlatList
            data={this.state.users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              <Text>{item.data.name}</Text>}
          />
          </View>
          :
          <h2>No se encontraron resultados para: {this.state.busqueda}</h2>)
          :
          <Text>Buscar un usuario</Text>
        }
      </View>
    )
  }
}