import "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Alert, Text, Pressable, Modal, TextInput, TouchableOpacity, View, } from "react-native";
import { auth, firestore } from "../../firebase";
import meuestilo from "../../meuestilo";
import { Raca } from "../../model/Raca";

const ManterRaca = ({ navigation }) => {
  const [formRaca, setFormRaca] = useState<Partial<Raca>>({})
  const racaRef = firestore.collection('Raca');
  const route = useRoute();

  useEffect(() => {
     if (route.params.raca) {
      setFormRaca(route.params.raca)
    } 
  }, [route.params.raca]);


  const limparFormulario = () => {
    setFormRaca({})
  }

  const cancelar = async () => {
    limparFormulario()
  }
  const salvar = async () => {
    const raca = new Raca(formRaca);

    if (raca.id == null) {
      const racaRefComId = racaRef.doc();
      raca.id = racaRefComId.id
      racaRefComId.set(raca.toFirestore()).then(() => {
        alert("Raca" + raca.raca + " Adicionada com Sucesso");
        limparFormulario()
      });

    } else {
      const racaRefComId = racaRef.doc(raca.id);
      racaRefComId.update(raca.toFirestore())
        .then(() => {
          alert("Raça" + raca.raca + " Atualizada com Sucesso");
          atualizarquemUsa(raca)
          limparFormulario()
        });
    };
  };

  const atualizarquemUsa = (raca) => {
    const macacoRef = firestore.collection('Macaco')
      .where("raca.id", "==", raca.id)
      .onSnapshot((querySnapshot) => {
        const macaco = [];
        querySnapshot.forEach(async (documentSnapshot) => {
          macaco.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
          const reference = firestore.collection("Macaco").doc(documentSnapshot.data().id);
          reference.update({ raca: raca.toFirestore() });

          //limparFormulario()
          //macacoRef.doc(documentSnapshot.id).update({
          //     raca:raca.tofirestore()
          // })
        });

        console.log(macaco)
        route.params.raca = raca
        
      });



  }

  return (
    <KeyboardAvoidingView
      style={meuestilo.container}
      behavior="padding">
      <View style={meuestilo.inputContainer}>
        <TextInput
          placeholder="Raca"
          value={formRaca.raca}
          onChangeText={val => setFormRaca({ ...formRaca, raca: val })}
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

export default ManterRaca;

