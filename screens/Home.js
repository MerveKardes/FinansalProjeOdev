// Uygulamanın ana ekranıdır
// kullanıcı girişi başarılı ise bu ekran görüntülenir.
// veritabanındaki tüm bilişim terimleri bu ekranda listelenir.
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { db } from "../Firebase";
import { collection, getDocs } from "@firebase/firestore";
import { ListItem, Avatar, SearchBar } from "react-native-elements";

const HomeScreen = ({ navigation }) => {
  const [list, setList] = React.useState([]); // kelimeleri tutacak state dizidir
  const [loading, setLoading] = React.useState(true); // yükleniyor iconu
  const [searchText, setSearchText] = React.useState(""); // aranacak kelime bilgisini tutan state
  const [filteredData, setFilteredData] = React.useState([]); // filtrenen listeyi tutar arama sonuçlarını tutar

  // component yüklendiğinde kelimeler databaseden çekilir
  React.useEffect(() => {
    fetchData();
  });

  // yükleniyor simgesini görüntüle
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00acac" />
      </View>
    );
  }

  // kelimeleri veritabanından çek
  async function fetchData() {
    const ref = collection(db, "kelimeler");
    const data = await getDocs(ref);

    // tüm kelimeler firestoredan alınıyor.
    // flatlist içerisinde göstermek için list isimli state dolduruluyor.
    setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    // işlem bittiğinde yükleniyor resmi gizleniyor.
    setLoading(false); // yükleniyor iconunu kapat    
  }

  // aranacak metni tutan ve kelimeler listesinde arama yapan fonksiyon
  function search(searchText) {
    setSearchText(searchText);
    let filteredData = list.filter(function (item) {
      return item.kelime.includes(searchText);
    });
    setFilteredData(filteredData);
  }

  // kelimeler listesinin öğelerini render eder
  function renderItem({ item }) {
    return (
      <ListItem
        key={item}
        bottomDivider
        onPress={() => {
          // kelimeye tıklandığında kelime detayına gider
          // parametre olarak key, aciklama, kelime ve harf gönderilir.
          navigation.navigate("WordDetail", {
            key: item.key,
            aciklama: item.aciklama,
            kelime: item.kelime,
            harf: item.harf,
          });
        }}
      >
        <Avatar
          size="small"
          title={
            item.harf //harf ile avatar oluşturulur görsellik için
          }
          containerStyle={{ backgroundColor: "gray" }}
        />
        <ListItem.Content>
          <ListItem.Title>{item.kelime}</ListItem.Title>
          <ListItem.Subtitle>
            <View>
              <Text>
                {
                  item.aciklama.substring(
                    0,
                    50
                  ) /**aciklama kısmına kelime açıklamasının 50 karakteri getirilir */
                }
              </Text>
            </View>
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  }

  return (
    <SafeAreaView>
      <SearchBar // arama barı
        round={true}
        lightTheme={true}
        placeholder="Kelime Ara..."
        autoCapitalize="words"
        autoCorrect={false}
        onChangeText={search}
        value={searchText}
      />

      <FlatList
        extraData={
          filteredData && filteredData.length > 0 ? filteredData : list
        }
        data={filteredData && filteredData.length > 0 ? filteredData : list}
        renderItem={renderItem}
        keyExtractor={(item) => item.kelime}
        refreshing={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
