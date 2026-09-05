import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

const products = [
  {
    id: "1",
    name: "Creatine Monohydrate",
    category: "Creatine",
    price: "24.99",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
  },
  {
    id: "2",
    name: "Pre-Workout Blast",
    category: "Pre-Workout",
    price: "19.99",
    image:
      "https://images.unsplash.com/photo-1594737625785-c9d6c9d2b3a8?w=500",
  },
  {
    id: "3",
    name: "Whey Protein",
    category: "Protein",
    price: "39.99",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
  },
  {
    id: "4",
    name: "Mass Gainer",
    category: "Mass Gainer",
    price: "44.99",
    image:
      "https://images.unsplash.com/photo-1622484211148-58a0c3c3a6b6?w=500",
  },
  {
    id: "5",
    name: "BCAA Recovery",
    category: "BCAA",
    price: "18.50",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
  },
  {
    id: "6",
    name: "Isolate Protein",
    category: "Protein",
    price: "49.99",
    image:
      "https://images.unsplash.com/photo-1622484211148-58a0c3c3a6b6?w=500",
  },
  {
    id: "7",
    name: "Creatine Monohydrate",
    category: "Creatine",
    price: "24.99",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
  },
  {
    id: "8",
    name: "Pre-Workout Blast",
    category: "Pre-Workout",
    price: "19.99",
    image:
      "https://images.unsplash.com/photo-1594737625785-c9d6c9d2b3a8?w=500",
  },
  {
    id: "9",
    name: "Whey Protein",
    category: "Protein",
    price: "39.99",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
  },
  {
    id: "10",
    name: "Mass Gainer",
    category: "Mass Gainer",
    price: "44.99",
    image:
      "https://images.unsplash.com/photo-1622484211148-58a0c3c3a6b6?w=500",
  },
  {
    id: "11",
    name: "BCAA Recovery",
    category: "BCAA",
    price: "18.50",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
  },
  {
    id: "12",
    name: "Isolate Protein",
    category: "Protein",
    price: "49.99",
    image:
      "https://images.unsplash.com/photo-1622484211148-58a0c3c3a6b6?w=500",
  },
];

const ProductScreen = () => {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const renderProduct = ({ item }: any) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <Pressable
        style={styles.productCard}
        onPress={() => console.log("Selected:", item.name)}
      >
        {/* Favorite */}
        <Pressable
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={17}
            color={isFavorite ? "#e94d70" : "#aaa"}
          />
        </Pressable>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Name */}
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Category */}
        <Text style={styles.category}>{item.category}</Text>

        {/* Price */}
        <Text style={styles.price}>
          $ {item.price}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
    
        <Text style={styles.headerTitle}>Gym Supplements</Text>

        <Pressable
          style={styles.headerButton}
          onPress={() => router.push("/../screens/navigationbar/ProductCart")}
        >
          <Ionicons
            name="cart-outline"
            size={21}
            color="#d95778"
          />

          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search supplements..."
          placeholderTextColor="#b8b8b8"
          style={styles.searchInput}
        />

        <Ionicons
          name="search-outline"
          size={20}
          color="#858585"
        />
      </View>

      {/* Results Header */}
      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>
          {filteredProducts.length} Product results
        </Text>

        <Pressable style={styles.sortButton}>
          <Text style={styles.sortText}>Sort by</Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color="#777"
          />
        </Pressable>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        />
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 19,
    paddingTop: 20,
  },

  // Header
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  headerTitle: {
    textAlign: "center",
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#292929",
  },

  headerButton: {
    position: "absolute",
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#eadde2",
    alignItems: "center",
    justifyContent: "center",
  },

  cartBadge: {
    position: "absolute",
    right: -4,
    top: -5,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#e95778",
    alignItems: "center",
    justifyContent: "center",
  },

  cartBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "700",
  },

  // Search
  searchContainer: {
    height: 40,
    backgroundColor: "#f7f7f7",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    fontSize: 11,
    color: "#333",
    paddingVertical: 0,
  },

  // Results
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  resultText: {
    fontSize: 11,
    color: "#333",
    fontWeight: "600",
  },

  sortButton: {
    height: 27,
    minWidth: 48,
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  sortText: {
    fontSize: 9,
    color: "#777",
  },

  // Grid
  productList: {
    paddingBottom: 25,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  // Product Card
  productCard: {
    width: "48%",
    height: 177,
    backgroundColor: "#fff7fa",
    borderRadius: 8,
    padding: 9,
    position: "relative",
    alignItems: "center",
  },

  favoriteButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 10,
  },

  imageContainer: {
    width: "100%",
    height: 95,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },

  productImage: {
    width: 85,
    height: 90,
  },

  productName: {
    width: "100%",
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#292929",
    marginTop: 3,
  },

  category: {
    fontSize: 9,
    color: "#999",
    marginTop: 3,
  },

  price: {
    fontSize: 11,
    fontWeight: "700",
    color: "#222",
    marginTop: 6,
  },
});