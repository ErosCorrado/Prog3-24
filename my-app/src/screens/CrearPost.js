import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { db, auth } from '../firebase/config';
import Camara from '../components/Camara';

export default class CrearPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            descripcion: '',
            imgPostUrl: ''
        }
    }

    onSubmit(descripcion) {
        if (descripcion != '') {
            db.collection('posts').add({
                descripcion: descripcion,
                owner: auth.currentUser.email,
                nombre: auth.currentUser.name,
                createdAt: Date.now(),
                imageUrl: this.state.imgPostUrl,
                likes: [],
                comentarios: [],
            })
                .then((resp) => {
                    this.setState({
                        descripcion: '',
                        imageUrl: '',
                        imgPostUrl: ''
                    },
                        () => this.props.navigation.navigate('Home')
                    )
                })
                .catch((err) => console.log(err))
        }
    }

    actualizarImgUrl(url) {
        this.setState({
            imgPostUrl: url
        })
    }

    render() {
        return (
            <View style={styles.contenedor}>
                {
                    this.state.imgPostUrl === ''
                        ?
                        <Camara actualizarImgUrl={(url) => this.actualizarImgUrl(url)} />
                        :
                        <>
                            <TextInput
                                value={this.state.descripcion}
                                onChangeText={(text) => this.setState({ descripcion: text })}
                                placeholder='Describe tu post'
                                style={styles.input}
                            />
                            <TouchableOpacity
                                style={styles.boton}
                                onPress={() => this.onSubmit(this.state.descripcion)}
                            >
                                <Text style={styles.textoBoton}>Crear post</Text>
                            </TouchableOpacity>
                        </>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10
    },
    boton: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    textoBoton: {
        color: '#000'
    }
})