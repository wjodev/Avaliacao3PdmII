import { StyleSheet, StatusBar } from 'react-native'
export default StyleSheet.create({
  container: {
    flex: 1,
    //   justifyContent: 'center',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  inputContainer: {
    flex: 1,
    width: '95%',
    // justifyContent: 'center',
    padding: 30,
    // alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },


  //ESTILO DO LISTAR
  containerlistar: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: '#0782F9',
    borderWidth: 2,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    color: '#0782F9',
    fontWeight: '700',
  },

  // ESTILO DA LISTAGEM COM FILTRO
  containerlistarcomfiltro: {
    paddingTop: 40,
    backgroundColor: 'white',
  },

  itemStyle: {
    backgroundColor: '#0066CC',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    color: 'white',
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#0066CC',
  },

  // estilo data pikker
  pickedDateContainer: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  pickedDate: {
    alignItems: 'center',
    fontSize: 16,
    color: 'black',
  },
  btnContainer: {
    padding: 10,
  },
  // This only works on iOS
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  // novoconteirnerData
  dataConteirner: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',


  },
  iconePicker: {
    backgroundColor: "green",
    height: 10,
    width: 150,
  },
  TextoPiker: {
    backgroundColor: "blue",
    height: 100,
    flex: 1,
  },

  conteinerRelatorio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '1%',
    alignItems: 'center',
    alignContent: 'space-between',
  },

  // modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 40,
    padding: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#0782F9",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  imageContainer: {
    // padding: 30,
    alignContent: "center",
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    resizeMode: "cover",
  },
  alinhamentoLinha: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 65,
    borderColor: '#0782F9',
    borderWidth: 2,
    borderRadius: 10,

  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: '#0782F9',
    borderWidth: 2,
    borderRadius: 10,
  },
  alinhamentoColuna: {
    flexDirection: 'column',
    justifyContent: 'flex-start',


  },
  separador: {
    height: 1,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
  containerflat: {
    backgroundColor: 'white',
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 10
  },
  itemStylefirebase: {
    fontSize: 12,
    padding: 5,
  },
})