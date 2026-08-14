import { Feather, Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

export default function SummaryCardComp(){
    return (
    <View style={styles.membershipCard}>
          <View style={styles.membershipTopRow}>
            <View>
              <Text style={styles.membershipLabel}>YOUR MEMBERSHIP</Text>
              <Text style={styles.membershipPlan}>Premium Plan</Text>
              <View style={styles.activePill}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>
            <View style={styles.crownBadge}>
              <Ionicons name="ribbon-outline" size={26} color="#fffff" />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.membershipStatsRow}>
            <View style={styles.membershipStatItem}>
              <Feather name="calendar" size={16} color='#FFFFFF' />
              <Text style={styles.membershipStatLabel}>Valid Until</Text>
              <Text style={styles.membershipStatValue}>30 Sep 2026</Text>
            </View>
            <View style={styles.membershipStatItem}>
              <Feather name="tag" size={16} color='#7C5CFC' />
              <Text style={styles.membershipStatLabel}>Monthly Fee</Text>
              <Text style={styles.membershipStatValue}>Rs. 2,500</Text>
            </View>
            <View style={styles.membershipStatItem}>
              <Feather name="shield" size={16} color='#7C5CFC' />
              <Text style={styles.membershipStatLabel}>Member Since</Text>
              <Text style={styles.membershipStatValue}>01 Mar 2026</Text>
            </View>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    membershipCard: {
    backgroundColor: '#12101E',
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 12,
  },
  membershipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  membershipLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#9995B0',
    fontWeight: '600',
  },
  membershipPlan: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7C5CFC',
    marginTop: 6,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  activeText: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '600',
  },
  crownBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#7C5CFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 10,
  },
  membershipStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  membershipStatItem: {
    flex: 1,
  },
  membershipStatLabel: {
    color: '#9995B0',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  membershipStatValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  }

})