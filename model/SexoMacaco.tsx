import React, { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

const DATA = [
    {
        id: "1",
        sexo: "Macho",
    },
    {
        id: "2",
        sexo: "Femea",
    },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.sexo, textColor]}>{item.sexo}</Text>
    </TouchableOpacity>
);

const Lista = (props) => {
    const [selectedId, setSelectedId] = useState(null);

    const closeModal = (bool, item) => {
        props.setModalListaVisible(bool);
        props.setItemLista(item);
    };

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#6e3b" : "white";
        const color = item.id === selectedId ? "white" : "black";

        return (
            <Item
                item={item}
                //onPress={() => setSelectedId(item.id)}
                onPress={() => closeModal(false, item)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    sexo: {
        fontSize: 32,
    },
});

export default Lista;
