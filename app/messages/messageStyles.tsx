import { StyleSheet, Dimensions } from 'react-native';
import { GlobalStyles } from "@/constants/Colors";
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();

const messageStyles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexGrow: 1,
    flexDirection: width > 600 ? 'row' : 'column',
    justifyContent: 'space-between',
    padding: "1%",
  },
  formContainer: {
    width: width > 600 ? '45%' : "100%",
    justifyContent: 'flex-start',
    padding: 20,
    gap: 8,
  },
  mediaContainer: {
    width: width > 600 ? '55%' : "100%",
    padding: 20,
  },
  mediaVisualizer: {
    borderWidth: 5,
    borderColor: GlobalStyles.lightGrey,
    height: width > 600 ? "65%" : 400,
    borderRadius: 10,
    marginTop: 30,
  },
  mediaItems: {
    height: width > 600 ? "25%" : 100,
    borderColor: GlobalStyles.lightGrey,
    borderWidth: 5,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: 'row',
  },
  customImage: {
    width: width > 600 ? 140 : 60,
    height: width > 600 ? 140 : 60,
    borderRadius: 10,
    margin: 20,
  },
  selectedMedia: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: "contain",
  },
  textArea: {
    width: '100%',
    height: 500,
    textAlignVertical: 'top',
    borderRadius: 12,
    padding: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    gap: '2%',
    marginTop: 30,
    justifyContent: 'center'
  },
  previewMessage: {
    textAlign: 'center',
    fontSize: 30,
    alignContent: 'center',
    justifyContent: 'center',
    color: 'grey',
    flex: 1,
  },
  textTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selecContactButton: {
    width: '50%',
    marginTop: 12,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    width: '8%',
    alignSelf: 'center',
    marginLeft: 10,
    height: 35
  },
  customButton1: {
    width: '32%',
    alignSelf: 'center',
  },
  customButton2: {
    width: '32%',
    alignSelf: 'center',
    backgroundColor: GlobalStyles.grey,
  },
  customButton3: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: GlobalStyles.grey,
  },

  //Contact modal styles

  modalContactContainer: {
    padding: 20,
    backgroundColor: GlobalStyles.white,
    borderRadius: 10,
    width: "80%",
    alignSelf: 'center',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '10%',
    left: '10%',
    height: "60%",
    borderWidth: 5,
    borderColor: GlobalStyles.lightGrey,
  },
  contactContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: width > 600 ? "100%" : 1000,
    marginBottom: 10,
    flexDirection: width > 600 ? "row" : "column",
    gap: 10,  
  },
  input: {
    width: 250,
    marginVertical: 5,
  },
  contactNumber: {
    marginRight: 8,
    fontWeight: "bold",
    fontSize: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
    borderRadius: 10,
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: GlobalStyles.blue,
    overflow: "hidden",
    width: "100%",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexWrap: "nowrap",
  },
  actionCell: {
    flex: 1,
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.6,
    color: "#fff",
    fontWeight: "bold",
  },
  editButton: {
    alignSelf: "center",
    width: width > 600 ? "20%" : "50%",
  },
  tableContainer: {
    flex: 1,
    padding: 10,
    overflow: "hidden",
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: width > 600 ? 20 : 0,
  },
  headerCell: {
    fontWeight: "bold",
    width: "25%",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 10,
    flex: 1,
  },
  contactTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  codeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,

  },
  codeContainer: {
    width: width > 600 ? '100%' : "100%",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 20,
    marginTop: 20,
  },
  modalStyle2: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: width > 600 ? "40%" : "80%",
  },
  buttonContainer2: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1%",
    flexDirection: "row",
    width: "35%",
    gap: "2%",
  },
  button2: {
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default messageStyles;