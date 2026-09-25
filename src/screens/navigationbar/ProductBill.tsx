import { getToken } from "@/helper/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getCart } from "../../services/cartItem.service";
import { createCODOrder, initiateEsewaPayment } from "../../services/payment.service";
import { getProductById } from "../../services/product.service";


type BillItem = {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  image: any;
};

function imageSourceFor(image: any) {
  return typeof image === "string" ? { uri: image } : image;
}

export default function ProductBillScreen() {
  const { productId, quantity, mode } = useLocalSearchParams<{
    productId?: string;
    quantity?: string;
    mode?: string;
  }>();

  // PAYMENT METHOD
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "esewa">(
    "esewa"
  );

  const [isProcessing, setIsProcessing] = useState(false);

  // COD SUCCESS SCREEN
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // CHECKOUT MODE
  const isBuyNow = mode === "buy-now" && !!productId;
  const isCartCheckout = !isBuyNow;
  const productQuantity = Number(quantity) || 1;

  // BUY NOW - FETCH PRODUCT
  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId as string),
    enabled: isBuyNow,
  });

  // CART CHECKOUT - FETCH BACKEND CART
  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isCartCheckout,
  });

  // SINGLE PRODUCT
  const singleItem: BillItem[] = useMemo(() => {
    if (!isBuyNow || !productData) {
      return [];
    }

    const product = productData.data ?? productData;

    return [
      {
        id: String(product.id),
        name: product.product_name,
        category: product.product_category,
        price: Number(product.product_price) || 0,
        quantity: productQuantity,
        image: product.product_image,
      },
    ];
  }, [productData, isBuyNow, productQuantity]);

  // BACKEND CART
  const cartItems: BillItem[] = useMemo(() => {
    if (!isCartCheckout || !cartData) {
      return [];
    }

    const rawItems = cartData.data ?? [];

    return rawItems.map((item: any) => ({
      id: String(item.product_id),
      name: item.product.product_name,
      category: item.product.product_category,
      price: Number(item.product.product_price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.product.product_image,
    }));
  }, [cartData, isCartCheckout]);

  // FINAL ITEMS
  const items = isBuyNow ? singleItem : cartItems;

  // PRICE CALCULATIONS
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = items.length > 0 ? 150 : 0;

  const codCharge = paymentMethod === "cod" ? 15 : 0;

  const total = subtotal + deliveryFee + codCharge;

  // PAYMENT HANDLER
  async function handlePayment() {
    try {
      setIsProcessing(true);

      const token = getToken();
      
      // CHECK AUTHENTICATION
      if (!token) {
        router.push("/login");
        return;
      }

      // CASH ON DELIVERY
      if (paymentMethod === "cod") {
        const orderItems = items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        }));

        if (orderItems.length === 0) {
          console.error("No products found for COD order.");
          return;
        }

        console.log("Creating COD order:", orderItems);

        const response = await createCODOrder(
          {
            items: orderItems,
          },
          token
        );

        console.log("COD order response:", response);

        // COD ORDER SUCCESS
        if (response?.success) {
          setShowOrderSuccess(true);
        }

        return;
      }

      // ESEWA PAYMENT
      const paymentItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      if (paymentItems.length === 0) {
        console.error("No products found for payment.");
        return;
      }

      console.log("Sending payment items:", paymentItems);

      const response = await initiateEsewaPayment(paymentItems, token);

      console.log("eSewa response:", response);

      const deeplink = response?.data?.deeplink;

      // CHECK DEEPLINK
      if (!deeplink) {
        console.error("eSewa deeplink not received:", response);
        return;
      }

      // OPEN ESEWA
      const supported = await Linking.canOpenURL(deeplink);

      if (supported) {
        await Linking.openURL(deeplink);
      } else {
        console.error("Cannot open eSewa deeplink:", deeplink);
      }
    } catch (error: any) {
      console.error(
        "Payment error:",
        error?.response?.data || error?.message || error
      );
    } finally {
      setIsProcessing(false);
    }
  }

  // COD SUCCESS SCREEN
  if (showOrderSuccess) {
    return (
      <View style={styles.successContainer}>
        {/* SUCCESS ICON */}

        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark" size={55} color="#fff" />
        </View>

        {/* TITLE */}
        <Text style={styles.successTitle}>
          Order Placed Successfully
        </Text>

        {/* MAIN MESSAGE */}
        <Text style={styles.successMessage}>
          Your order is placed successfully.
        </Text>

        {/* DESCRIPTION */}
        <Text style={styles.successSubMessage}>
          You have selected Cash on Delivery. Please pay when your order
          arrives.
        </Text>

        {/* CONTINUE BUTTON */}
        <Pressable
          style={styles.continueButton}
          onPress={() => router.replace("/")}>
          <Text style={styles.continueButtonText}>
            Continue Shopping
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#fff"
          />
        </Pressable>
      </View>
    );
  }

  // LOADING
  if ((isBuyNow && isProductLoading) || (isCartCheckout && isCartLoading)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5B2A6F" />

        <Text style={styles.loadingText}>
          Loading product...
        </Text>
      </View>
    );
  }

  // ERROR
  if (
    (isBuyNow && (isProductError || !productData)) ||
    (isCartCheckout && isCartError)
  ) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={50}
          color="#777"
        />

        <Text style={styles.errorText}>
          Failed to load product.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  // EMPTY CART
  if (items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="cart-outline"
          size={60}
          color="#777"
        />

        <Text style={styles.errorText}>
          No products found.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }


  // MAIN PRODUCT BILL SCREEN
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#222"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          {isCartCheckout
            ? "Order Summary"
            : "Product Bill"}
        </Text>

        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {items.map((item) => (
          <View
            key={item.id}
            style={styles.productCard}>
            <Image
              source={imageSourceFor(item.image)}
              style={styles.productImage}
              resizeMode="contain"/>

            <View style={styles.productInfo}>
              <Text
                style={styles.productName}
                numberOfLines={2}>
                {item.name}
              </Text>

              {!!item.category && (
                <Text style={styles.category}>
                  {item.category}
                </Text>
              )}

              <View style={styles.itemBottomRow}>
                <Text style={styles.productPrice}>
                  Rs. {item.price.toLocaleString()}
                </Text>

                <Text style={styles.itemQty}>
                  Qty: {item.quantity}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="receipt-outline"
              size={21}
              color="#5B2A6F"
            />

            <Text style={styles.sectionTitle}>
              Price Details
            </Text>
          </View>

          {/* SUBTOTAL */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Subtotal
            </Text>

            <Text style={styles.priceValue}>
              Rs. {subtotal.toLocaleString()}
            </Text>
          </View>

          {/* DELIVERY */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Delivery Fee
            </Text>

            <Text style={styles.priceValue}>
              Rs. {deliveryFee.toLocaleString()}
            </Text>
          </View>

          {/* COD CHARGE */}
          {paymentMethod === "cod" && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                COD Charge
              </Text>

              <Text style={styles.priceValue}>
                Rs. 15
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* TOTAL */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalValue}>
              Rs. {total.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="card-outline"
              size={21}
              color="#5B2A6F"
            />

            <Text style={styles.sectionTitle}>
              Payment Method
            </Text>
          </View>

          {/* CASH ON DELIVERY */}
          <Pressable
            style={[
              styles.paymentCard,
              paymentMethod === "cod" &&
                styles.selectedPaymentCard,
            ]}
            onPress={() => setPaymentMethod("cod")}>
              
            <View style={styles.codIcon}>
              <Ionicons
                name="cash-outline"
                size={25}
                color="#5B2A6F"
              />
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>
                Cash on Delivery
              </Text>

              <Text style={styles.paymentSubtitle}>
                Pay when your order arrives
              </Text>

              <Text style={styles.extraCharge}>
                + Rs. 15 COD charge
              </Text>
            </View>

            <Ionicons
              name={
                paymentMethod === "cod"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={24}
              color="#5B2A6F"
            />
          </Pressable>

          {/* ESEWA */}
          <Pressable
            style={[
              styles.paymentCard,
              styles.paymentCardSpacing,
              paymentMethod === "esewa" &&
                styles.selectedPaymentCard,
            ]}
            onPress={() => setPaymentMethod("esewa")}
          >
            <View style={styles.esewaIcon}>
              <Text style={styles.esewaText}>
                e
              </Text>
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>
                eSewa
              </Text>

              <Text style={styles.paymentSubtitle}>
                Secure online payment
              </Text>
            </View>

            <Ionicons
              name={
                paymentMethod === "esewa"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={24}
              color="#5B2A6F"
            />
          </Pressable>
        </View>

        {/* NOTICE */}
        <View style={styles.notice}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color="#5B2A6F"
          />

          <Text style={styles.noticeText}>
            {paymentMethod === "cod"
              ? "Your order will be placed with Cash on Delivery."
              : "Your payment will be securely processed through eSewa."}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>
            Total Amount
          </Text>

          <Text style={styles.bottomTotal}>
            Rs. {total.toLocaleString()}
          </Text>
        </View>

        <Pressable
          style={[
            styles.paymentButton,
            isProcessing &&
              styles.paymentButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator
              size="small"
              color="#fff"
            />
          ) : (
            <>
              <Text style={styles.paymentButtonText}>
                {paymentMethod === "cod"
                  ? "Place Order"
                  : "Pay with eSewa"}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#fff"
              />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  // ==========================================================
  // SUCCESS SCREEN
  // ==========================================================

  successContainer: {
    flex: 1,
    backgroundColor: "#F7F5F8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#5B2A6F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
  },

  successMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B2A6F",
    marginTop: 10,
    textAlign: "center",
  },

  successSubMessage: {
    fontSize: 14,
    color: "#777",
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
    maxWidth: 320,
  },

  continueButton: {
    marginTop: 30,
    backgroundColor: "#5B2A6F",
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  continueButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 8,
  },

  // ==========================================================
  // GENERAL
  // ==========================================================

  container: {
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F5F8",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
  },

  errorText: {
    fontSize: 14,
    color: "#777",
    marginTop: 12,
    textAlign: "center",
  },

  backButton: {
    marginTop: 25,
    backgroundColor: "#5B2A6F",
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#222",
  },

  // ==========================================================
  // SCROLL
  // ==========================================================

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // ==========================================================
  // PRODUCT CARD
  // ==========================================================

  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  productImage: {
    width: 95,
    height: 95,
    borderRadius: 12,
    backgroundColor: "#F7F7F7",
  },

  productInfo: {
    flex: 1,
    marginLeft: 15,
  },

  productName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    lineHeight: 23,
  },

  category: {
    fontSize: 13,
    color: "#777",
    marginTop: 5,
    textTransform: "capitalize",
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5B2A6F",
  },

  itemBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  itemQty: {
    fontSize: 13,
    color: "#777",
  },

  // ==========================================================
  // SECTION
  // ==========================================================

  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginLeft: 8,
  },

  // ==========================================================
  // PRICE
  // ==========================================================

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  priceLabel: {
    fontSize: 14,
    color: "#666",
  },

  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  totalValue: {
    fontSize: 19,
    fontWeight: "800",
    color: "#5B2A6F",
  },

  // ==========================================================
  // PAYMENT CARDS
  // ==========================================================

  paymentCard: {
    borderWidth: 1,
    borderColor: "#E5DCE8",
    borderRadius: 12,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedPaymentCard: {
    borderColor: "#5B2A6F",
    borderWidth: 2,
  },

  paymentCardSpacing: {
    marginTop: 12,
  },

  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  paymentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },

  paymentSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  // ==========================================================
  // COD ICON
  // ==========================================================

  codIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#F2EDF4",
    justifyContent: "center",
    alignItems: "center",
  },

  extraCharge: {
    fontSize: 11,
    color: "#D32F2F",
    marginTop: 4,
  },

  // ==========================================================
  // ESEWA ICON
  // ==========================================================

  esewaIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#5B2A6F",
    justifyContent: "center",
    alignItems: "center",
  },

  esewaText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#fff",
  },

  // ==========================================================
  // NOTICE
  // ==========================================================

  notice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1EBF4",
    padding: 13,
    borderRadius: 12,
  },

  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: "#666",
    marginLeft: 9,
  },

  // ==========================================================
  // BOTTOM BAR
  // ==========================================================

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 13,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bottomLabel: {
    fontSize: 12,
    color: "#777",
  },

  bottomTotal: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
    marginTop: 3,
  },

  // ==========================================================
  // PAYMENT BUTTON
  // ==========================================================

  paymentButton: {
    backgroundColor: "#5B2A6F",
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  paymentButtonDisabled: {
    opacity: 0.6,
  },

  paymentButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 8,
  },
});