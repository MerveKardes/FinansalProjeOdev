// ekrana yükleniyor iconu getiren component
import React from "react";
import { AuthContext } from "../context";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";

const LogoutScreen = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext); // çıkış fonk contextten eriş
  return (
    <View style={styles.container}>
      <Card style={{ width: "%80", justifyContent: "center" }}>
        <Card.Title>Güvenli Çıkış</Card.Title>
        <Card.Divider />
        <Text style={styles.question}>
          Oturumu sonlandırmak istiyor musunuz?
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity style={styles.buttonYes} onPress={() => signOut()}>
            <Text style={styles.buttonText}>Evet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonNo}
            onPress={() => {
              navigation.navigate("Anasayfa");
            }}
          >
            <Text style={styles.buttonText}>Hayır</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};

export default LogoutScreen;

// stil tanımlamaları yapılıyor.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  question: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonYes: {    
    alignItems: "center",
    width: "50%",
    backgroundColor: "#FF0000",
    padding: 10,
  },
  buttonNo: {
    alignItems: "center",
    backgroundColor: "#00AA00",
    padding: 10,
    width: "50%",
    marginLeft: 10,
  },
  buttonText:{
    fontWeight:"bold",
    color: "#fff"
  }
});
