import "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Alert, Text, Pressable, Modal, TextInput, TouchableOpacity, View, } from "react-native";
import { auth, firestore } from "../../firebase";
import meuestilo from "../../meuestilo";
import { Pelagem } from "../../model/Pelagem";

const ManterPelagem = ({ navigation }) => {
  const [formPelagem, setFormPelagem] = useState<Partial<Pelagem>>({})
  const pelagemRef = firestore.collection('Pelagem');
  const route = useRoute();

  useEffect(() => {
    if (route.params.pelagem) {
      setFormPelagem(route.params.pelagem)
    }
  }, [route.params.pelagem]);


  const limparFormulario = () => {
    setFormPelagem({})
  }

  const cancelar = async () => {
    limparFormulario()
  }
  const salvar = async () => {
    const pelagem = new Pelagem(formPelagem);

    if (pelagem.id == null) {
      const pelagemRefComId = pelagemRef.doc();
      pelagem.id = pelagemRefComId.id
      pelagemRefComId.set(pelagem.toFirestore()).then(() => {
        alert("Pelagem" + pelagem.pelagem + " Adicionada com Sucesso");
        limparFormulario()
      });

    } else {
      const pelagemRefComId = pelagemRef.doc(pelagem.id);
      pelagemRefComId.update(pelagem.toFirestore())
        .then(() => {
          alert("Raça" + pelagem.pelagem + " Atualizada com Sucesso");
          atualizarquemUsa(pelagem)
          limparFormulario()
        });
    };
  };

  const atualizarquemUsa = (pelagem) => {
    const macacoRef = firestore.collection('Macaco')
      .where("pelagem.id", "==", pelagem.id)
      .onSnapshot((querySnapshot) => {
        const macaco = [];
        querySnapshot.forEach(async (documentSnapshot) => {
          macaco.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
          const reference = firestore.collection("Macaco").doc(documentSnapshot.data().id);
          reference.update({ pelagem: pelagem.toFirestore() });

          //limparFormulario()
          //macacoRef.doc(documentSnapshot.id).update({
          //     pelagem:pelagem.tofirestore()
          // })
        });

        console.log(macaco)
        route.params.pelagem = pelagem
      });



  }

  return (
    <KeyboardAvoidingView
      style={meuestilo.container}
      behavior="padding">
      <View style={meuestilo.inputContainer}>
        <TextInput
          placeholder="Pelagem"
          value={formPelagem.pelagem}
          onChangeText={val => setFormPelagem({ ...formPelagem, pelagem: val })}
          style={meuestilo.input}
        />
      </View>

      <View style={meuestilo.buttonContainer}>
        <TouchableOpacity onPress={cancelar} style={meuestilo.button}>
          <Text style={meuestilo.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={salvar}
          style={[meuestilo.button, meuestilo.buttonOutline]}
        >
          <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ManterPelagem;

