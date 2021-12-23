// favori kelimeler ekranı
// kullanıcı sözlükten dilediği kelimeyi favori kelimelere ekleyebilmektedir.
// bu ekranda kullanıcının favori kelimeleri listelenmektedir.
// flatlist içerisinde arama yapılabilir.
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ListItem, Avatar, SearchBar } from "react-native-elements";
import { auth, db } from "../Firebase";
import { collection, getDocs, where, query } from "firebase/firestore";

const FavoriteScreen = ({ navigation }) => {
  const [list, setList] = React.useState([]); // favori kelimeleri tutacak state
  const [loading, setLoading] = React.useState(true); // yukleniyor iconunu göster/gizle için kullanılacak state
  const [searchText, setSearchText] = React.useState(""); // flatlist içerisinde aranacak kelimeyi tutacak olan state
  const [filteredData, setFilteredData] = React.useState([]); // arama sonuçlarını tutacak olan state

  // component yüklendiğinde favori kelimeleri çek
  // https://medium.com/@damlaehican/react-hooks-nedir-yeni-ba%C5%9Flayanlar-i%CC%87%C3%A7in-hooks-ile-react-nativede-k%C4%B1sa-bir-%C3%B6rnek-3472b7f11f0c
  React.useEffect(() => {
    fetchData();
  });

  // yükleme devam ediyor ise yükleniyor iconunu görüntüle
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00acac" />
      </View>
    );
  }

  async function fetchData() {
    const ref = collection(db, "kelimelerim");
    const q = query(ref, where("uid", "==", auth.currentUser.uid));
    const data = await getDocs(q);

    // tüm kelimeler firestoredan alınıyor.
    // flatlist içerisinde göstermek için list isimli state dolduruluyor.
    setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    // işlem bittiğinde yükleniyor resmi gizleniyor.
    setLoading(false); // yükleniyor iconunu kapat
  }

  // liste içerisinde kelime arama fonksiyonu
  // favori kelimeler içerisinde girilen kelimeyi anlık olarak arar listeler

  function search(searchText) {
    setSearchText(searchText);

    let filteredData = list.filter(function (item) {
      return item.kelime.includes(searchText);
    });
    setFilteredData(filteredData);
  }

  // flatlist itemlarını render edecek fonksiyon
  // db'den gelen favori kelimeleri flatlist rowlarına çevirir
  function renderItem({ item }) {
    return (
      <ListItem
        key={item.id}
        bottomDivider
        onPress={() => {
          console.log(item);
          //kelimeye tıklandığında favori kelime detay ekranı açılır.
          // parametre olarak key, kelime, aciklama, favori bilgileri taşınır.
          navigation.navigate("FavoriteWordDetail", {
            key: item.id,
            aciklama: item.aciklama,
            kelime: item.kelime,
            favori: true,
          });
        }}
      >
        <Avatar
          size="small"
          title={item.harf.toUpperCase()}
          containerStyle={{ backgroundColor: "gray" }}
        />
        <ListItem.Content>
          <ListItem.Title>{item.kelime}</ListItem.Title>
          <ListItem.Subtitle>
            <View>
              <Text>{item.aciklama.substring(0, 50)}</Text>
            </View>
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  }

  return (
    <SafeAreaView>
      <SearchBar
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
          // anlık eklenen kelimeler olabilir bu kelimeleri direk listeye eklemek için listeyi sürekli kontrol eder
          filteredData && filteredData.length > 0 ? filteredData : list
        }
        data={filteredData && filteredData.length > 0 ? filteredData : list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={false}
      />
    </SafeAreaView>
  );
};

export default FavoriteScreen;
