import { useNavigation } from "@react-navigation/core";

import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View, FlatList, Text, StatusBar, AlertButton, Alert, Pressable, } from "react-native";
import { auth, firestore } from "../../firebase";
import MeuEstilo from "../../meuestilo";
import { Raca } from "../../model/Raca";

const ListarRacas = () => {
  const [loading, setLoading] = useState(true); // Set loading to true
  const [racas, setRacas] = useState<Raca[]>([]); // Initial empty array
  const racaRef = firestore.collection('Raca');
  const [isRefreshing, setIsRefreshing] = useState(true)
  const navigation = useNavigation();

  const listartodos = () => {
   
  }

  useEffect(() => {
    const subscriber = racaRef
    .onSnapshot((querySnapshot) => {
      const racas = [];
      querySnapshot.forEach((documentSnapshot) => {
        racas.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setRacas(racas);

      setLoading(false);
      setIsRefreshing(false)
    });
  return () => subscriber();
  }, [racas]);

  if (loading) {
    return <ActivityIndicator />;
  }




  const abrirRaca = (raca: Raca) => {
   //alert('Aqui tem que passar parametro e para ir para manter Raca')
   navigation.navigate("Manter Raca",  {raca: raca})
  }

  const deleteRaca = async (raca: Raca) => {
    const cancelBtn: AlertButton = { text: 'Cancelar' }
    const deleteBtn: AlertButton = {
      text: 'Apagar',
      onPress: async () => {
        const res = await racaRef.doc(raca.id).delete().then(() => {
          setIsRefreshing(true);
        })

      }
    }

    Alert.alert(`Apagar raca "${raca.raca}?"`, 'Essa ação não pode ser desfeita!', [deleteBtn, cancelBtn])
  }

  const verificador = async (raca: Raca) => {
    let emUso = false;
  
    try {
      const usuariosSnapshot = await firestore.collection('Usuario').get();
  
      for (const usuarioDoc of usuariosSnapshot.docs) {
              
        const macacosRef = usuarioDoc.ref.collection('Macaco');
        const macacosSnapshot = await macacosRef.get();
  
        if (!macacosSnapshot.empty) {
          for (const macacoDoc of macacosSnapshot.docs) {
            const macacoData = macacoDoc.data();
            if (raca.id === macacoData.raca.id) {
              emUso = true;
              break; 
            }
          }
        }
      }
  
      if (!emUso) {
        deleteRaca(raca);
      } else {
        Alert.alert(`Esta raça está em uso`);
      }
    } catch (error) {
      console.error(`Erro ao buscar dados: ${error}`);
    }
  };
  

  const renderRacas = ({ item }: { item: Raca }) => {
    return <View style={MeuEstilo.item} key={item.id}>
      <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, MeuEstilo.listItem]}
        onLongPress={() => verificador(item)}
        onPress={() => { abrirRaca(item) }}
      >
        <View>
          <Text style={MeuEstilo.title}>Raca: {item.raca}</Text>
        </View>
      </Pressable>
    </View>
  }


  return (
    <SafeAreaView style={MeuEstilo.containerlistar}>
      <FlatList
        data={racas}
        renderItem={renderRacas}
        keyExtractor={(item) => item.id}
        onRefresh={() => listartodos()}
        refreshing={isRefreshing}
      />
    </SafeAreaView>
  );
};
export default ListarRacas;
