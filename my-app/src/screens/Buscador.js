import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { Component } from 'react';
import Search from '../components/Search';
import { db, auth } from '../firebase/config';

export default class Buscador extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      backUp: [],
      busqueda: false,
    };
  }

  componentDidMount() {
    db.collection('users').onSnapshot((docs) => {
      let users = [];
      docs.forEach((doc) => {
        users.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      this.setState({
        users: users,
        backUp: users,
      });
    });
  }

  guardarBusqueda(valorInput) {
    this.setState({
      busqueda: valorInput,
    });
  }

  filtroUsers(busqueda) {
    let filteredUsers = this.state.backUp.filter((elm) =>
      elm.data.name.toLowerCase().includes(busqueda.toLowerCase())
    );
    this.setState({
      users: filteredUsers,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Search
          guardarBusqueda={(valorInput) => this.guardarBusqueda(valorInput)}
          filtroUsers={(busqueda) => this.filtroUsers(busqueda)}
        />
        {this.state.busqueda !== '' ? (
          this.state.users.length !== 0 ? (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultText}>
                Resultados para: {this.state.busqueda}
              </Text>
              <FlatList
                data={this.state.users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('friendProfile', {
                        userId: item.id,
                      })
                    }
                  >
                    <Text style={styles.userText}>{item.data.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : (
            <Text style={styles.noResultsText}>
              No se encontraron resultados para: {this.state.busqueda}
            </Text>
          )
        ) : (
          <Text style={styles.promptText}>Buscar un usuario</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userText: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noResultsText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  promptText: {
    fontSize: 16,
    marginTop: 20,
  },
});