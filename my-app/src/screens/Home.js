import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from "../firebase/config";
import Post from '../components/Post';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user !== null) {
        db.collection("posts")
          .orderBy("createdAt", "desc")
          .onSnapshot((docs) => {
            let postsObtenidos = [];
            docs.forEach((doc) => {
              postsObtenidos.push({
                id: doc.id,
                data: doc.data()
              });
            });
            console.log('Posts obtenidos:', postsObtenidos);  
            this.setState({
              posts: postsObtenidos
            });
          });
      }
    });
  }

  render() {
    console.log('user:', auth.currentUser);
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Home</Text>
        <FlatList
          data={this.state.posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => 
            <View style={styles.postContainer}>
              <Post navigation={this.props.navigation} post={item} />
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 20,
  },
  postContainer: {
    marginBottom: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    width: '100%',
    maxWidth: 400, 
    alignSelf: 'center' 
  },
});
