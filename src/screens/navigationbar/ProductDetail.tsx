import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
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
import { initiateEsewaPayment } from "../../services/payment.service";
import { getProductById } from "../../services/product.service";


const ProductDetailScreen = () => {

  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isPaying, setIsPaying] = useState(false);
  const {data: product, isLoading, isError} = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      productId: product?.id,
      quantity,
    });

    // Later you can call your add-to-cart API here
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={45} color="#999" />

        <Text style={styles.errorTitle}>
          Unable to load product
        </Text>

        <Text style={styles.errorText}>
          Something went wrong. Please try again.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }


const handleEsewaPayment = async () => {
  if (!product) return;

  try {
    setIsPaying(true);

    const response = await initiateEsewaPayment(
      product.id,
      quantity
    );

    const deeplink = response?.data?.deeplink;

    if (!deeplink) {
      throw new Error("Unable to create eSewa payment");
    }

    await Linking.openURL(deeplink);

  }catch(error){

    console.error("eSewa payment error:", error);

    Alert.alert(
      "Payment Failed",
      "Unable to initiate eSewa payment. Please try again."
    );

  } finally {
    
    setIsPaying(false);
  
  }
};

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#111"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Product Details
          </Text>

          <Pressable style={styles.iconButton}>
            <Ionicons
              name="heart-outline"
              size={23}
              color="#111"
            />
          </Pressable>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Product Information */}
        <View style={styles.content}>
          {/* Category */}
          <Text style={styles.category}>
            {product.category}
          </Text>

          {/* Product Name */}
          <Text style={styles.name}>
            {product.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.rating}>
              <Ionicons
                name="star"
                size={16}
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
            ${Number(product.price).toFixed(2)}
          </Text>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <Text style={styles.description}>
            High-quality {product.name} designed to support
            your fitness goals. Perfect for your daily
            training and workout routine.
          </Text>

          {/* Quantity */}
          <View style={styles.quantityRow}>
            <Text style={styles.sectionTitle}>
              Quantity
            </Text>

            <View style={styles.quantityContainer}>
              <Pressable
                style={styles.quantityButton}
                onPress={decreaseQuantity}
              >
                <Ionicons
                  name="remove"
                  size={18}
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
                  size={18}
                  color="#111"
                />
              </Pressable>
            </View>
          </View>

          {/* Product Details */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color="#333"
              />

              <View>
                <Text style={styles.infoTitle}>
                  Quality Product
                </Text>

                <Text style={styles.infoText}>
                  Carefully selected products
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="car-outline"
                size={21}
                color="#333"
              />

              <View>
                <Text style={styles.infoTitle}>
                  Fast Delivery
                </Text>

                <Text style={styles.infoText}>
                  Delivered to your doorstep
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Add To Cart */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>
            Total Price
          </Text>

          <Text style={styles.totalPrice}>
            ${(Number(product.price) * quantity).toFixed(2)}
          </Text>
        </View>

      <Pressable style={[
        styles.addToCartButton,
        isPaying && styles.disabledButton]}
        onPress={handleEsewaPayment}
        disabled={isPaying}>

        {isPaying ? (
          <ActivityIndicator color="#fff" />
          ) : ( 
        <>
          <Ionicons
            name="wallet-outline"
            size={21}
            color="#fff"/>

          <Text style={styles.addToCartText}>
            Pay with eSewa
          </Text>
        </>
        )}
      </Pressable>
      
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingBottom: 120,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Image */

  imageContainer: {
    marginHorizontal: 20,
    height: 320,
    borderRadius: 24,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  image: {
    width: "90%",
    height: "90%",
  },

  /* Content */

  content: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  category: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  name: {
    marginTop: 7,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "800",
    color: "#111",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },

  reviewText: {
    marginLeft: 10,
    fontSize: 13,
    color: "#888",
  },

  price: {
    marginTop: 18,
    fontSize: 25,
    fontWeight: "800",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 22,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  description: {
    marginTop: 9,
    fontSize: 14,
    lineHeight: 22,
    color: "#777",
  },

  /* Quantity */

  quantityRow: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    overflow: "hidden",
  },

  quantityButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },

  quantityText: {
    width: 40,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  /* Information Card */

  infoCard: {
    marginTop: 25,
    padding: 17,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    gap: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },

  infoText: {
    marginTop: 3,
    fontSize: 12,
    color: "#888",
  },

  /* Bottom Bar */

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalLabel: {
    fontSize: 12,
    color: "#888",
  },

  totalPrice: {
    marginTop: 3,
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  addToCartButton: {
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 15,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  addToCartText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  disabledButton: {
  opacity: 0.6,
  },
  
  /* Error */
  errorTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: "#888",
    textAlign: "center",
  },

  backButton: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#111",
  },

  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});