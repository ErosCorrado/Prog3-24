import { Text, View, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'

export default class Buscar extends Component {
    constructor(props) {
        super(props)
    }

    evitarSubmit(evento) {
        evento.preventDefault()
    }

    filtrarYGuardar(busqueda){
        this.props.guardarBusqueda(busqueda)
        this.props.filtroUsers(busqueda)
    }
    render() {
        return (
            <View>
                <Text>Buscador</Text>
                <TextInput
                    onChangeText={(busqueda) => this.filtrarYGuardar(busqueda)}
                    //value={this.state.password}
                    placeholder='Buscar un usuario'
                    keyboardType='default'
                    style={styles.form}
                ></TextInput>
            </View>
        )
    }
}