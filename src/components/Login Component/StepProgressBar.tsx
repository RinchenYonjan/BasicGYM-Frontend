import { StyleSheet, View } from "react-native";

type Props = {
  currentStep: number;
  totalSteps: number;
  color?: string;
};

export default function StepProgressBar({
  currentStep,
  totalSteps,
  color = "#5B2A6F",
}: Props) {
  const progress = Math.min(Math.max(currentStep / totalSteps, 0), 1) * 100;

  return (
    <View style={styles.track}>
      <View
        style={[styles.fill, { width: `${progress}%`, backgroundColor: color }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E5E5",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
});