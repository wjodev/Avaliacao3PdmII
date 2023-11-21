import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View, StyleSheet, FlatList, Text, Pressable, } from "react-native";
import { auth, firestore } from "../firebase";
import MeuEstilo from "../meuestilo";
import { Pelagem } from "../model/Pelagem";


export const EscolhePelagem = (props) => {
    const [loading, setLoading] = useState(true); // Set loading to true
    const [pelagens, setPelagens] = useState<Pelagem[]>([]); // Initial empty array
    const [isRefreshing, setIsRefreshing] = useState(true)

    const pelagemRef = firestore.collection('Pelagem');

    useEffect(() => {
        const subscriber = pelagemRef
            .onSnapshot((querySnapshot) => {
                const pelagens = [];
                querySnapshot.forEach((documentSnapshot) => {
                    pelagens.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setPelagens(pelagens);
                setLoading(false);
            });
        return () => subscriber();
    }, [pelagens]);


    if (loading) {
        return <ActivityIndicator />;
    }

    const closeModal = (bool, item) => {
        console.log(item)
        props.setModalPelagemVisible(bool);
        props.setPelagem(item);
    }

    const renderPelagem = ({ item }: { item: Pelagem }) => {
        return <View style={styles.itemCard} key={item.id}>
            <Pressable
                style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, styles.listItem]}
                onLongPress={() => { closeModal(false, item) }}
                //onLongPress={() => deleteTipoUsuario(item)}
                //onPress={() => { editTipoUsuario(item) }}
                onPress={() => { closeModal(false, item) }}
            >
                {/* <Image source={{ uri: item.imageUri }} style={styles.itemImage} /> */}
                <View>
                  
                    <Text>{item.pelagem}</Text>
                </View>
            </Pressable>
        </View>
    }




    return (
        <SafeAreaView style={MeuEstilo.containerlistar}>
            <FlatList
                data={pelagens}
                renderItem={renderPelagem}
                keyExtractor={(item) => item.id}
                refreshing={isRefreshing}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    emptyList: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16
    },
    itemCard: {
        backgroundColor: '#fff',
        shadowColor: '#222222',
        shadowOffset: { height: 1, width: 1 },
    },
    itemImage: {
        width: 64,
        height: 64,
        marginLeft: 10,
        marginRight: 15,
        backgroundColor: '#eee'
    }
})


