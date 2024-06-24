import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { db, auth } from '../firebase/config'
import firebase from 'firebase'

class Coments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comentario: ''
    }
  }

  enviarComentario(comentario) {
    db.collection('posts')
      .doc(this.props.postId)
      .update({
        comentarios: firebase.firestore.FieldValue.arrayUnion({
          owner: auth.currentUser.email,
          createdAt: Date.now(),
          comentario: comentario
        })
      })
      .then(() => {
        this.setState({ comentario: '' })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <View style={styles.commentContainer}>
        <TextInput
          placeholder='Agrega un comentario'
          keyboardType='default'
          onChangeText={(text) => this.setState({ comentario: text })}
          value={this.state.comentario}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => this.state.comentario === '' ? alert('No puedes enviar un comentario vacío') : this.enviarComentario(this.state.comentario)}
          style={styles.sendButton}
        >
          <FontAwesome name='send' size={30} color={'black'} />
        </TouchableOpacity>
      </View>
    )
  }
}

export default Coments

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  }
})
