import { Dimensions, StyleSheet } from "react-native";
import { RFValue, } from "react-native-responsive-fontsize";
import { GlobalStyles } from "@/constants/Colors";



const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ObituaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: width > 600 ? "row" : "column",
    paddingTop: 30,
  },
  formSection: {
    flex: 1,
    paddingLeft: width > 600 ? 80 : 0,
    alignItems: width > 600 ? "flex-start" : "center",
    width: "100%",
    gap: "1%",
  },
  modalStyle: {
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
  previewSection: {
    flex: 1,
    position: "relative",
  },
  previewText: {
    fontSize: width > 600 ? RFValue(5) : RFValue(7),
    maxWidth: width > 600 ? 400 : "80%",
    marginTop: 8,
    textAlign: "justify",
  },
  previewName: {
    fontSize: width > 600 ? RFValue(6) : RFValue(8.5),
    fontWeight: "bold",
    marginTop: 8,
    maxWidth: width > 600 ? 400 : '80%',
  },
  previewDate: {
    fontSize: width > 600 ? RFValue(6) : RFValue(8.5),
    marginBottom: 8,
    maxWidth: 400,
    marginTop: 8,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1%",
    flexDirection: "row",
    width: "35%",
    gap: "2%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
    width: "75%",
  },
  updateContactsButton: {
    marginTop: 12,
    width: "75%",
    marginBottom: width > 600 ? 0 : 30
  },
  previewPhrase: {
    marginTop: 15,
    fontSize: width > 600 ? RFValue(6.5) : RFValue(8.5),
    fontStyle: "italic",
    maxWidth: width > 600 ? 400 : "80%",
    justifyContent: "center",
    textAlign: "center",
  },
  overlayContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  templateImage: {
    width: width > 600 ? width * 0.3 : width * 0.9,
    height: width > 600 ? height * 0.86 : height * 0.9,
    resizeMode: "contain",
  },
  overlayContent: {
    position: "absolute",
    top: width > 600 ? "35%" : "43%",
    left: "50%",
    transform: [{ translateX: -width * 0.4 }, { translateY: -height * 0.2 }],
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  customImage: {
    width: width > 600 ? 100 : 60,
    height: width > 600 ? 100 : 60,
    borderRadius: 50,
    marginBottom: 6,
    marginTop: width > 600 ? 0 : "0%",
  },
  button: {
    backgroundColor: GlobalStyles.blue,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  customButtonStyle: {
    marginTop: 12,
    width: "32%",
    height: 40,
  },
  formText: {
    alignSelf: "flex-start",
    marginLeft: width > 600 ? "0%" : "15%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: GlobalStyles.darkGrey,
  },
  gradient: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  colorBox: {
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 60,
    marginTop: 10,
    borderWidth: 1,
  },
  titlePage: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: width > 600 ? "left" : "center",
    width: "100%",
  },
});

export default ObituaryStyles ;