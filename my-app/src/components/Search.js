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
            <View style={styles.container}>
                <Text style={styles.title}>Buscador</Text>
                <TextInput
                    onChangeText={(busqueda) => this.filtrarYGuardar(busqueda)}
                    placeholder='Buscar un usuario'
                    keyboardType='default'
                    style={styles.form}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    form: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
})