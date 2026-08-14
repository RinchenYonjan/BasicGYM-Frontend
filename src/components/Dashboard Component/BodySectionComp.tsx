import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OverviewItem {
  icon: React.ReactNode;
  bgColor: string;
  value: string;
  label: string;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
}


export default function BodySectionComp() {
  const overviewItems: OverviewItem[] = [
    {
      icon: <MaterialCommunityIcons name="dumbbell" size={22} color='#7C5CFC' />,
      bgColor: '#EDE9FE',
      value: '18',
      label: 'Total Visits',
    },
    {
      icon: <Feather name="calendar" size={20} color='#22C55E' />,
      bgColor: '#DCFCE7',
      value: '90%',
      label: 'Attendance',
    },
    {
      icon: <Feather name="file-text" size={20} color="#3B82F6" />,
      bgColor: '#DBEAFE',
      value: '2',
      label: 'Due Months',
    },
    {
      icon: <Feather name="award" size={20} color="#F59E0B" />,
      bgColor: '#FEF3C7',
      value: '6',
      label: 'Months Active',
    },
  ];

  const quickActions: QuickAction[] = [
    {
      icon: <Feather name="credit-card" size={22} color='#7C5CFC' />,
      label: 'Payments',
    },
    {
      icon: <Feather name="calendar" size={22} color='#22C55E' />,
      label: 'Membership',
    },
    {
      icon: <Feather name="bar-chart-2" size={22} color="#3B82F6" />,
      label: 'Attendance',
    },
    {
      icon: <Feather name="user" size={22} color="#F59E0B" />,
      label: 'Profile',
    },
  ];

  return (
    <View style={{ marginHorizontal: 12 }}>
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.grid}> 
        {overviewItems?.map((item, idx) => (
        <View key={idx} style={styles.overviewCard}>
          <View style={[styles.overviewIconWrap, { backgroundColor: item.bgColor }]}>
            {/* {item.icon} */}
          </View>
          <Text style={styles.overviewValue}>{item.value}</Text>
          <Text style={styles.overviewLabel}>{item.label}</Text>
        </View>
      ))}
      </View>

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {quickActions.map((action, idx) => (
          <TouchableOpacity key={idx} style={styles.actionCard} activeOpacity={0.7}>
            {action.icon}
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15131F',
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  overviewCard: {
    width: '23.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECF1',
  },
  overviewIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: "red",
    justifyContent: 'center',
    marginBottom: 6,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15131F',
  },
  overviewLabel: {
    fontSize: 11,
    color: '#8B8A94',
    marginTop: 2,
  },

  actionCard: {
    width: '23.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECF1',
  },
  actionLabel: {
    fontSize: 11,
    color: '#15131F',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
})