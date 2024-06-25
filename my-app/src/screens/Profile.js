import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import Post from '../components/Post';
import { db, auth } from '../firebase/config';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estasLogueado: false,
      posteos: [],
      users: [],
      eliminarPost: false
    };
  }

  componentDidMount() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.setState({ estasLogueado: true });
      db.collection("posts")
        .where("owner", "==", currentUser.email)
        .onSnapshot((docs) => {
          let posteosObtenidos = [];
          docs.forEach(doc => {
            posteosObtenidos.push({
              id: doc.id,
              data: doc.data()
            });
          });
          this.setState({
            posteos: posteosObtenidos
          });
        });
      db.collection("users")
        .where("owner", "==", currentUser.email)
        .onSnapshot((docs) => {
          let arrayUsers = [];
          docs.forEach(doc => {
            arrayUsers.push({
              id: doc.id,
              data: doc.data()
            })
          })
          this.setState({
            users: arrayUsers
          })
        })
    }
  }

  eliminarPost(postId) {
    db.collection("posts")
      .doc(postId)
      .delete();
  }

  eliminarUsuario() {
    db.collection("users").where("owner", "==", auth.currentUser.email).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => doc.ref.delete()
          .then(() => {
            auth.currentUser.delete()
              .then(() => this.props.navigation.navigate('register'))
              .catch((error) => console.log("Error al eliminar al usuario del auth", error))
          })
          .catch((error) => console.log("Error al eliminar al usuario de la colección", error))
        )
      })
      .catch((error) => console.log("Error al acceder a la colección", error))
  }

  cerrarSesion() {
    auth.signOut()
      .then(() => {
        this.setState({ estaLogueado: false });
        this.props.navigation.navigate('login');
      }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }

  render() {
    const user = this.state.users.length > 0 ? this.state.users[0].data : null;
    return (
      <ScrollView style={styles.container}>
        {
          user ?
            <View style={styles.profileInfo}>
              <Text style={styles.title}>Mi Perfil</Text>
              <Text style={styles.text}>{user.name}</Text>
              <Text style={styles.text}>{user.owner}</Text>
              <Text style={styles.text}>{user.minBio}</Text>
            </View>
            :
            <Text>Cargando ...</Text>
        }

        <View style={styles.postsSection}>
          <Text style={styles.title}>Tus Posteos: {this.state.posteos.length}</Text>
          {
            this.state.posteos.length > 0
              ?
              <FlatList
                data={this.state.posteos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                  <View style={styles.postContainer}>
                    <Post post={item} />
                    <TouchableOpacity onPress={() => this.eliminarPost(item.id)}>
                      <Text style={styles.deleteButton}>Eliminar posteo</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
              :
              <Text style={styles.text}>El usuario no tiene posteos</Text>
          }
        </View>

        <View style={styles.buttonsSection}>
          <TouchableOpacity style={styles.button} onPress={() => this.cerrarSesion()}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => this.eliminarUsuario()}>
            <Text style={styles.buttonText}>Eliminar usuario</Text>
          </TouchableOpacity>
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
  buttonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f0f0f0',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#f0f0f0',
    marginBottom: 5,
  },
  postContainer: {
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  deleteButton: {
    color: '#007BFF',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});
