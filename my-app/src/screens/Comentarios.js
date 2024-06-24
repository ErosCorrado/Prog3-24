import React, { Component } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import Coments from '../components/coments';
import { db } from '../firebase/config';

class Comentarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoPost: null,
        };
    }

    componentDidMount() {
        db.collection('posts')
            .doc(this.props.route.params.id)
            .onSnapshot((doc) => {
                this.setState({ infoPost: doc.data() });
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Comentarios:</Text>
                {this.state.infoPost != null ? (
                    <FlatList
                        data={this.state.infoPost.comentarios.sort((a, b) => b.createdAt - a.createdAt)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.commentItem}>
                                <Text style={styles.commentOwner}>{item.owner}</Text>
                                <Text style={styles.commentText}>{item.comentario}</Text>
                            </View>
                        )}
                    />
                ) : null}
                <Coments postId={this.props.route.params.id} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentItem: {
        marginBottom: 10,
    },
    commentOwner: {
        fontWeight: 'bold',
    },
    commentText: {
        marginLeft: 10,
    },
});

export default Comentarios;
