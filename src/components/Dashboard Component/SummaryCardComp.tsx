import { Feather, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getToken } from '@/helper/tokenStorage';
import { getUserProfile } from '@/services/ProfileService';

export default function SummaryCardComp() {
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState(0);
  const [memberSince, setMemberSince] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await getToken();

        const t = await getUserProfile();        

        const userData = t?.data;

        console.log("This is userdata",userData);

        // User active status
        setIsActive(userData.is_active);

        // Membership / plan information
        if (userData.members) {

          setPlanName(userData?.members[0]?.plan.plan_name);
          setPlanPrice(userData?.members[0]?.plan?.plan_price);

          const date = new Date(userData.members[0].createdAt);

          setMemberSince(
            date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          );
        }

      } catch (error:any) {
        console.log('Failed to fetch user data:', error?.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.membershipCard}>

      {/* TOP SECTION */}
      <View style={styles.membershipTopRow}>

        <View>
          <Text style={styles.membershipLabel}>
            YOUR MEMBERSHIP
          </Text>

          <Text style={styles.membershipPlan}>
            {planName || 'No Plan'}
          </Text>

          {/* STATUS */}
          <View style={styles.activePill}>

            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: isActive
                  ? '#22C55E'
                  : '#EF4444',
                marginRight: 6,
              }}
            />

            <Text
              style={{
                color: isActive
                  ? '#22C55E'
                  : '#EF4444',
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              {isActive ? 'Active' : 'Inactive'}
            </Text>

          </View>
        </View>

        {/* ICON */}
        <View style={styles.crownBadge}>
          <Ionicons
            name="ribbon-outline"
            size={26}
            color="#FFFFFF"
          />
        </View>

      </View>

      <View style={styles.divider} />

      {/* MEMBERSHIP STATS */}
      <View style={styles.membershipStatsRow}>

        {/* MEMBER SINCE */}
        <View style={styles.membershipStatItem}>

          <Feather
            name="calendar"
            size={16}
            color="#FFFFFF"
          />

          <Text style={styles.membershipStatLabel}>
            Member Since
          </Text>

          <Text style={styles.membershipStatValue}>
            {memberSince || 'N/A'}
          </Text>

        </View>

        {/* MONTHLY FEE */}
        <View style={styles.membershipStatItem}>

          <Feather
            name="tag"
            size={16}
            color="#7C5CFC"
          />

          <Text style={styles.membershipStatLabel}>
            Monthly Fee
          </Text>

          <Text style={styles.membershipStatValue}>
            Rs. {planPrice.toLocaleString()}
          </Text>

        </View>

      </View>

    </View>
  );
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
  },
});