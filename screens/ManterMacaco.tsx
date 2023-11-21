import "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Button, KeyboardAvoidingView, StyleSheet, Alert, Text, Pressable, Modal, TextInput, TouchableOpacity, View, Image, FlatList, AlertButton } from "react-native";
import { auth, firestore, storage } from "../firebase";
import { uploadBytes } from "firebase/storage"; //access the storage databaSse
import meuestilo from "../meuestilo";
import * as ImagePicker from "expo-image-picker";
import { Macaco } from "../model/Macaco";
import SexoMacaco from "../model/SexoMacaco";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { EscolheRaca } from "./EscolheRaca";
import { Raca } from "../model/Raca";
import { Pelagem } from "../model/Pelagem";
import { EscolhePelagem } from "./EscolhePelagem";
// para o progresso da imagem 


const ManterMacaco = () => {
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    sexo: "",
  });

  const [formMacaco, setFormMacaco] = useState<Partial<Macaco>>({})
  const macacoRef =
    firestore.collection('Usuario').doc(auth.currentUser?.uid)
      .collection('Macaco')


  const [pickedImagePath, setPickedImagePath] = useState('')
  const [modalRacaVisible, setModalRacaVisible] = useState(false);
  const [modalPelagemVisible, setModalPelagemVisible] = useState(false);
  const racaRef = firestore.collection('Raca');
  const [formRaca, setFormRaca] = useState<Partial<Raca>>({})
  const pelagemRef = firestore.collection('Pelagem');
  const [formPelagem, setFormPelagem] = useState<Partial<Pelagem>>({})
  const [isRefreshing, setIsRefreshing] = useState(true)
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [macacos, setMacacos] = useState<Macaco[]>([]);

  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = macacoRef
      .onSnapshot((querySnapshot) => {
        const macacos = [];
        querySnapshot.forEach((documentSnapshot) => {
          macacos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setMacacos(macacos);
        setLoading(false);
        setIsRefreshing(false);
      });
    return () => subscriber();
  }, [macacos]);

  useEffect(() => {
      if (formMacaco.urlfoto===""){
        setPickedImagePath("../assets/camera.png")
      }else{
        setPickedImagePath(formMacaco.urlfoto)
      }
  }, []);

  useEffect(() => {
    console.log('Params received:', route.params);
    if (route.params.macaco) {
     setFormMacaco(route.params.macaco)
     setPickedImagePath(route.params.macaco.urlfoto)
     setDataString(route.params.macaco.datanascimento)
    if(route.params.macaco.sexo == "Macho"){
      setItemLista({ ...itemLista, id: '1', sexo: 'Macho' });
    }else if(route.params.macaco.sexo == "Femea"){
      setItemLista({ ...itemLista, id: '2', sexo: 'Femea' });
    }
   } 
 }, [route.params.macaco]);


  const setRaca = async (item) => {
    const doc = await racaRef.doc(item.id).get();
    const raca = new Raca(doc.data())
    setFormRaca(raca)
    setFormMacaco({ ...formMacaco, raca: raca.toFirestore() })
  }

  const setPelagem = async (item) => {
    const doc = await pelagemRef.doc(item.id).get();
    const pelagem = new Pelagem(doc.data())
    setFormPelagem(pelagem)
    setFormMacaco({ ...formMacaco, pelagem: pelagem.toFirestore() })
  }

  const listartodos = async () => {
    const subscriber = macacoRef
      .onSnapshot((querySnapshot) => {
        const macacos = [];
        querySnapshot.forEach((documentSnapshot) => {
          macacos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setMacacos(macacos);
        setLoading(false);
        setIsRefreshing(false);
      });
    return () => subscriber();
  }

  const limparFormulario = () => {
    setFormMacaco({})
    setDataString("")
    setItemLista({ ...itemLista, id: '', sexo: '' });
    setPickedImagePath("")
  }

  const cancelar = async () => {
    limparFormulario()
  }
  const salvar = async () => {
    const macaco = new Macaco(formMacaco);
      try{
        if (macaco.id == null) {
          const macacoRefComId = macacoRef.doc();
          macaco.id = macacoRefComId.id
          macaco.sexo = itemLista.sexo
          macacoRefComId.set(macaco.toFirestore()).then(() => {
            alert("Macaco " + macaco.nome + " Adicionado com Sucesso");
            limparFormulario()
          });

        } else {
          const macacoRefComId = macacoRef.doc(macaco.id);
          macaco.sexo = itemLista.sexo
          macacoRefComId.update(macaco.toFirestore())
            .then(() => {
              alert("Macaco " + macaco.nome + " Atualizado com Sucesso");
              atualizarquemUsa(macaco)
              limparFormulario()
            });
        };
      }catch(error){
        console.error('Erro ao cadastrar ou atualizar um Macaco (' + error);
      }
  };

  const atualizarquemUsa = (macaco) => {
    const macacoRef = firestore.collection('Macaco')
      .where("macaco.id", "==", macaco.id)
      .onSnapshot((querySnapshot) => {
        const macacos = [];
        querySnapshot.forEach(async (documentSnapshot) => {
          macacos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
          const reference = firestore.collection("Macaco").doc(documentSnapshot.data().id);
          reference.update({ macaco: macaco.toFirestore() });
        });

        console.log(macacos)
        route.params.macaco = macaco
      });
  }
  
  


  const escolhefoto = () => {
    Alert.alert(
      "Selecione a imagem",
      "",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
          style: "default",
        },

        {
          text: "Abrir galeria",
          onPress: () => showImagePicker(),
          style: "cancel",
        },

      ],
      {
        cancelable: true,
        onDismiss: () => { }
      }
    );
  }

  const enviarImagem = async (result) => {
    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);
      const uploadUri = result.assets[0].uri;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');

      const ref = storage.ref(`imagens/${name}.${extension}`);

      const img = await fetch(result.assets[0].uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);

      const paraDonwload = await storage.ref(fbResult.metadata.fullPath).getDownloadURL()

      setFormMacaco({ ...formMacaco, urlfoto: paraDonwload })
    } else {
      alert('Upload Cancelado')
    }
  }

  const showImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permita o acesso a câmera para seguir!");
      return;
    }


    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    enviarImagem(result);

  };


  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permita o acesso a câmera para seguir!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    enviarImagem(result);
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dataString, setDataString] = useState('')

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };


  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    const formattedDate = date.getDate().toString().padStart(2, "0") + "/" + ((date.getMonth() + 1).toString().padStart(2, "0")) + "/" + date.getFullYear();
    console.log(formattedDate)
    setDataString(formattedDate)
    hideDatePicker();
    setFormMacaco({
      ...formMacaco,
      datanascimento: formattedDate,
    });
  };

  const deleteMacaco = async (macaco: Macaco) => {
    const cancelBtn: AlertButton = { text: 'Cancelar' }
    const deleteBtn: AlertButton = {
      text: 'Apagar',
      onPress: async () => {
        const res = await macacoRef.doc(macaco.id).delete().then(() => {
          limparFormulario();
          setIsRefreshing(true);
        })

      }
    }

    Alert.alert(`Apagar macacco "${macaco.nome}?"`, 'Essa ação não pode ser desfeita!', [deleteBtn, cancelBtn])
  }

  const editMacaco = async (macaco: Macaco) => {
    const result = firestore.collection('Macaco').doc(macaco.id)
      .onSnapshot(documentSnapshot => {

        setFormMacaco(macaco)
        setPickedImagePath(macaco.urlfoto)
        setDataString(macaco.datanascimento)
        if(macaco.sexo == "Macho"){
          setItemLista({ ...itemLista, id: '1', sexo: 'Macho' });
        }else if(macaco.sexo == "Femea"){
          setItemLista({ ...itemLista, id: '2', sexo: 'Femea' });
        }
      });
    return () => result();
  }

  const renderMacacos = ({ item }: { item: Macaco }) => {
    return <View style={meuestilo.item} key={item.id}>
      <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, meuestilo.listItem]}
        onLongPress={() => deleteMacaco(item)}
        onPress={() => { editMacaco(item) }}
      >
        <View>
        <Image style={{ height: 50, width: 50, borderRadius: 30 }} source={{ uri: item.urlfoto }} />
          <Text style={meuestilo.title}>Nome: {item.nome}</Text>
          <Text style={meuestilo.title}>Data Nascimento: {item.datanascimento}</Text>
          {/* Condição para mostrar Raca */}
          {item.raca != null ?
            <Text style={meuestilo.title}>Raça: {item.raca.raca}</Text> : <Text style={meuestilo.title}>Raça: Não Selecionada</Text>}
          {/* <Text>Raça: {item.raca.raca}</Text> */}
          <Text style={meuestilo.title}>Sexo: {item.sexo}</Text>
        </View>
      </Pressable>
    </View>
  }

  return (
    <View style={meuestilo.inputContainer}>
      
      <Pressable onPress={() => escolhefoto()}>
        <View style={meuestilo.imageContainer}>
          {pickedImagePath !== "" && (
            <Image source={{ uri: pickedImagePath }} style={meuestilo.image} />
          )}
          {pickedImagePath === "" && (
            <Image source={require("../assets/camera.png")}
              style={meuestilo.image} />
          )}
        </View>
      </Pressable>
      <TextInput
        placeholder="Nome do animal"
        value={formMacaco.nome}
        onChangeText={val => setFormMacaco({ ...formMacaco, nome: val })}
        style={meuestilo.input}
      />
      
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalRacaVisible}
          onRequestClose={() => {
            Alert.alert("Modal fechada");
            setModalRacaVisible(!modalRacaVisible);
          }}
        >
          <View style={meuestilo.centeredView}>
            <View style={meuestilo.modalView}>
              <EscolheRaca
                setModalRacaVisible={setModalRacaVisible}
                setRaca={setRaca}
              >
              </EscolheRaca>
            </View>
          </View>
        </Modal>
        <Pressable style={[meuestilo.buttonModal, meuestilo.buttonOpen]}
          onPress={() => setModalRacaVisible(true)} >
          <Text style={meuestilo.textStyle}>
            Raça {formMacaco.raca?.raca}
          </Text>
        </Pressable>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalPelagemVisible}
          onRequestClose={() => {
            Alert.alert("Modal fechada.");
            setModalPelagemVisible(!modalPelagemVisible);
          }}
        >
          <View style={meuestilo.centeredView}>
            <View style={meuestilo.modalView}>
              <EscolhePelagem
                setModalPelagemVisible={setModalPelagemVisible}
                setPelagem={setPelagem}
              >
              </EscolhePelagem>
            </View>
          </View>

        </Modal>
        <Pressable style={[meuestilo.buttonModal, meuestilo.buttonOpen]}
          onPress={() => setModalPelagemVisible(true)} >
          <Text style={meuestilo.textStyle}>
            Pelagem {formMacaco.pelagem?.pelagem}
          </Text>
        </Pressable>

      <View style={meuestilo.buttonOutline}>
        <Button title="Data de nascimento" onPress={showDatePicker}/>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Text>Data: {dataString}</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalListaVisible}
        onRequestClose={() => {
          Alert.alert("Modal Fechado.");
          setModalListaVisible(!modalListaVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <SexoMacaco
              setModalListaVisible={setModalListaVisible}
              setItemLista={setItemLista}
            ></SexoMacaco>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalListaVisible(true)}
      >
        <Text style={styles.textStyle}>Sexo: {itemLista.sexo}</Text>
  

      </Pressable>



      <TouchableOpacity onPress={cancelar} style={meuestilo.button}>
        <Text style={meuestilo.buttonText}>Cancelar(Limpar)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={salvar}
        style={[meuestilo.button, meuestilo.buttonOutline]}
      >
        <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
      </TouchableOpacity>

      <FlatList
        data={macacos}
        renderItem={renderMacacos}
        keyExtractor={item => item.id.toString()}
        onRefresh={() => listartodos()}
        refreshing={isRefreshing}
      />

    </View>
    // </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ManterMacaco;

