import { Feather } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'



export default function RecentPaymentComp(){
    return(
        <ScrollView>
              <Text style={styles.sectionTitle}>Recent Payment</Text>
        <TouchableOpacity style={styles.recentPaymentCard} activeOpacity={0.7}>
          <View style={styles.recentPaymentLeft}>
            <View style={styles.recentPaymentIcon}>
              <Feather name="check" size={18} color='#FFFFFF' />
            </View>
            <View>
              <Text style={styles.recentPaymentTitle}>Membership Fee</Text>
              <View style={styles.recentPaymentMetaRow}>
                <Text style={styles.recentPaymentDate}>01 Aug 2026</Text>
                <View style={styles.paidPill}>
                  <Text style={styles.paidPillText}>Paid</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.recentPaymentRight}>
            <Text style={styles.recentPaymentAmount}>Rs. 2,500</Text>
            <Feather name="chevron-right" size={18} color='#8B8A94' />
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
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