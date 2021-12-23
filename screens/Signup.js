// kullanıcı kayıt ekranı
import React from "react";
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { StackActions } from "@react-navigation/native";
import styles from "../styles/LoginStyle";
import { auth, db } from "../Firebase";
import { collection, addDoc } from "@firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// ekran genişliğini al
const { width, height } = Dimensions.get("window");

export default class SignUpScreen extends React.Component {
  state = {
    email: "", // email bilgisini tutacak state
    name: "", // ad soyad bilgisini tutacak state
    password: "", // şifre bilgisini tutacak state
    phoneNumber: "", // telefon bilgisini tutacak state
  };

  // yeni kullanıcı oluşturacak fonksiyon
  // firebase auth kullanıldı
  signUpApp = () => {
    // email ve şifre ile kullanıcıyı kayıt et
    createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
      .then((userCredential) => {
        // Kullanıcı ekleme işlemi başarılı ve otomatik giriş yapıldı
        const newUser = userCredential.user;

        // yeni eklenen kullanıcının profil bilgilerini güncelle
        updateProfile(newUser, {
          displayName: this.state.name,
        });

        // firestore'a yeni kullanıcıyı ekle
        this.createUser(newUser.uid);
      })
      .catch((err) => {
        // hata olursa uyarı ver
        this.setState({ loading: false });
        console.log(err);
      });
  };

  // firebase veritabanında kullanıcı oluşturan fonksiyon
  // veritabanında oluşturmamızı sebebi rol tanımı yapabilmek firebase auth role tanımı desteklemez???
  createUser = async (uid) => {
    const ref = collection(db, "users");
    await addDoc(ref, {
      email: this.state.email,
      uid: uid,
      name: this.state.name,
      role: "user",
      token: "expo-token",
      phoneNumber: this.state.phoneNumber,
      creationTime: new Date().toLocaleString(),
    });
  };

  render() {
    return (
      // görsel arayüz tanımı
      <View
        style={{
          flex: 1,
        }}
      >
        <ImageBackground
          source={require("../assets/login_background.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.signForm}>
            <Text style={styles.logoText}>Bilişim Terimleri Sözlüğü</Text>
            <View
              style={{
                width: width,
                alignContent: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Kayıt Ol
              </Text>
            </View>
            <View
              style={{
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Input
                placeholder="Ad Soyad"
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 0.5,
                  borderColor: "#FFF",
                  color: "#000",
                }}
                underlineColorAndroid="transparent"
                onChangeText={(name) => this.setState({ name: name })}
                value={this.state.name}
                placeholderTextColor="#000"
              />
              <Input
                placeholder="Telefon"
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 0.5,
                  borderColor: "#FFF",
                  color: "#000",
                }}
                underlineColorAndroid="transparent"
                onChangeText={(phoneNumber) =>
                  this.setState({ phoneNumber: phoneNumber })
                }
                value={this.state.phoneNumber}
                placeholderTextColor="#000"
              />
              <Input
                placeholder="E-posta"
                style={{
                  width: width,
                  paddingVertical: 5,
                  borderBottomWidth: 0.5,
                  borderColor: "#FFF",
                  color: "#000",
                }}
                underlineColorAndroid="transparent"
                onChangeText={(email) => this.setState({ email: email })}
                value={this.state.email}
                keyboardType="email-address"
                placeholderTextColor="#000"
                autoCapitalize="none"
              />
              <Input
                placeholder="Şifre"
                style={{
                  width: width,
                  paddingVertical: 5,
                  borderBottomWidth: 0.5,
                  borderColor: "#FFF",
                  color: "#000",
                }}
                underlineColorAndroid="transparent"
                onChangeText={(password) =>
                  this.setState({ password: password })
                }
                value={this.state.password}
                secureTextEntry
                placeholderTextColor="#000"
              />
            </View>
            <Button
                onPress={() => this.signUpApp()}
                title="Kayıt"
                buttonStyle={{
                  width: width,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={{ marginTop: 15, color: "#000" }}
                onPress={
                  /*buradaki butona tıklandığında giriş ekranına yönlendirilir*/ () =>
                    this.props.navigation.dispatch(StackActions.pop(1))
                }
              >
                <Text style={{ fontSize: 12, color: "#000" }}>
                  Hesabınız var mı?{" "}
                  <Text
                    style={{ fontWeight: "bold", fontSize: 12, color: "#000" }}
                  >
                    Giriş Yap
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
