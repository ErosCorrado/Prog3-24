import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { Camera } from 'expo-camera'
import { storage, auth } from '../firebase/config'

export default class Camara extends Component {
  constructor(props){
    super(props)
    this.state={
        dioPermiso: false,
        urlTemporal: ''
    }
    this.metodoCamara = null
  }

  componentDidMount(){
    Camera.requestCameraPermissionsAsync()
    .then(() => this.setState({ dioPermiso: true }))
    .catch(() => console.log('No tenemos los permisos'))
  }

  tomarFoto(){
    this.metodoCamara.takePictureAsync()
    .then((urlTemp) => this.setState({ urlTemporal: urlTemp.uri }))
    .catch((err) => console.log(err))
  }

  descartarFoto(){
    this.setState({ urlTemporal: '' })
  }

  guardarFotoEnFirebase(){
    fetch(this.state.urlTemporal)
    .then((img) => img.blob())
    .then((imgProcesada) => {
      const ref = storage.ref(`foto/${Date.now()}.jpeg`)
      ref.put(imgProcesada)
      .then(() => {
        ref.getDownloadURL()
        .then(url => this.props.actualizarImgUrl(url))
      })
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <View style={styles.contenedor}>
        {
            this.state.dioPermiso ?
                this.state.urlTemporal === '' 
                ?
                <>
                    <Camera 
                    style={styles.camara}
                    ref={(metodos) => this.metodoCamara = metodos}
                    type={Camera.Constants.Type.back}
                    />
                    <TouchableOpacity
                      style={styles.boton}
                      onPress={() => this.tomarFoto()}
                    > 
                        <Text style={styles.textoBoton}>Tomar foto</Text>
                    </TouchableOpacity>
                </>
                :
                <>
                  <Image 
                    style={styles.imagen}
                    source={{uri: this.state.urlTemporal}}
                  />
                  <View style={styles.botonesContainer}>
                    <TouchableOpacity
                      style={styles.boton}
                      onPress={() => this.descartarFoto()}
                    >
                      <Text style={styles.textoBoton}>Rechazar foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.boton}
                      onPress={() => this.guardarFotoEnFirebase()}
                    >
                      <Text style={styles.textoBoton}>Aceptar foto</Text>
                    </TouchableOpacity>
                  </View>
                </>
            :
            <Text>No diste permisos para usar la camara</Text>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  camara: {
    height: '80%',
    width: '200%',
  },
  imagen: {
    height: '80%',
    width: '100%'
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20
  },
  boton: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  textoBoton: {
    color: '#000'
  }
})