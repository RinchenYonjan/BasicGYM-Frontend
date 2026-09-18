import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getProductById } from "../../services/product.service";


export default function ProductDetailScreen() {

  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const { addToCart } = useCart();

  const {data: product, isLoading, isError} = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  
  // Quantity
  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
  };

  // Add to cart
  const handleAddToCart = () => {
    
    if (!product) return;
    addToCart(
    {
      id: String(product.id),
      name: product.product_name,
      category: product.product_category,
      price: Number(product.product_price),
      image: {uri: product.product_image},
    },
      quantity
    );
    
    Alert.alert(
      "Added to Cart",
      `${product.product_name} has been added to your cart.`
    );

  };

  // Loading
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d95778" />

        <Text style={styles.loadingText}>
          Loading product...
        </Text>
      </View>
    );
  }

  // Error
  if (isError || !product) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Ionicons
            name="alert-circle-outline"
            size={45}
            color="#d95778"
          />
        </View>

        <Text style={styles.errorTitle}>
          Unable to load product
        </Text>

        <Text style={styles.errorText}>
          Something went wrong while loading this product.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={17}
            color="#fff"
          />

          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const price = Number(product.product_price);
  const totalPrice = price * quantity;

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>

          <Pressable
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#111"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Product Details
          </Text>

          <Pressable
            style={styles.iconButton}
            onPress={() =>
              setIsFavorite((previous) => !previous)
            }
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#d95778" : "#111"}
            />
          </Pressable>

        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>

          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>
              {product.product_category}
            </Text>
          </View>

          <Image
            source={{
              uri: product.product_image,
            }}
            style={styles.image}
            resizeMode="contain"
          />

        </View>

        {/* Product Content */}
        <View style={styles.content}>

          {/* Category */}
          <Text style={styles.category}>
            {product.product_category}
          </Text>

          {/* Name */}
          <Text style={styles.name}>
            {product.product_name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>

            <View style={styles.ratingBox}>

              <Ionicons
                name="star"
                size={15}
                color="#F5A623"
              />

              <Text style={styles.ratingText}>
                4.8
              </Text>

            </View>

            <Text style={styles.reviewText}>
              120 Reviews
            </Text>

          </View>

          {/* Price */}
          <Text style={styles.price}>
            Rs {price.toFixed(2)}
          </Text>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>
            About this product
          </Text>

          <Text style={styles.description}>
            High-quality {product.product_name} designed
            to support your fitness goals. Perfect for
            your daily training and workout routine.
          </Text>

          {/* Benefits */}
          <View style={styles.benefitsCard}>

            <View style={styles.benefitRow}>

              <View style={styles.benefitIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={19}
                  color="#d95778"
                />
              </View>

              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>
                  Quality Product
                </Text>

                <Text style={styles.benefitText}>
                  Carefully selected products
                </Text>
              </View>

            </View>

            <View style={styles.benefitRow}>

              <View style={styles.benefitIcon}>
                <Ionicons
                  name="car-outline"
                  size={19}
                  color="#d95778"
                />
              </View>

              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>
                  Fast Delivery
                </Text>

                <Text style={styles.benefitText}>
                  Delivered to your doorstep
                </Text>
              </View>

            </View>

            <View style={styles.benefitRow}>

              <View style={styles.benefitIcon}>
                <Ionicons
                  name="refresh-outline"
                  size={19}
                  color="#d95778"
                />
              </View>

              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>
                  Easy Returns
                </Text>

                <Text style={styles.benefitText}>
                  Hassle-free return policy
                </Text>
              </View>

            </View>

          </View>

          {/* Quantity */}
          <View style={styles.quantityRow}>

            <View>
              <Text style={styles.sectionTitle}>
                Quantity
              </Text>

              <Text style={styles.quantitySubText}>
                Select the number of items
              </Text>
            </View>

            <View style={styles.quantityContainer}>

              <Pressable
                style={styles.quantityButton}
                onPress={decreaseQuantity}
              >
                <Ionicons
                  name="remove"
                  size={17}
                  color="#111"
                />
              </Pressable>

              <Text style={styles.quantityText}>
                {quantity}
              </Text>

              <Pressable
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <Ionicons
                  name="add"
                  size={17}
                  color="#111"
                />
              </Pressable>

            </View>

          </View>

        </View>

      </ScrollView>

      {/* Bottom Purchase Bar */}
      <View style={styles.bottomBar}>

        <View style={styles.actionButtons}>

          {/* Cart */}
          <Pressable
            style={styles.cartButton}
            onPress={handleAddToCart}
          >
            <Ionicons
              name="cart-outline"
              size={21}
              color="#d95778"
            />

            <Text style={styles.cartButtonText}>
              Add to Cart
            </Text>
          </Pressable>

          {/* Buy Now */}
          <Pressable
            style={[
              styles.payButton,
              isPaying && styles.disabledButton,
            ]}
            onPress={() => 
              router.push({
                pathname: "/product/bill",
                params: {
                  productId: String(product.id),
                  quantity: quantity.toString(),
                  mode: "buy-now",
                },
              })
            }
            disabled={isPaying}>
          
            <Ionicons
              name="wallet-outline"
              size={20}
              color="#fff"
            />

            <Text style={styles.payButtonText}>
              Buy Now
            </Text>
      
          </Pressable>

        </View>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#888",
  },

  /* Header */
  header: {
    height: 65,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Image */
  imageContainer: {
    height: 310,
    marginHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  image: {
    width: "85%",
    height: "85%",
  },

  imageBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    zIndex: 2,
  },

  imageBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#d95778",
    textTransform: "uppercase",
  },

  /* Content */
  content: {
    paddingHorizontal: 20,
    paddingTop: 23,
  },

  category: {
    fontSize: 11,
    fontWeight: "700",
    color: "#d95778",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  name: {
    marginTop: 7,
    fontSize: 26,
    lineHeight: 33,
    fontWeight: "800",
    color: "#111",
  },

  /* Rating */
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: "#FFF7E8",
  },

  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },

  reviewText: {
    marginLeft: 9,
    fontSize: 12,
    color: "#999",
  },

  /* Price */
  price: {
    marginTop: 17,
    fontSize: 25,
    fontWeight: "800",
    color: "#d95778",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 21,
  },

  /* Description */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  description: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 21,
    color: "#777",
  },

  /* Benefits */
  benefitsCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 15,
    backgroundColor: "#fff",
    gap: 17,
  },

  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  benefitIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#FFF0F4",
    alignItems: "center",
    justifyContent: "center",
  },

  benefitContent: {
    marginLeft: 12,
  },

  benefitTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
  },

  benefitText: {
    marginTop: 3,
    fontSize: 11,
    color: "#999",
  },

  /* Quantity */
  quantityRow: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  quantitySubText: {
    marginTop: 3,
    fontSize: 10,
    color: "#999",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 11,
    overflow: "hidden",
  },

  quantityButton: {
    width: 37,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dddddd",
  },

  quantityText: {
    width: 38,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  /* Bottom */
  bottomBar: {
    position: "absolute",
    borderBlockColor:'none',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },

  cartButton: {
    flex: 1,
    width: 52,
    height: 50,
    borderWidth: 1,
    borderColor: "#F0D8DF",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF7FA",
     gap: 8,
  },

  cartButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },

  payButton: {
    flex: 1,
    height: 50,
    borderRadius: 13,
    backgroundColor: "#d95778",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  payButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },

  disabledButton: {
    opacity: 0.6,
  },

  /* Error */
  errorIcon: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#FFF2F5",
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    marginTop: 15,
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  errorText: {
    marginTop: 7,
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },

  backButton: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 11,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

});