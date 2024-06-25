import React, { Component } from 'react';
import { Text, View, Image, FlatList, ScrollView, StyleSheet } from 'react-native';
import { db } from '../firebase/config';
import Post from '../components/Post';

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      posteosDelUser: [],
    };
  }

  componentDidMount() {
    db.collection('users')
      .where('owner', '==', this.props.route.params.user)
      .onSnapshot((docs) => {
        let arrDocs = [];
        docs.forEach((doc) => {
          arrDocs.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        this.setState({
          usuarios: arrDocs,
        });
      });

    db.collection('posts')
      .where('owner', '==', this.props.route.params.user)
      .onSnapshot((docs) => {
        let arrPost = [];
        docs.forEach((doc) => {
          arrPost.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        this.setState({
          posteosDelUser: arrPost,
        });
      });
  }

  render() {
    const user = this.state.usuarios.length > 0 ? this.state.usuarios[0].data : null;

    return (
      <ScrollView style={styles.container}>
        {user ? (
          <View style={styles.profileInfo}>
            <Text style={styles.title}>Usuario:</Text>
            <Text style={styles.text}>{user.name}</Text>
            <Image
              source={{ uri: user.fotoPerfil }}
              resizeMode="contain"
              style={{ width: '100%', height: 200 }} // Ajusta el tamaño de la imagen según tus necesidades
            />
            <Text style={styles.title}>Email:</Text>
            <Text style={styles.text}>{user.owner}</Text>
            <Text style={styles.title}>Biografía:</Text>
            <Text style={styles.text}>{user.minBio}</Text>
          </View>
        ) : (
          <Text>Cargando...</Text>
        )}

        <View style={styles.postsSection}>
          <Text style={styles.title}>Cantidad de Posteos: {this.state.posteosDelUser.length}</Text>
          {this.state.posteosDelUser.length === 0 ? (
            <Text style={styles.text}>El usuario no tiene posteos</Text>
          ) : (
            <FlatList
              data={this.state.posteosDelUser}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.postContainer}>
                  <Post navigation={this.props.navigation} post={item} />
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 10,
  },
  profileInfo: {
    marginBottom: 20,
  },
  postsSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f0f0f0',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 10,
  },
  postContainer: {
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
});
