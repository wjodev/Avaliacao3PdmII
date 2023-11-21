import { useNavigation } from "@react-navigation/core";

import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View, FlatList, Text, StatusBar, AlertButton, Alert, Pressable, } from "react-native";
import { auth, firestore } from "../../firebase";
import MeuEstilo from "../../meuestilo";
import { Pelagem } from "../../Model/Pelagem";

const ListarPelagems = () => {
  const [loading, setLoading] = useState(true); // Set loading to true
  const [pelagems, setPelagems] = useState<Pelagem[]>([]); // Initial empty array
  const pelagemRef = firestore.collection('Pelagem');
  const [isRefreshing, setIsRefreshing] = useState(true)
  const navigation = useNavigation();

  const listartodos = () => {
   
  }

  useEffect(() => {
    const subscriber = pelagemRef
    .onSnapshot((querySnapshot) => {
      const pelagems = [];
      querySnapshot.forEach((documentSnapshot) => {
        pelagems.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setPelagems(pelagems);

      setLoading(false);
      setIsRefreshing(false)
    });
  return () => subscriber();
  }, [pelagems]);

  if (loading) {
    return <ActivityIndicator />;
  }




  const abrirPelagem = (pelagem: Pelagem) => {
   //alert('Aqui tem que passar parametro e para ir para manter Pelagem')
   navigation.navigate("Manter Pelagem",  {pelagem: pelagem})
  }

  const deletePelagem = async (pelagem: Pelagem) => {
    const cancelBtn: AlertButton = { text: 'Cancelar' }
    const deleteBtn: AlertButton = {
      text: 'Apagar',
      onPress: async () => {
        const res = await pelagemRef.doc(pelagem.id).delete().then(() => {
          setIsRefreshing(true);
        })

      }
    }

    Alert.alert(`Apagar pelagem "${pelagem.pelagem}?"`, 'Essa ação não pode ser desfeita!', [deleteBtn, cancelBtn])
  }

  const verificador = async (pelagem: Pelagem) => {
    let emUso = false;
  
    try {
      const usuariosSnapshot = await firestore.collection('Usuario').get();
  
      for (const usuarioDoc of usuariosSnapshot.docs) {

        const macacosRef = usuarioDoc.ref.collection('Macaco');
        const macacosSnapshot = await macacosRef.get();
  
        if (!macacosSnapshot.empty) {
          for (const macacoDoc of macacosSnapshot.docs) {
            const macacoData = macacoDoc.data();

            if (pelagem && macacoData && pelagem.id === macacoData.pelagem?.id) {
              emUso = true;
              break;
            }
          }
        }
      }
  
      if (!emUso) {
        deletePelagem(pelagem);
      } else {
        Alert.alert(`Esta pelagem está em uso`);
      }
    } catch (error) {
      console.error(`Erro ao buscar dados: ${error}`);
    }
  };

  const renderPelagems = ({ item }: { item: Pelagem }) => {
    return <View style={MeuEstilo.item} key={item.id}>
      <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, MeuEstilo.listItem]}
        onLongPress={() => verificador(item)}
        onPress={() => { abrirPelagem(item) }}
      >
        <View>
          <Text style={MeuEstilo.title}>ID: {item.id}</Text>
          <Text style={MeuEstilo.title}>Pelagem: {item.pelagem}</Text>
        </View>
      </Pressable>
    </View>
  }


  return (
    <SafeAreaView style={MeuEstilo.containerlistar}>
      <FlatList
        data={pelagems}
        renderItem={renderPelagems}
        keyExtractor={(item) => item.id}
        onRefresh={() => listartodos()}
        refreshing={isRefreshing}
      />
    </SafeAreaView>
  );
};
export default ListarPelagems;
