import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase/config';
import Post from '../components/Post';

export default class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            posts: []
        };
    }

    componentDidMount() {
        // Obtener información del usuario actual desde Firebase
        db.collection('users').doc(auth.currentUser.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    this.setState({ user: doc.data() });
                } else {
                    console.log('No such document!');
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });

        // Obtener publicaciones del usuario actual desde Firebase
        db.collection('posts')
        .where('owner', '==', auth.currentUser.email)
        .onSnapshot(snapshot => {
            const posts = [];
            snapshot.forEach(doc => {
                posts.push({ id: doc.id, data: doc.data() });
            });
            this.setState({ posts: posts });
        });
    }

    navigateToFriendProfile(ownerEmail) {
        if (ownerEmail === auth.currentUser.email) {
            this.props.navigation.navigate('Perfil'); // Cambiar a la pantalla de perfil propio
        } else {
            this.props.navigation.navigate('friendPerfil', { user: ownerEmail });
        }
    }

    render() {
        return (
                <ScrollView>

                        <FlatList
                            data={this.state.posts}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => this.navigateToFriendProfile(item.data.owner)}>
                                    <Post post={item} navigation={this.props.navigation} />
                                </TouchableOpacity>
                            )}
                        />
                </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 10,
        color: 'white',
    },
    noPostsText: {
        fontSize: 16,
        color: 'white',
        marginLeft: 20,
        marginTop: 10,
    },
});
