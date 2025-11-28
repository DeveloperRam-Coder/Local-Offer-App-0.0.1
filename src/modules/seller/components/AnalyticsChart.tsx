import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  card: '#1E293B',
  primary: '#38BDF8',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
};

type AnalyticsChartProps = {
  data: number[];
  title: string;
  maxValue?: number;
  barColor?: string;
};

export default function AnalyticsChart({
  data,
  title,
  maxValue,
  barColor = COLORS.primary,
}: AnalyticsChartProps) {
  const safeData = data || [];
  const max = maxValue || (safeData.length > 0 ? Math.max(...safeData) : 1);
  const height = 120;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.chart}>
        {safeData.length > 0 ? (
          safeData.map((value, index) => {
            const barHeight = (value / max) * height;
            return (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: barColor,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{value}</Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.barLabel}>No data available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '60%',
    borderRadius: 6,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.subtle,
    fontWeight: '500',
  },
});
