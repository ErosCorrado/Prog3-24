import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';
import Comments from '../components/Comments';
import { db } from '../firebase/config';

class Comentarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoPost: null,
            comentarios: []
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
            <View>
                <Text>Comentarios:</Text>
                {this.state.infoPost != null ? (
                    <FlatList
                        data={this.state.infoPost.comentarios.sort((a, b) => a.createdAt - b.createdAt).reverse()}
                        keyExtractor={(item) => item.createdAt.toString()}
                        renderItem={({ item }) => (
                            <View>
                                <Text>{item.owner}</Text>
                                <Text>{item.comentario}</Text>
                            </View>
                        )}
                    />
                ) : null}
                <Comments postId={this.props.route.params.id} />
            </View>
        );
    }
}

export default Comentarios;
