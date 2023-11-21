import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ManterMacaco from './ManterMacaco';
import ListarMacaco from './ListarMacaco';
import ListarPelagem from './Pelagem/ListarPelagem';
import ManterPelagem from './Pelagem/ManterPelagem';
import ListarRaca from './Raca/ListarRaca';
import ManterRaca from './Raca/ManterRaca';
import { Raca } from '../model/Raca';
import { Pelagem } from '../model/Pelagem';
import { Macaco } from '../model/Macaco';

function ListarScreen({ navigation }) {
  return (
    <ListarMacaco></ListarMacaco>
  ); 
}
function ManterScreen({ navigation }) {
  return (
    <ManterMacaco></ManterMacaco>
  );
}
function ManterRacaScreen({ navigation }) {
  return (
    <ManterRaca></ManterRaca>
  );
}

function ListarRacaScreen({ navigation }) {
  return (
    <ListarRaca></ListarRaca>
  );
}

function ManterPelagemScreen({ navigation }) {
  return (
    <ManterPelagem></ManterPelagem>
  );
}

function ListarPelagensScreen({ navigation }) {
  return (
    <ListarPelagem></ListarPelagem>
  );
}
const Drawer = createDrawerNavigator();

export default function Menu() {
  return (

    <Drawer.Navigator initialRouteName="Manter Macaco">
      <Drawer.Screen name="Manter Macaco" component={ManterScreen} 
      initialParams={{macaco:new Macaco()}}
      />
      <Drawer.Screen name="Listar Macaco" component={ListarScreen} />
      <Drawer.Screen name="Listar Raças" component={ListarRacaScreen} />
      <Drawer.Screen name="Manter Raca" component={ManterRacaScreen}
      initialParams={{raca:new Raca()}} />
      <Drawer.Screen name="Listar Pelagem" component={ListarPelagensScreen} />
      <Drawer.Screen name="Manter Pelagem" component={ManterPelagemScreen} 
      initialParams={{pelagem: new Pelagem}}/>
      
      
      

    </Drawer.Navigator>

  );
}