import React from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native"

import {
  PieChart,
  LineChart
} from "react-native-chart-kit"

import NumberCard from "../components/NumberCard"
import ChartCard from "../components/ChartCard"

const screenWidth = Dimensions.get("window").width

const chartConfig = {
  backgroundColor: "#020617",
  backgroundGradientFrom: "#020617",
  backgroundGradientTo: "#020617",
  decimalPlaces: 0,
  color: (opacity = 1) =>
    `rgba(255,255,255,${opacity})`,
  labelColor: (opacity = 1) =>
    `rgba(255,255,255,${opacity})`,
  propsForBackgroundLines: {
    stroke: "#1f2937"
  }
}

function Dashboard({ store, openSidebar }) {
  if (!store) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.contentContainer
        }
      >
        <Text style={styles.loadingText}>
          Loading your ShazPlan...
        </Text>
      </ScrollView>
    )
  }

  const incomeTotal = (store.income || []).reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  )

  const commitmentsTotal = (
    store.commitments || []
  ).reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  )

  const expensesTotal = (
    store.expenses || []
  ).reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  )

  const savingsTotal = (store.savings || []).reduce(
    (sum, s) => sum + Number(s.balance || 0),
    0
  )

  const debtTotal = (store.debts || []).reduce(
    (sum, d) => sum + Number(d.balance || 0),
    0
  )

  const investmentsTotal = (
    store.investments || []
  ).reduce(
    (sum, i) => sum + Number(i.balance || 0),
    0
  )

  const depositTotal =
    store.deposit?.current ?? 0

  const leftover =
    incomeTotal -
    commitmentsTotal -
    expensesTotal

  const wasted = (store.commitments || [])
    .filter((c) =>
      ["Wants", "Shopping", "Misc"].includes(
        c.category
      )
    )
    .reduce(
      (sum, c) => sum + Number(c.amount || 0),
      0
    )

  const actualLeftover = leftover - wasted

  const lastMonthIncome =
    Number(store.incomeLastMonth || 0)
  const lastMonthDebt =
    Number(store.debtLastMonth || debtTotal)

  const netWorth =
    savingsTotal +
    investmentsTotal +
    depositTotal -
    debtTotal

  const incomeColor = () =>
    incomeTotal < lastMonthIncome
      ? "#ef4444"
      : incomeTotal === lastMonthIncome
      ? "#f97316"
      : "#22c55e"

  const commitmentsColor = () => {
    if (incomeTotal <= 0) return "#ef4444"
    const ratio =
      commitmentsTotal / incomeTotal
    if (ratio > 0.6) return "#ef4444"
    if (ratio > 0.4) return "#f97316"
    return "#22c55e"
  }

  const leftoverColor = () =>
    leftover < 0
      ? "#ef4444"
      : leftover < 1000
      ? "#f97316"
      : "#22c55e"

  const wastedColor = () =>
    wasted > 300
      ? "#ef4444"
      : wasted > 100
      ? "#f97316"
      : "#22c55e"

  const savingsColor = () =>
    savingsTotal < 10000
      ? "#f97316"
      : "#22c55e"

  const debtColor = () =>
    debtTotal > lastMonthDebt
      ? "#ef4444"
      : debtTotal === lastMonthDebt
      ? "#f97316"
      : "#22c55e"

  const depositColor = () =>
    depositTotal < 6000
      ? "#ef4444"
      : depositTotal < 18000
      ? "#f97316"
      : "#22c55e"

  const cardWidth =
    screenWidth - styles.container.padding * 2
  const pieWidth = Math.max(
    cardWidth - 24,
    160
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
    >
      {/* 3 DOTS MENU BUTTON */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={openSidebar}
      >
        <Text style={styles.menuText}>⋮</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>
            ShazPlan
          </Text>
          <Text style={styles.appSubtitle}>
            Your month in one clean view
          </Text>
        </View>

        <View style={styles.netChip}>
          <Text style={styles.netChipLabel}>
            Net Position
          </Text>
          <Text style={styles.netChipValue}>
            £{netWorth.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Overview
        </Text>
        <Text style={styles.sectionSubtitle}>
          Key numbers for this month
        </Text>

        <View style={styles.stack}>
          <NumberCard
            title="Income"
            value={incomeTotal}
            color={incomeColor()}
            fullWidth
          />
          <NumberCard
            title="Commitments"
            value={commitmentsTotal}
            color={commitmentsColor()}
            fullWidth
          />
          <NumberCard
            title="Leftover"
            value={leftover}
            color={leftoverColor()}
            fullWidth
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Cash & Goals
        </Text>
        <Text style={styles.sectionSubtitle}>
          Where your money is sitting
        </Text>

        <View style={styles.stack}>
          <NumberCard
            title="Wasted Money"
            value={wasted}
            color={wastedColor()}
            fullWidth
          />
          <NumberCard
            title="Actual Leftover"
            value={actualLeftover}
            color={leftoverColor()}
            fullWidth
          />
          <NumberCard
            title="Savings"
            value={savingsTotal}
            color={savingsColor()}
            fullWidth
          />
          <NumberCard
            title="Debt"
            value={debtTotal}
            color={debtColor()}
            fullWidth
          />
          <NumberCard
            title="House Deposit"
            value={depositTotal}
            color={depositColor()}
            fullWidth
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Charts
        </Text>
        <Text style={styles.sectionSubtitle}>
          See the shape of your money
        </Text>

        <View style={styles.stack}>
          <ChartCard
            title="Income vs Commitments vs Leftover"
            fullWidth
          >
            <PieChart
              data={[
                {
                  name: "Income",
                  amount: incomeTotal,
                  color: "#22c55e",
                  legendFontColor: "#ffffff",
                  legendFontSize: 11
                },
                {
                  name: "Commitments",
                  amount: commitmentsTotal,
                  color: "#f97316",
                  legendFontColor: "#ffffff",
                  legendFontSize: 11
                },
                {
                  name: "Leftover",
                  amount: leftover,
                  color: "#3b82f6",
                  legendFontColor: "#ffffff",
                  legendFontSize: 11
                }
              ]}
              width={pieWidth}
              height={185}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="14"
              hasLegend
              chartConfig={chartConfig}
            />
          </ChartCard>

          <ChartCard
            title="Wasted vs Actual Leftover"
            fullWidth
          >
            <PieChart
              data={[
                {
                  name: "Wasted",
                  amount: wasted,
                  color: "#f97316",
                  legendFontColor: "#ffffff",
                  legendFontSize: 11
                },
                {
                  name: "Actual Leftover",
                  amount: actualLeftover,
                  color: "#22c55e",
                  legendFontColor: "#ffffff",
                  legendFontSize: 11
                }
              ]}
              width={pieWidth}
              height={185}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="14"
              hasLegend
              chartConfig={chartConfig}
            />
          </ChartCard>

          <ChartCard
            title="Savings vs Debt"
            fullWidth
          >
            <PieChart
              data={[
                {
                  name: "Savings",
                  amount: savingsTotal,
                  color: "#3b82f6",
                  legendFontColor: "#ffffff",
                  legendFontSize: 11
                },
                {
                  name: "Debt",
                  amount: debtTotal,
                  color: "#ef4444",
                  legendFontColor: "#ffffff",
                  legendFontSize: 11
                }
              ]}
              width={pieWidth}
              height={185}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="14"
              hasLegend
              chartConfig={chartConfig}
            />
          </ChartCard>

          <ChartCard
            title="Income Trend"
            fullWidth
          >
            <LineChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr"],
                datasets: [
                  {
                    data: [500, 600, 550, 700]
                  }
                ]
              }}
              width={cardWidth - 24}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.lineChart}
            />
          </ChartCard>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#020617"
  },
  contentContainer: {
    paddingBottom: 32
  },
  loadingText: {
    marginTop: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 14
  },

  /* 3 DOTS BUTTON */
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 300
  },
  menuText: {
    color: "#22c55e",
    fontSize: 32,
    fontWeight: "700"
  },

  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff"
  },
  appSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#9ca3af"
  },
  netChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "flex-end"
  },
  netChipLabel: {
    fontSize: 10,
    color: "#9ca3af"
  },
  netChipValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22c55e"
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 8
  },
  stack: {
    marginTop: 4,
    gap: 8
  },
  lineChart: {
    borderRadius: 12
  }
})

export default Dashboard