import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getAllProducts } from "../../services/product.service";


type Product = {
  id: string;
  product_name: string;
  product_category: string;
  product_price: string;
  product_image: string;
};

const categories = [
  "All",
  "Creatine",
  "Protein",
  "Pre-Workout",
  "Mass Gainer",
  "BCAA",
];

const ProductScreen = () => {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const {data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
  
    queryKey: ["products"],

    initialPageParam: null,

    queryFn: async ({ pageParam }) => {
      console.log("Fetching products with cursor:", pageParam);

      const response = await getAllProducts(pageParam);

      console.log("Product page response:", response);

      return response;
    },


    getNextPageParam: (lastPage) => {
   
      if(!lastPage.data.hasNextPage){
        return undefined;
      }

      return lastPage.data.nextCursor ?? undefined;
    },

  });

  if(isLoading){
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  if(isError){
    return (
      <View style={styles.loadingContainer}>
        <Text>Failed to load products.</Text>
      </View>
    );
  }
  
  const products: Product[] = data?.pages?.flatMap(
    (page) => page?.data?.products ?? []
  ) ?? [];

  // Toggle favorite product
  const toggleFavorite = (productId: string) => {
    setFavorites((previousFavorites) => {
      if (previousFavorites.includes(productId)) {
        return previousFavorites.filter((id) => id !== productId);
      }

      return [...previousFavorites, productId];
    });
  };

  // Search + category filter
  const filteredProducts = products.filter((product) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch = product.product_name
      .toLowerCase()
      .startsWith(searchText);

    const matchesCategory =
      selectedCategory === "All" || product.product_category === selectedCategory;
      
      return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item }: { item: Product }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <Pressable
        style={styles.productCard}
        onPress={() => console.log("Selected:", item.product_name)}
      >
        {/* Favorite Button */}
        <Pressable
          style={styles.favoriteButton}
          onPress={(event) => {
            event.stopPropagation();
            toggleFavorite(item.id);
          }}
          hitSlop={8}
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
            source={{uri:item.product_image}}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Name */}
        <Text
          style={styles.productName}
          numberOfLines={1}
        >
          {item.product_name}
        </Text>

        {/* Category */}
        <Text
          style={styles.category}
          numberOfLines={1}
        >
          {item.product_category}
        </Text>

        {/* Price */}
        <Text style={styles.price}>
          RS {item.product_price}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Gym Supplements
        </Text>

        <Pressable
          style={styles.headerButton}
          onPress={() => router.push("/(tabs)/product-cart")}
        >
          <Ionicons
            name="cart-outline"
            size={21}
            color="#d95778"
          />

          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              2
            </Text>
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
          autoCapitalize="none"
          autoCorrect={false}
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
          {filteredProducts.length} Product
          {filteredProducts.length !== 1 ? "s" : ""} results
        </Text>

        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <Pressable
            style={styles.sortButton}
            onPress={() =>
              setShowCategoryMenu((previous) => !previous)
            }
          >
            <Text
              style={[
                styles.sortText,
                selectedCategory !== "All" &&
                  styles.activeSortText,
              ]}
            >
              {selectedCategory}
            </Text>

            <Ionicons
              name={
                showCategoryMenu
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={12}
              color="#777"
            />
          </Pressable>

          {/* Category Dropdown */}
          {showCategoryMenu && (
            <View style={styles.categoryMenu}>
              {categories.map((category) => {
                const isSelected =
                  selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    style={[
                      styles.categoryOption,
                      isSelected &&
                        styles.selectedCategoryOption,
                    ]}
                    onPress={() => {
                      setSelectedCategory(category);
                      setShowCategoryMenu(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        isSelected &&
                          styles.selectedCategoryOptionText,
                      ]}
                    >
                      {category}
                    </Text>

                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={15}
                        color="#d95778"
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
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

        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}

        onEndReachedThreshold={0.5}

        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.loadingMore}>
              <Text>Loading more products...</Text>
            </View>
          ) : null
        }
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

  /* Header */
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  headerTitle: {
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

  /* Search */
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

  /* Results */
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,

    // Important for dropdown
    zIndex: 20,
    elevation: 20,
  },

  resultText: {
    fontSize: 11,
    color: "#333",
    fontWeight: "600",
  },

  /* Filter */
  filterContainer: {
    position: "relative",
    zIndex: 30,
    elevation: 30,
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

  activeSortText: {
    color: "#d95778",
    fontWeight: "700",
  },

  /* Category Dropdown */
  categoryMenu: {
    position: "absolute",
    top: 32,
    right: 0,
    width: 145,

    backgroundColor: "#ffffff",
    borderRadius: 8,

    paddingVertical: 5,

    borderWidth: 1,
    borderColor: "#eeeeee",

    zIndex: 100,
    elevation: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  categoryOption: {
    height: 36,
    paddingHorizontal: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedCategoryOption: {
    backgroundColor: "#fff7fa",
  },

  categoryOptionText: {
    fontSize: 10,
    color: "#555",
  },

  selectedCategoryOptionText: {
    color: "#d95778",
    fontWeight: "700",
  },

  /* Product Grid */
  productList: {
    paddingBottom: 25,

    // Keep list below dropdown
    zIndex: 1,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  /* Product Card */
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

  loadingMore: {
  paddingVertical: 20,
  alignItems: "center",
  },

});