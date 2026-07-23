import React from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions
} from "react-native"
import { PieChart, LineChart } from "react-native-chart-kit"
import NumberCard from "../components/NumberCard"
import ChartCard from "../components/ChartCard"

const screenWidth = Dimensions.get("window").width

export default function Dashboard({ store }) {
  const incomeTotal = store.income.reduce(
    (sum, i) => sum + i.amount,
    0
  )
  const commitmentsTotal =
    store.commitments.reduce(
      (sum, c) => sum + c.amount,
      0
    )
  const leftover = incomeTotal - commitmentsTotal

  const wasted = store.commitments
    .filter((c) =>
      ["Wants", "Shopping", "Misc"].includes(
        c.category
      )
    )
    .reduce((sum, c) => sum + c.amount, 0)

  const savingsTotal = store.savings.reduce(
    (sum, s) => sum + s.balance,
    0
  )
  const debtTotal = store.debts.reduce(
    (sum, d) => sum + d.balance,
    0
  )
  const depositTotal = store.deposit || 0

  const actualLeftover = leftover - wasted

  const lastMonthIncome =
    store.incomeLastMonth || 0
  const lastMonthDebt =
    store.debtLastMonth || debtTotal

  const incomeColor = () =>
    incomeTotal < lastMonthIncome
      ? "#f87171"
      : incomeTotal === lastMonthIncome
      ? "#facc15"
      : "#4ade80"

  const commitmentsColor = () => {
    const ratio =
      incomeTotal > 0
        ? commitmentsTotal / incomeTotal
        : 1
    return ratio > 0.6
      ? "#f87171"
      : ratio > 0.4
      ? "#facc15"
      : "#4ade80"
  }

  const leftoverColor = () =>
    leftover < 1000
      ? "#f87171"
      : leftover < 2000
      ? "#f97316"
      : "#4ade80"

  const wastedColor = () =>
    wasted > 300
      ? "#f87171"
      : wasted > 100
      ? "#f97316"
      : "#4ade80"

  const savingsColor = () =>
    savingsTotal < 10000
      ? "#f87171"
      : savingsTotal < 20000
      ? "#facc15"
      : "#4ade80"

  const debtColor = () =>
    debtTotal > lastMonthDebt
      ? "#f87171"
      : debtTotal === lastMonthDebt
      ? "#facc15"
      : "#4ade80"

  const depositColor = () =>
    depositTotal < 6000
      ? "#f87171"
      : depositTotal < 18000
      ? "#f97316"
      : "#4ade80"

  const cardWidth =
    screenWidth - 2 * styles.container.padding

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
    >
      {/* HEADER / HERO */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            ShazPlan
          </Text>
          <Text style={styles.subTitle}>
            Your month in one clean view
          </Text>
        </View>

        <View style={styles.netChip}>
          <Text style={styles.netChipLabel}>
            Net position
          </Text>
          <Text style={styles.netChipValue}>
            £
            {(
              savingsTotal +
              depositTotal -
              debtTotal
            ).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* KEY NUMBERS – SINGLE COLUMN, APP-LIKE */}
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

      {/* CASH & GOALS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Cash & goals
        </Text>

        <View style={styles.stack}>
          <NumberCard
            title="Wasted money"
            value={wasted}
            color={wastedColor()}
            fullWidth
          />
          <NumberCard
            title="Actual leftover"
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
            title="House deposit"
            value={depositTotal}
            color={depositColor()}
            fullWidth
          />
        </View>
      </View>

      {/* CHARTS – ONE PER ROW ON MOBILE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Charts
        </Text>

        <View style={styles.stack}>
          <ChartCard
            title="Income vs commitments"
            fullWidth
          >
            <PieChart
              data={[
                {
                  name: "Income",
                  amount: incomeTotal,
                  color: "#22c55e",
                  legendFontColor: "#e5e7eb",
                  legendFontSize: 11
                },
                {
                  name: "Commitments",
                  amount: commitmentsTotal,
                  color: "#f97316",
                  legendFontColor: "#e5e7eb",
                  legendFontSize: 11
                },
                {
                  name: "Leftover",
                  amount: leftover,
                  color: "#3b82f6",
                  legendFontColor: "#e5e7eb",
                  legendFontSize: 11
                }
              ]}
              width={cardWidth - 16}
              height={180}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="12"
              hasLegend={true}
            />
          </ChartCard>

          <ChartCard
            title="Wasted vs actual leftover"
            fullWidth
          >
            <PieChart
              data={[
                {
                  name: "Wasted",
                  amount: wasted,
                  color: "#f97316",
                  legendFontColor: "#e5e7eb",
                  legendFontSize: 11
                },
                {
                  name: "Actual leftover",
                  amount: actualLeftover,
                  color: "#22c55e",
                  legendFontColor: "#e5e7eb",
                  legendFontSize: 11
                }
              ]}
              width={cardWidth - 16}
              height={180}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="12"
              hasLegend={true}
            />
          </ChartCard>

          <ChartCard
            title="Savings vs debt"
            fullWidth
          >
            <PieChart
              data={[
                {
                  name: "Savings",
                  amount: savingsTotal,
                  color: "#06b6d4",
                  legendFontColor: "#e5e7eb",
                  legendFontSize: 11
                },
                {
                  name: "Debt",
                  amount: debtTotal,
                  color: "#e11d48",
                  legendFontColor: "#e5e7eb",
                  legendFontSize: 11
                }
              ]}
              width={cardWidth - 16}
              height={180}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="12"
              hasLegend={true}
            />
          </ChartCard>

          <ChartCard
            title="Income trend"
            fullWidth
          >
            <LineChart
              data={{
                labels: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr"
                ],
                datasets: [
                  {
                    data: [
                      500, 600, 550, 700
                    ]
                  }
                ]
              }}
              width={cardWidth - 16}
              height={210}
              chartConfig={{
                backgroundColor: "#020617",
                backgroundGradientFrom:
                  "#020617",
                backgroundGradientTo:
                  "#020617",
                decimalPlaces: 0,
                color: () => "#22c55e",
                labelColor: () => "#9ca3af",
                propsForDots: {
                  r: "3",
                  strokeWidth: "2",
                  stroke: "#22c55e"
                },
                propsForBackgroundLines: {
                  stroke:
                    "rgba(55,65,81,0.6)"
                }
              }}
              bezier
              style={{
                borderRadius: 12
              }}
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
    paddingBottom: 24
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e5e7eb"
  },
  subTitle: {
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
    borderColor: "#1f2933",
    alignItems: "flex-end"
  },
  netChipLabel: {
    fontSize: 10,
    color: "#9ca3af"
  },
  netChipValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4ade80"
  },
  section: {
    marginBottom: 18
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 2
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 8
  },
  stack: {
    marginTop: 6,
    gap: 8
  }
})