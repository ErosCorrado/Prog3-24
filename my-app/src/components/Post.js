import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native'
import { db, auth } from "../firebase/config"
import firebase from "firebase"

export default class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            estaMiLike: false,
            comentarios: []
        }
    }

    componentDidMount() {
        console.log('Post data:', this.props.post);  // Verifica los datos del post
        let estaMiLike = this.props.post.data.likes.includes(auth.currentUser.email)
        this.setState({ estaMiLike: estaMiLike })
    }

    like() {
        db.collection("posts")
            .doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
            })
            .then((resp) => this.setState({ estaMiLike: true }))
            .catch((err) => console.log(err))
    }

    unlike() {
        db.collection("posts")
            .doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
            })
            .then((resp) => this.setState({ estaMiLike: false }))
            .catch((err) => console.log(err))
    }

    irAComentar() {
        this.props.navigation.navigate('comments', { id: this.props.post.id })
    }
    
    irAPerfil() {
        {
            this.props.post.data.owner == auth.currentUser.email ?
                this.props.navigation.navigate('Perfil') 
                :
                this.props.navigation.navigate('friendPerfil', { user: this.props.post.data.owner })
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.irAPerfil()}>
                    <Text>{this.props.post.data.owner}</Text>
                </TouchableOpacity>
                <Image
                    style={styles.image}
                    source={{uri: this.props.post.data.imageUrl}}
                    resizeMode='contain'
                />
                <Text>{this.props.post.data.likes.length} likes</Text>
                {
                    this.state.estaMiLike ?
                        <TouchableOpacity onPress={() => this.unlike()}>
                            <Text>Unlike</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => this.like()}>
                            <Text>Like</Text>
                        </TouchableOpacity>
                }

                <View>
                    <TouchableOpacity onPress={() => this.irAComentar()}>
                        <Text>Comentarios: {this.props.post.data.comments.length} </Text>
                    </TouchableOpacity>
                    <FlatList
                        data={this.state.comentarios}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => 
                            <View>
                                <Text>{item.owner}: {item.text}</Text>
                            </View>
                        }
                    />
                    <TouchableOpacity onPress={() => this.irAComentar()}>
                        <Text>Ver más</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        height: 400
    }
})