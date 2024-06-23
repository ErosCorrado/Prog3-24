import React, { Component } from 'react'
import { Text, View, Image, FlatList, ScrollView } from 'react-native'
import { db, auth } from '../firebase/config'
import Post from '../components/Post'

export default class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      usuarios: [],
      posteosDelUser: [],
    }
  }

  componentDidMount() {
    db.collection('users')
      .where('owner', '==', this.props.route.params.user)
      .onSnapshot((docs) => {
        let arrDocs = []
        docs.forEach((doc) => {
          arrDocs.push({
            id: doc.id,
            data: doc.data()
          })
        })
        this.setState({
          usuarios: arrDocs
        },
          () => console.log(this.state.usuarios))
      }
      )
    db.collection('posts')
      .where('owner', '==', this.props.route.params.user)
      .onSnapshot((docs) => {
        let arrPost = []
        docs.forEach((doc) => {
          arrPost.push({
            id: doc.id,
            data: doc.data()
          })
          console.log(arrPost)
        })

        this.setState({
          posteosDelUser: arrPost
        },
          () => console.log('log extendido', this.state))
      }
      )

  }

  render() {
    const user = this.state.usuarios.length > 0 ? this.state.usuarios[0].data: null ;
    
    return (
      
      <ScrollView >
        {
          user ?
            <View >
              <Text >Usuario: {user.name}</Text>
              <Image
                source={{ uri: user.fotoPerfil }}
                resizeMode='contain'
              />
              <Text>Email: {user.owner}</Text>
              <Text> Biografía: {user.minBio}</Text>

            </View>
            :
            <Text>Cargando...</Text>
        }
       
        <View>
          <Text> Cantidad de Postos:{this.state.posteosDelUser.length} </Text>
          {
            this.state.posteosDelUser.length === 0
              ?
              <Text>El usuario no tiene posteos</Text>
              :
              <FlatList
                data={this.state.posteosDelUser}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                  <View>
                    <Post navigation={this.props.navigation} post={item} />
                  </View>
                }
              />
          }

        </View>
      </ScrollView>

    )
  }
}

