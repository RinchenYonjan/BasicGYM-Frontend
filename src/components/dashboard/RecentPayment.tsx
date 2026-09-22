import AppConfig from "@/config/app_config";
import { getToken } from "@/helper/tokenStorage";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface Product {
  id: string;
  product_name: string;
  product_category: string;
  product_price: string;
  product_image: string | null;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: string;
  product: Product;
}

interface Order {
  id: string;
  total_amount: string;
  status: string;
  items: OrderItem[];
}

interface Payment {
  id: string;
  order_id: string;
  provider: string;
  amount: string;
  transaction_uuid: string;
  transaction_id: string | null;
  reference_code: string | null;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  paid_at: string | null;
  createdAt: string;
  order: Order;
}

export default function RecentPayment() {

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    try{
      await refetch();
    }finally{
      setRefreshing(false);
    }
  };

  const {data: payments = [], isLoading, isError, refetch} = useQuery<Payment[]>({
    queryKey: ["payment-history"],

    queryFn: async () => {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${AppConfig.baseURL}/api/payment/my-payment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: Payment["status"]) => {
    switch (status) {
      case "SUCCESS":
        return {
          icon: "check" as const,
          label: "Paid",
          iconBackground: "#22C55E",
          pillBackground: "#DCFCE7",
          textColor: "#22C55E",
        };

      case "PENDING":
        return {
          icon: "clock" as const,
          label: "Pending",
          iconBackground: "#F59E0B",
          pillBackground: "#FEF3C7",
          textColor: "#D97706",
        };

      case "FAILED":
        return {
          icon: "x" as const,
          label: "Failed",
          iconBackground: "#EF4444",
          pillBackground: "#FEE2E2",
          textColor: "#EF4444",
        };

      case "CANCELLED":
        return {
          icon: "slash" as const,
          label: "Cancelled",
          iconBackground: "#6B7280",
          pillBackground: "#F3F4F6",
          textColor: "#6B7280",
        };
    }
  };

  const getPaymentTitle = (payment: Payment) => {
    const items = payment.order?.items || [];

    if (items.length === 0) {
      return "Product Purchase";
    }

    if (items.length === 1) {
      return items[0]?.product?.product_name || "Product Purchase";
    }

    const firstProduct =
      items[0]?.product?.product_name || "Product";

    return `${firstProduct} + ${items.length - 1} more`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Payment</Text>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Unable to load payment history.
          </Text>
        </View>
      ) : payments.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            No payment history yet.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}/>
          }>

          {payments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);

            return (
              <TouchableOpacity
                key={payment.id}
                style={styles.recentPaymentCard}
                activeOpacity={0.7}>

                <View style={styles.recentPaymentLeft}>
                  <View
                    style={[
                      styles.recentPaymentIcon,
                      {
                        backgroundColor:
                          statusConfig.iconBackground,
                      },
                    ]}>
                      
                    <Feather
                      name={statusConfig.icon}
                      size={18}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.paymentInfo}>
                    <Text style={styles.recentPaymentTitle}>
                      {getPaymentTitle(payment)}
                    </Text>

                    <View style={styles.recentPaymentMetaRow}>
                      <Text style={styles.recentPaymentDate}>
                        {formatDate(payment.createdAt)}
                      </Text>

                      <View
                        style={[
                          styles.paidPill,
                          {
                            backgroundColor:
                              statusConfig.pillBackground,
                          },
                        ]}>

                        <Text
                          style={[
                            styles.paidPillText,
                            {
                              color: statusConfig.textColor,
                            },
                          ]}>

                          {statusConfig.label}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.recentPaymentRight}>
                  <Text style={styles.recentPaymentAmount}>
                    Rs.{" "}
                    {Number(payment.amount).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    flex: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#15131F",
    marginBottom: 12,
  },

  scrollView: {
    maxHeight: 300,
  },

  scrollContent: {
    paddingBottom: 10,
  },

  centerContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    fontSize: 13,
    color: "#EF4444",
  },

  emptyText: {
    fontSize: 13,
    color: "#8B8A94",
  },

  recentPaymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECECF1",
    marginBottom: 12,
  },

  recentPaymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  recentPaymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  paymentInfo: {
    flex: 1,
  },

  recentPaymentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#15131F",
  },

  recentPaymentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  recentPaymentDate: {
    fontSize: 12,
    color: "#8B8A94",
    marginRight: 8,
  },

  paidPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  paidPillText: {
    fontSize: 11,
    fontWeight: "600",
  },

  recentPaymentRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  recentPaymentAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#15131F",
    marginRight: 12,
  },
});