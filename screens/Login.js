// firebase auth kullanılarak hazırlanan kullanıcı giriş sayfası
import React from "react";
import {
  Text,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { StackActions } from "@react-navigation/native";
import styles from "../styles/LoginStyle";
import { auth } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// ekranın genişlik bilgisi alınıyor.
const { width } = Dimensions.get("window");

export default class LoginScreen extends React.Component {
  state = {
    email: "", // kullanıcı mail
    password: "", // kullanıcı şifre
  };

  loginApp = () => {
    if (
      // eğer email ve şifre boş veya null ise uyarı verir.
      this.state.email == null ||
      this.state.email == "" ||
      this.state.password == null ||
      this.state.password == ""
    ) {
      Alert.alert("Hata", "Kullanıcı Adı veya Şifre boş geçilemez!", [
        { text: "Tamam" },
      ]);
    } else {
      // eğer değilse yukleniyor iconu kaldır
      this.setState({ loading: false });
      // firebase auth ile email ve şifreye karşılık gelen kullanıcı olup olmadığını kontrol et.
      signInWithEmailAndPassword(
        auth,
        this.state.email,
        this.state.password
      ).catch((err) => {
        this.setState({ loading: false });
        if (err.code === "auth/user-not-found") {
          // kullanıcı bulunamadı ise hata uyarısı ver
          Alert.alert(
            "Oops",
            "Eposta adresi ile kayıtlı kullanıcı bulunamadı!",
            [{ text: "Tamam" }]
          );
        } else if (err.code === "auth/wrong-password") {
          // şifre yanlış ise hata mesajı göster
          Alert.alert("Oops", "Şifreniz hatalıdır!", [{ text: "Tamam" }]);
        } else {
          // bunların dışında bir hata meydana geldi ise hata mesajını görüntüle
          Alert.alert("Oops", "Bilinmeyen hata!\n" + err.message, [
            { text: "Tamam" },
          ]);
        }
      });
    }
  };

  // kullanıcı kayıtlı değil ise kayıt olmak için kayıt ol butonuna tıklandığında çalışır
  // kullanıcı kayıt sayfasında yönlendirir
  goSignUp = () => {
    const pushAction = StackActions.push("CreateAccount");
    this.props.navigation.dispatch(pushAction);
  };

  render() {
    return (
      // kullancıı giriş form tanımlamaları
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
          <View
            style={styles.loginForm}
          >
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
                Giriş
              </Text>
            </View>
            <Input
              placeholder="E-posta adresi"
              style={{
                width: width,
                paddingVertical: 5,
                borderBottomWidth: 0.5,
                borderColor: "#FFF",
                color: "#FFF",
              }}
              errorStyle={{ color: "red" }}
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
                paddingVertical: 5,
                borderBottomWidth: 0.5,
                borderColor: "#FFF",
                color: "#FFF",
              }}
              underlineColorAndroid="transparent"
              onChangeText={(password) => this.setState({ password: password })}
              value={this.state.password}
              secureTextEntry
              placeholderTextColor="#000"
            />
              <Button // kullanıcı girişr butonu tıklandığında loginApp fonk çalışır.
                onPress={() => this.loginApp()}
                title="Giriş"
                buttonStyle={{
                  width: width,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
             <View style={{ alignItems: "center", justifyContent:"center" }}>
              <TouchableOpacity
                onPress={() => this.goSignUp()}
                style={{ marginTop: 15 }}
              >
                <Text style={{ fontSize: 12, color: "#000" }}>
                  Hesabın mı yok?{" "}
                  <Text
                    style={{ fontWeight: "bold", fontSize: 12, color: "#000" }}
                  >
                    Kayıt Ol!
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

