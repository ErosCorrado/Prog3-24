import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { db, auth } from "../firebase/config";
import firebase from "firebase";
import { FontAwesome } from '@expo/vector-icons';

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            estaMiLike: false,
            comentarios: []
        };
    }

    componentDidMount() {
        let estaMiLike = this.props.post.data.likes.includes(auth.currentUser.email);
        this.setState({ estaMiLike: estaMiLike });
    }

    like() {
        db.collection("posts")
            .doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
            })
            .then(() => this.setState({ estaMiLike: true }))
            .catch(err => console.log(err));
    }

    unlike() {
        db.collection("posts")
            .doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
            })
            .then(() => this.setState({ estaMiLike: false }))
            .catch(err => console.log(err));
    }

    irAComentar() {
        this.props.navigation.navigate('Comments', { id: this.props.post.id });
    }

    irAPerfil() {
        this.props.post.data.owner === auth.currentUser.email ?
            this.props.navigation.navigate('Profile') :
            this.props.navigation.navigate('UserProfile', { user: this.props.post.data.owner });
    }

    render() {
        return (
            <View style={styles.postContainer}>
                <TouchableOpacity onPress={() => this.irAPerfil()} >
                    <Text style={styles.ownerText}>{this.props.post.data.owner}</Text>
                </TouchableOpacity>
                <Image
                    style={styles.image}
                    source={{ uri: this.props.post.data.imageUrl }}
                    resizeMode='cover'
                />
                <View style={styles.likeContainer}>
                    {this.state.estaMiLike ? (
                        <TouchableOpacity onPress={() => this.unlike()}>
                            <FontAwesome name='heart' color={'#e74c3c'} size={24} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => this.like()}>
                            <FontAwesome name='heart-o' color={'#e74c3c'} size={24} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.likesText}>{this.props.post.data.likes.length} likes</Text>
                </View>
                <Text style={styles.descriptionText}>{this.props.post.data.descripcion}</Text>
                <View>
                    <TouchableOpacity onPress={() => this.irAComentar()}>
                        <Text style={styles.commentCountText}>Comentarios: {this.props.post.data.comentarios.length}</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={this.props.post.data.comentarios.slice(-4).reverse()}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            <View style={styles.commentContainer}>
                                <Text style={styles.commentText}>{item.owner}: {item.comentario}</Text>
                            </View>
                        }
                    />
                    <TouchableOpacity onPress={() => this.irAComentar()}>
                        <Text style={styles.viewMoreText}>Ver más</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    ownerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: 300, 
        borderRadius: 10,
        marginBottom: 15,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    likesText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#f0f0f0',
    },
    descriptionText: {
        fontSize: 16,
        marginBottom: 15,
        color: '#f0f0f0',
    },
    commentContainer: {
        marginBottom: 10,
    },
    commentText: {
        fontSize: 14,
        color: '#f0f0f0',
    },
    commentCountText: {
        fontSize: 16,
        color: '#007BFF',
        marginTop: 10,
    },
    viewMoreText: {
        fontSize: 16,
        color: '#007BFF',
        marginTop: 10,
    },
});
