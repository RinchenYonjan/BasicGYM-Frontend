import { Feather, Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function PaymentDueCard(){
    return(
        <View style={styles.paymentCard}>
          <View>
            <Text style={styles.paymentLabel}>PAYMENT DUE</Text>
            <Text style={styles.paymentAmount}>Rs. 2,500</Text>
            <Text style={styles.paymentSub}>Due for August 2026</Text>
          </View>
          <View style={styles.paymentRight}>
            <View style={styles.walletIconWrap}>
              <Ionicons name="wallet-outline" size={26} color="#F43F5E" />
              <View style={styles.alertDot}>
                <Text style={styles.alertDotText}>!</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.payButton} activeOpacity={0.8}>
              <Text style={styles.payButtonText}>Pay Now</Text>
              <Feather name="chevron-right" size={16} color='#FFFFFF' />
            </TouchableOpacity>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({

paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  paymentLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#8B8A94',
    fontWeight: '600',
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EF4444',
    marginTop: 4,
  },
  paymentSub: {
    fontSize: 12,
    color: '#8B8A94',
    marginTop: 2,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  walletIconWrap: {
    marginBottom: 10,
  },
  alertDot: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertDotText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  }




})