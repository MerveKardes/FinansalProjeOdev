// Yönetim ekranı bu ekrana yalnızca admin kullanıcılar erişebilir.
// veritabanına kelime eklemek için kullanılır.
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import { auth, db } from "../Firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  get,
  where,
} from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ekran genişliği alınıyor.
const { width } = Dimensions.get("window");

export default function Admin2({ navigation }) {
  const [kelime, setKelime] = React.useState(""); // kelime state
  const [aciklama, setAciklama] = React.useState(""); // açıklama state
  const [harf, setHarf] = React.useState(""); // harf state
  const [userRole, setUserRole] = React.useState(false); // kullanıcı rolünü tutan state

  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {

    registerForPushNotificationsAsync().then((token) =>{
      console.log(token);
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  React.useEffect(() => {
    // navigation bar başlık ve sağ menü tanımlamaları yapılıyor.
    // saü menüde ana sayfa butonu ekleniyor.
    navigation.setOptions({
      title: "Yönetim Paneli",
      headerRight: () => (
        <TouchableOpacity
          style={{ paddingRight: 20 }}
          onPress={() => {
            navigation.navigate("Anasayfa");
          }}
        >
          <Ionicons name="md-home" size={18} color="blue" />
        </TouchableOpacity>
      ),
    });

    // giriş yapan kullanıcının rolü getiriliyor.
    getUserRole();
  }, [navigation]);

  async function getUserRole() {
    // kullanıcı rolünü getir
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (doc.data().role == "admin") {
        setUserRole(true);
      }
    });
  }

  // girilen kelime, açıklama ve harf bilgilerini firebase rtdb'ye kaydetmek için
  const save = () => {
    // eğer istenilen bilgiler boş ise uyarı ver
    // değilse girilen bilgileri firebae database'e kaydet.
    if (kelime == "" || aciklama == "" || harf == "") {
      alert("Gerekli alanları doldurunuz!");
    } else {
      //kelime favori butonuna tıklandığında veritabanında kelimelerim tablosuna eklenir
      // favori kelimeler ekranında görüntülenir
      const ref = collection(db, "kelimeler");
      addDoc(ref, {
        kelime: kelime,
        harf: harf,
        aciklama: aciklama,
      })
        .then(async (data) => {
          // kayıt işlemi başarılı olduğunda
          setKelime("");
          setAciklama("");
          setHarf("");
          alert("Kelime sözlüğe eklendi!");

          // push notification
          await sendPushNotification(expoPushToken);
        })
        .catch((error) => {
          // kayıt işlemi esnasında hata olduğunda
          alert("Kelime sözlüğe eklenemedi!");
          console.log("error ", error);
        });
    }
  };

  return (
    // bilgi giriş ekranı tasarımı
    <View style={styles.container}>
      {userRole ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Admin");
          }}
        >
          <Text style={styles.title}>Yönetim Paneli</Text>
          <Text style={styles.subTitle}>Kelime Ekle</Text>
          <TextInput
            placeholder="Kelime"
            style={styles.textInputStyle}
            errorStyle={{ color: "red" }}
            underlineColorAndroid="transparent"
            onChangeText={(data) => {
              setKelime(data);
              setHarf(data.substring(0, 1));
            }}
            value={kelime}
            placeholderTextColor="gray"
            autoCapitalize="words"
          />
          <TextInput
            placeholder="Açıklama"
            style={styles.textInputStyle}
            errorStyle={{ color: "red" }}
            underlineColorAndroid="transparent"
            onChangeText={setAciklama}
            value={aciklama}
            placeholderTextColor="gray"
            autoCapitalize="none"
          />
          <View style={{ width: width - 75, height: 45, marginTop: 10 }}>
            <Button onPress={save} title="Kaydet" />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Admin");
          }}
        >
          <Text style={styles.title}>Yönetim Paneli</Text>
          <Text style={styles.subTitle}>Yetkiniz Yok!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Bilişim Terimleri Sözlüğü 📣",
    body: "Yeni Kelime Eklendi!",
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Push bildirimi için push belirteci alınamadı!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log("Üretilen:" + token);
  } else {
    alert("Push Bildirimleri için fiziksel cihaz kullanılmalıdır!");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

// stil tanımlamaları yapılıyor.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInputStyle: {
    width: width - 75,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "lightgray",
    color: "#00aced",
  },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 10 },
  subTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 25 },
});
