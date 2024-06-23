import { Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { Component } from 'react'
import Post from '../components/Post'
import { db, auth } from '../firebase/config'

export default class Profile extends Component {
    constructor(props){
        super(props)
        this.state = {
            estasLogueado: false,
            posteos: [],
            users: [],
            eliminarPost: false
        }
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
          .delete()
    
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
          <ScrollView >
            {
              user ?
                <View >
                  <Text >Mi Perfil</Text>
                  <Text >{user.name}</Text>
                  <Text >{user.owner}</Text>
                  <Text >{user.minBio}</Text>
                </View>
                :
                <Text>Cargando ...</Text>
            }
    
            <View >
              <Text >Tus Posteos:{this.state.posteos.length}</Text>
              {
                this.state.posteos.length > 0
                  ?
                  <View >
                    <FlatList
                      data={this.state.posteos}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) =>
                        <View >
                          <Post post={item} />
                          <TouchableOpacity onPress={() => this.eliminarPost(item.id)}>
                            <Text > Eliminar posteo</Text>
                          </TouchableOpacity>
                        </View>
                      }
                    />
                  </View>
                  :
                  <Text > El usuario no tiene posteos</Text>
              }
    
            </View>
    
            <View >
              <TouchableOpacity
                onPress={() => this.cerrarSesion()}
               
              >
                <Text >Cerrar Sesión</Text>
              </TouchableOpacity>
    
              <TouchableOpacity
                onPress={() => this.eliminarUsuario()}
              >
                <Text >Eliminar usuario</Text>
              </TouchableOpacity>
            </View>
    
          </ScrollView >
        );
      }
    }
    