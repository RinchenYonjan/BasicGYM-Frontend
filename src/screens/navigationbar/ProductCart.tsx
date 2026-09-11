import { getToken } from "@/helper/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


const initialCart = [
  {
    id: "1",
    name: "MB Creatine Monohydrate",
    category: "Creatine",
    price: 2500,
    quantity: 1,
    image: require("../../../assets/app-images/creatine.png"),
  },
  {
    id: "2",
    name: "MB Whey Protein",
    category: "Protein",
    price: 6500,
    quantity: 2,
    image: require("../../../assets/app-images/mb protein.png"),
  },
  {
    id: "3",
    name: "C4 Pre-Workout",
    category: "Pre-Workout",
    price: 3500,
    quantity: 1,
    image: require("../../../assets/app-images/c4 pre-workout.png"),
  },
];

export default function ProductCartScreen() {
  const [cartItems, setCartItems] = useState(initialCart);

  async function handlePayment() {
    const token =getToken();
    if(!token){
      router.push("/login")
    }
    // const productId = 
    // const quanitty
    try{

      const res=await axios.post("http://localhost:3000/api/payment/esewa/initiate",{
        // productId,
        // quantity
      },{
        headers:{
          Authorization:`bearer ${token}`
        }
      })
      // console.log("this is respone",res.data);
      // const link = res.data.data.deeplink;
      // await Linking.openURL(link);

    }
    catch(err){

    }




    
  }

  const updateQuantity = (id: string, type: "increase" | "decrease") => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;

        if (type === "increase") {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        return {
          ...item,
          quantity: Math.max(1, item.quantity - 1),
        };
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 150 : 0;

  const total = subtotal + deliveryFee;

  const renderCartItem = ({ item }: any) => {
    return (
      <View style={styles.cartItem}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.productImage} />
        </View>

        {/* Product Details */}
        <View style={styles.productDetails}>
          <Text style={styles.category}>{item.category}</Text>

          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.price}>
            Rs. {item.price.toLocaleString()}
          </Text>

          {/* Quantity */}
          <View style={styles.bottomRow}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, "decrease")}
              >
                <Ionicons name="remove" size={18} color="#222" />
              </TouchableOpacity>

              <Text style={styles.quantity}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, "increase")}
              >
                <Ionicons name="add" size={18} color="#222" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Ionicons name="trash-outline" size={21} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={()=>{
            router.replace('/product');
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Cart</Text>

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

          <Text style={styles.emptyTitle}>Your cart is empty</Text>

          <Text style={styles.emptyText}>
            Looks like you haven't added any supplements yet.
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/product")}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Cart List */}
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />

          {/* Bottom Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                Rs. {subtotal.toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                Rs. {deliveryFee.toLocaleString()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>

              <Text style={styles.totalValue}>
                Rs. {total.toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handlePayment}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  // Header
  header: {
    height: 65,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  backButton: {
    position: 'absolute',
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
    alignItems: "center",
    justifyContent: "center",
  },

  itemCount: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  // List
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },

  // Cart Item
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

  // Summary
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

  // Empty Cart
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
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },

  shopButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});