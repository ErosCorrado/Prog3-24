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
                <TouchableOpacity onPress={() => this.irAPerfil()}>
                    <Text style={styles.ownerText}>{this.props.post.data.owner}</Text>
                </TouchableOpacity>
                <Image
                    style={styles.image}
                    source={{ uri: this.props.post.data.imageUrl }}
                    resizeMode='contain'
                />
                <View style={styles.likeContainer}>
                    {this.state.estaMiLike ? (
                        <TouchableOpacity onPress={() => this.unlike()}>
                            <FontAwesome name='heart' color={'red'} size={24} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => this.like()}>
                            <FontAwesome name='heart-o' color={'red'} size={24} />
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
                        data={this.props.post.data.comentarios.slice(-4).reverse()} // Select the last 4 comments and reverse the order
                        keyExtractor={(item, index) => index.toString()} // Use index because items may not have unique ids
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
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    ownerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    likesText: {
        marginLeft: 10,
        fontSize: 16,
    },
    descriptionText: {
        fontSize: 16,
        marginBottom: 10,
    },
    commentContainer: {
        marginBottom: 5,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
    },
    commentCountText: {
        fontSize: 14,
        color: '#007BFF',
        marginTop: 10,
    },
    viewMoreText: {
        fontSize: 14,
        color: '#007BFF',
        marginTop: 10,
    },
});
