import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet } from 'react-native'
import { auth, db } from "../firebase/config"
import Post from '../components/Post'

export default class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      posts: []
    }
  }

  componentDidMount(){
    auth.onAuthStateChanged((user) => {
      if (user !== null) {
        db.collection("posts")
        .orderBy("createdAt", "desc")
        .onSnapshot((docs) => {
          let postsObtenidos = []
          docs.forEach((doc)=>{
            postsObtenidos.push({
              id: doc.id,
              data: doc.data()
            })
          })
          console.log('Posts obtenidos:', postsObtenidos);  // Verifica los posts obtenidos
          this.setState({
            posts: postsObtenidos
          })       
        })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Home</Text>
        <FlatList
          data={this.state.posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => 
            <View>
              <Post navigation={this.props.navigation} post={item} />
            </View>
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
})