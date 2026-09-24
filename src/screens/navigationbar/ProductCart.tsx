import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCart, removeFromCart, updateCartItem } from "../../services/cartItem.service";


interface BackendCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;

  product: {
    id: string;
    product_name: string;
    product_category: string;
    product_price: number;
    product_image: string;
  };
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  image: any;
  quantity: number;
}

export default function ProductCartScreen() {
  const queryClient = useQueryClient();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );

  /* Convert backend cart data into frontend cart format */
  const formatCartItems = (
    backendItems: BackendCartItem[]
  ): CartItem[] => {
    return backendItems.map((item) => ({
      id: item.id,
      productId: item.product_id,
      name: item.product.product_name,
      category: item.product.product_category,
      price: Number(item.product.product_price),
      image: item.product.product_image,
      quantity: Number(item.quantity),
    }));
  };

  /* Fetch Cart */
  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await getCart();

      console.log("Cart response:", response);

      if (response?.success) {
        const formattedItems = formatCartItems(
          response.data || []
        );

        setCartItems(formattedItems);
      } else {
        setCartItems([]);
      }
    } catch (error: any) {
      console.error("Fetch cart error:", error);

      Alert.alert(
        "Cart Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load your cart."
      );
    } finally {
      setLoading(false);
    }
  };

  /* Load cart when screen opens */
  useEffect(() => {
    fetchCart();
  }, []);

  /* Increase / Decrease Quantity */
  const updateQuantity = async (
    item: CartItem,
    action: "increase" | "decrease"
  ) => {
    let newQuantity = item.quantity;

    if (action === "increase") {
      newQuantity = item.quantity + 1;
    }

    if (action === "decrease") {
      newQuantity = item.quantity - 1;
    }

    /* If quantity becomes 0, remove the product from cart. */
    if (newQuantity <= 0) {
      await removeItem(item);
      return;
    }

    try {
      setUpdatingProductId(item.productId);

      /* Optimistic UI update */
      setCartItems((currentItems) =>
        currentItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? {
                ...cartItem,
                quantity: newQuantity,
              }
            : cartItem
        )
      );

      /* Update database */
      const response = await updateCartItem({
        product_id: item.productId,
        quantity: newQuantity,
      });

      console.log("Update cart response:", response);

      /* Backend rejected the update */
      if (!response?.success) {
        await fetchCart();

        Alert.alert(
          "Update Failed",
          response?.message ||
            "Could not update cart quantity."
        );

        return;
      }

      /* Tell React Query that ["cart"] is now stale. */
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    } catch (error: any) {

      console.error("Update cart quantity error:",error);

      /* Restore actual database state */
      await fetchCart();

      Alert.alert(
        "Update Failed",
        error?.response?.data?.message ||
          error?.message ||
          "Could not update cart quantity."
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  /* Remove Item */
  const removeItem = async (item: CartItem) => {

    try {
      setUpdatingProductId(item.productId);

      /* Optimistically remove item from the UI.*/
      setCartItems((currentItems) =>
        currentItems.filter(
          (cartItem) =>
            cartItem.productId !== item.productId
        )
      );

      /* Remove from database */
      const response = await removeFromCart(
        item.productId
      );

      console.log("Remove cart response:", response);

      /* Backend rejected deletion */
      if (!response?.success) {
        await fetchCart();

        Alert.alert(
          "Remove Failed",
          response?.message ||
            "Could not remove item from cart."
        );

        return;
      }

      /* Refresh React Query's ["cart"] cache.*/
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

    } catch (error: any) {
      
      console.error("Remove cart item error:",error);
      
      /* Restore actual database state*/
      await fetchCart();

      Alert.alert(
        "Remove Failed",
        error?.response?.data?.message ||
          error?.message ||
          "Could not remove item from cart."
      );

    } finally {
      setUpdatingProductId(null);
    }
  };

  /* Confirm Remove */
  const confirmRemoveItem = (item: CartItem) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove "${item.name}" from your cart?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => removeItem(item),
        },
      ]
    );
  };

  /* Subtotal */
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  /* Delivery Fee */
  const deliveryFee = subtotal > 0 ? 150 : 0;

  /* Total */
  const total = subtotal + deliveryFee;

  /* Render Cart Item */
  const renderCartItem = ({
    item,
  }: {
    item: CartItem;
  }) => {
    const isUpdating =
      updatingProductId === item.productId;

    return (
      <View style={styles.cartItem}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              typeof item.image === "string"
                ? { uri: item.image }
                : item.image
            }
            style={styles.productImage}
          />
        </View>

        {/* Product Details */}
        <View style={styles.productDetails}>
          <Text style={styles.category}>
            {item.category}
          </Text>

          <Text
            style={styles.productName}
            numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.price}>
            Rs. {item.price.toLocaleString()}
          </Text>

          {/* Quantity + Delete */}
          <View style={styles.bottomRow}>
            <View style={styles.quantityContainer}>
              {/* Decrease */}
              <TouchableOpacity
                style={styles.quantityButton}
                disabled={isUpdating}
                onPress={() =>
                  updateQuantity(
                    item,
                    "decrease"
                  )
                }>
                <Ionicons
                  name="remove"
                  size={18}
                  color="#222"
                />
              </TouchableOpacity>

              {/* Quantity */}
              {isUpdating ? (
                <View
                  style={
                    styles.quantityLoading
                  }>
                  <ActivityIndicator
                    size="small"
                    color="#222"/>
                </View>
              ) : (
                <Text
                  style={styles.quantity}>
                  {item.quantity}
                </Text>
              )}

              {/* Increase */}
              <TouchableOpacity
                style={styles.quantityButton}
                disabled={isUpdating}
                onPress={() =>
                  updateQuantity(
                    item,
                    "increase"
                  )
                }>
                <Ionicons
                  name="add"
                  size={18}
                  color="#222"
                />
              </TouchableOpacity>
            </View>

            {/* Delete */}
            <TouchableOpacity
              disabled={isUpdating}
              onPress={() =>
                confirmRemoveItem(item)
              }>
              <Ionicons
                name="trash-outline"
                size={21}
                color="#E53935"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  /* Loading Screen */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#222"
        />

        <Text style={styles.loadingText}>
          Loading your cart...
        </Text>
      </View>
    );
  }

  /* Main Screen */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#222"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          My Cart
        </Text>
      </View>

      {cartItems.length === 0 ? (
        /* Empty Cart */
        <View style={styles.emptyContainer}>
          
          <View style={styles.emptyIconContainer}>
            <Ionicons
              name="cart-outline"
              size={70}
              color="#999"
            />
          </View>

          <Text style={styles.emptyTitle}>
            Your cart is empty
          </Text>

          <Text style={styles.emptyText}>
            Looks like you haven't added any
            supplements yet.
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() =>
              router.push("/product")
            }>
            <Text style={styles.shopButtonText}>
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Cart List */}
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) =>
              item.productId
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.listContent
            }
          />

          {/* Bottom Summary */}
          <View style={styles.summaryContainer}>
            
            {/* Subtotal */}
            <View style={styles.summaryRow}>
              
              <Text style={styles.summaryLabel}>
                Subtotal
              </Text>

              <Text
                style={styles.summaryValue}>
                Rs. {subtotal.toLocaleString()}
              </Text>
            </View>

            {/* Delivery */}
            <View style={styles.summaryRow}>
              <Text
                style={styles.summaryLabel}>
                Delivery Fee
              </Text>

              <Text style={styles.summaryValue}>
                Rs. {deliveryFee.toLocaleString()}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Total */}
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>
                Total
              </Text>

              <Text style={styles.totalValue}>
                Rs. {total.toLocaleString()}
              </Text>
            </View>

            {/* Checkout */}
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() =>
                router.push("/product/bill")
              }>
              <Text style={styles.checkoutText}>
                Proceed to Checkout
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#777",
  },

  /* Header */
  header: {
    height: 65,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  backButton: {
    position: "absolute",
    left: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  /* List */
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },

  /* Cart Item */
  cartItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  imageContainer: {
    width: 105,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },

  productDetails: {
    flex: 1,
    marginLeft: 14,
    paddingVertical: 3,
  },

  category: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },

  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    lineHeight: 21,
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E53935",
    marginTop: 7,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },

  quantityButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
  },

  quantity: {
    minWidth: 30,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  quantityLoading: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Summary */
  summaryContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  summaryLabel: {
    fontSize: 14,
    color: "#777",
  },

  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 6,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#E53935",
  },

  checkoutButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#222",
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },

  /* Empty Cart */
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  emptyIconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 25,
  },

  shopButton: {
    height: 50,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: "#d95778",
    alignItems: "center",
    justifyContent: "center",
  },

  shopButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});