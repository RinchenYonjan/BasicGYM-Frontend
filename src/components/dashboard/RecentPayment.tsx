import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function RecentPayment(){
    const payments = [
    {
      title: 'Membership Fee',
      date: '01 Aug 2026',
      amount: 'Rs. 2,500',
    },
    {
      title: 'Personal Training',
      date: '15 Jul 2026',
      amount: 'Rs. 1,500',
    },
    {
      title: 'Membership Renewal',
      date: '01 Jul 2026',
      amount: 'Rs. 2,500',
    },
  ];

    return(
      <View style={{marginHorizontal: 12, flex:1}}>
        <Text style={styles.sectionTitle}>Recent Payment</Text>

      <ScrollView style={{ height: 200 }}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >

      {payments.map((payment, index) => (
        <TouchableOpacity
        key={index}
          style={[
            styles.recentPaymentCard,
            index > 0 && { marginTop: 12 },
          ]}
          activeOpacity={0.7}
        >
          <View style={styles.recentPaymentLeft}>
            <View style={styles.recentPaymentIcon}>
              <Feather
                name="check"
                size={18}
                color="#FFFFFF"
                />
            </View>

            <View>
              <Text style={styles.recentPaymentTitle}>
                {payment.title}
              </Text>

              <View style={styles.recentPaymentMetaRow}>
                <Text style={styles.recentPaymentDate}>
                  {payment.date}
                </Text>

                <View style={styles.paidPill}>
                  <Text style={styles.paidPillText}>
                    Paid
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.recentPaymentRight}>
            <Text style={styles.recentPaymentAmount}>
              {payment.amount}
            </Text>

            <Feather
              name="chevron-right"
              size={18}
              color="#8B8A94"
              />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
</View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15131F',
    marginBottom: 12,
  },

  recentPaymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECF1',
  },
  recentPaymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentPaymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentPaymentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15131F',
  },
  recentPaymentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  recentPaymentDate: {
    fontSize: 12,
    color: '#8B8A94',
    marginRight: 8,
  },
  paidPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  paidPillText: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '600',
  },
  recentPaymentRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentPaymentAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15131F',
    marginRight: 4,
  }

})