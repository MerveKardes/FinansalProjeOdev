// kelime detay ekranı listeden seçilen kelimenin detayalrını görüntüler
import React from "react";
import {
  Share,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from "react-native";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../Firebase";
import { addDoc, collection } from "firebase/firestore";

export default function WordDetail({ route, navigation }) {
  const { harf, kelime, aciklama, favori } = route.params; // kelimeler ekranından gelen parametreler alınır

  React.useEffect(() => {
    navigation.setOptions({ title: kelime }); // navigation bar ayarları set edilir. burada başlık kelime olarak set edildi.
  }, []);

  // paylaş butonuna basıldığında çalışan fonksiyon
  // bu butona tıklandığında paylaşım ekranı gelir.
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: kelime + ": " + aciklama + "\n Bilişim Terimleri Sözlüğü",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
        // iptal edilirse
      }
    } catch (error) {
      //hata alındı ise uyarı verir
      alert(error.message);
    }
  };

  // // rastgele guid üretir
  // function uuidv4() {
  //   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
  //     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  //   );
  // }


  return (
    // ekran tasarımı
    <View>
      <Card>
        <Card.Title>{JSON.stringify(kelime)}</Card.Title>
        <Card.Divider />
        <Text style={{ paddingBottom: 25, textAlign: "center" }}>
          {JSON.stringify(aciklama)}
        </Text>
        <Card.Divider />
        <View style={styles.boxW}>
          <View style={styles.box}>
            <View style={styles.boxIn}>
              <TouchableHighlight
                onPress={() => {
                  //kelime favori butonuna tıklandığında veritabanında kelimelerim tablosuna eklenir
                  // favori kelimeler ekranında görüntülenir
                  const ref = collection(db, "kelimelerim");
                  addDoc(ref, {
                    kelime: kelime,
                    harf: harf,
                    aciklama: aciklama,
                    uid: auth.currentUser.uid,
                    creationTime: new Date().toLocaleString()
                  }).then((data) => {
                      //verilerin kaydı başarılı ise uyarı ver
                      alert("Kelime favorilere eklendi");
                    })
                      .catch((error) => {
                        //hata alındığında
                        console.log("error ", error);
                      });

                  // set(ref(db, 'kelimelerim/' + auth.currentUser.uid + "/" + uuidv4()), {
                  //   kelime: kelime,
                  //   harf: harf,
                  //   aciklama: aciklama,
                  //   creationTime: new Date().toLocaleString()
                  // }).then((data) => {
                  //   //verilerin kaydı başarılı ise uyarı ver
                  //   alert("Kelime favorilere eklendi");
                  // })
                  //   .catch((error) => {
                  //     //hata alındığında
                  //     console.log("error ", error);
                  //   });
                }}
              >
                {favori ? ( // kelime favorilerde ise içi dolu kalp iconu ekle değilse boş kalp iconu
                  <View>
                    <Icon name="heart" size={24} color="pink" />
                  </View>
                ) : (
                  <View>
                    <Icon name="heart-outline" size={24} color="pink" />
                  </View>
                )}
              </TouchableHighlight>
              <TouchableHighlight onPress={onShare}>
                <View>
                  <Icon name="share-social-outline" size={24} color="blue" />
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}

// stil tanımlamaları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flex: 1,
  },
  boxW: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  box: {
    width: "25%",
    backgroundColor: "white",
  },
  boxIn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
