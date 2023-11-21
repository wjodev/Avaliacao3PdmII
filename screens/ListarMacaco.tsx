import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View, FlatList, Text, StatusBar, Pressable, Image, AlertButton, Alert } from "react-native";
import { auth, firestore } from "../firebase";
import meuestilo from "../meuestilo";
import { Macaco } from "../model/Macaco";
import { useNavigation } from "@react-navigation/core";
import storage from '@react-native-firebase/storage';


const ListarMacaco = () => {
  const [loading, setLoading] = useState(true); // Set loading to true
  const [macacos, setMacacos] = useState<Macaco[]>([]); // Initial empty array
  const [formMacaco, setFormMacaco] = useState<Partial<Macaco>>({})
  const [isRefreshing, setIsRefreshing] = useState(true)
  const navigation = useNavigation();
  const MacacoRef =
    firestore.collection('Usuario').doc(auth.currentUser?.uid)
      .collection('Macaco')

  useEffect(() => {
    const subscriber = MacacoRef
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
      });
    return () => subscriber();
  }, [macacos]);


  if (loading) {
    return <ActivityIndicator />;
  }
  const limparFormulario = () => {
    setFormMacaco({})
  }

  const deleteMacaco = async (macaco: Macaco) => {
    const cancelBtn: AlertButton = { text: 'Cancelar' };
    const deleteBtn: AlertButton = {
      text: 'Apagar',
      onPress: async () => {
        try {
          await MacacoRef.doc(macaco.id).delete();
          const imagemRef = storage().refFromURL(macaco.urlfoto);
          await imagemRef.delete();
          
          setIsRefreshing(true);
        } catch (error) {
          console.error('Erro ao excluir macaco ou imagem:', error);
        }
      },
    };
  

    Alert.alert(`Apagar macaco "${macaco.nome}?"`, 'Essa ação não pode ser desfeita!', [deleteBtn, cancelBtn])
  }

  const editarMacaco = (macaco: Macaco) => {
    //alert('Aqui tem que passar parametro e para ir para manter Raca')
    navigation.navigate("Manter Macaco",  {macaco: macaco})
   }



  const renderItem = ({ item }) => {
    return <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {/* <View style={meuestilo.item} key={item.id}> */}
      <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, meuestilo.title]}
        onLongPress={() => deleteMacaco(item)}
        onPress={() => { editarMacaco(item) }}
      >


        <View style={meuestilo.alinhamentoLinha}>
          <Image style={{ height: 70, width: 70, borderRadius: 50 }} source={{ uri: item.urlfoto }} />
          <View style={meuestilo.alinhamentoColuna}>
            <Text style={meuestilo.title}>Nome: {item.nome}</Text>
            <Text style={meuestilo.title}> Sexo: {item.sexo}</Text>
            <Text style={meuestilo.title}> Pelagem: {item.pelagem.pelagem}</Text>
            <Text style={meuestilo.title}> Raça: {item.raca.raca}</Text>
            {/* fecha alinhamento colunas */}
          </View>
          {/* fecha alinhamento linhas */}
        </View>
      </Pressable>
    </View>
  }


  return (
    <SafeAreaView style={meuestilo.containerlistar}>
      <FlatList
        data={macacos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};
export default ListarMacaco;
