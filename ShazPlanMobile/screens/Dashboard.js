import React from "react"
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native"
import { PieChart, LineChart } from "react-native-chart-kit"
import NumberCard from "../components/NumberCard"
import ChartCard from "../components/ChartCard"

export default function Dashboard({ store }) {
  const incomeTotal = store.income.reduce((sum, i) => sum + i.amount, 0)
  const commitmentsTotal = store.commitments.reduce((sum, c) => sum + c.amount, 0)
  const leftover = incomeTotal - commitmentsTotal

  const wasted = store.commitments
    .filter(c => ["Wants", "Shopping", "Misc"].includes(c.category))
    .reduce((sum, c) => sum + c.amount, 0)

  const savingsTotal = store.savings.reduce((sum, s) => sum + s.balance, 0)
  const debtTotal = store.debts.reduce((sum, d) => sum + d.balance, 0)
  const depositTotal = store.deposit || 0

  const actualLeftover = leftover - wasted

  const lastMonthIncome = store.incomeLastMonth || 0
  const lastMonthDebt = store.debtLastMonth || debtTotal

  const incomeColor = () =>
    incomeTotal < lastMonthIncome ? "#f44336" :
    incomeTotal === lastMonthIncome ? "#ff9800" : "#4caf50"

  const commitmentsColor = () =>
    commitmentsTotal / incomeTotal > 0.6 ? "#f44336" :
    commitmentsTotal / incomeTotal > 0.4 ? "#ff9800" : "#4caf50"

  const leftoverColor = () =>
    leftover < 1000 ? "#f44336" :
    leftover < 2000 ? "#ff9800" : "#4caf50"

  const wastedColor = () =>
    wasted > 300 ? "#f44336" :
    wasted > 100 ? "#ff9800" : "#4caf50"

  const savingsColor = () =>
    savingsTotal < 10000 ? "#f44336" :
    savingsTotal < 20000 ? "#ff9800" : "#4caf50"

  const debtColor = () =>
    debtTotal > lastMonthDebt ? "#f44336" :
    debtTotal === lastMonthDebt ? "#ff9800" : "#4caf50"

  const depositColor = () =>
    depositTotal < 6000 ? "#f44336" :
    depositTotal < 18000 ? "#ff9800" : "#4caf50"

  const screenWidth = Dimensions.get("window").width

  return (
    <ScrollView style={styles.container}>

      {/* TOP GRID */}
      <View style={styles.grid}>
        <NumberCard title="Income" value={incomeTotal} color={incomeColor()} />
        <NumberCard title="Commitments" value={commitmentsTotal} color={commitmentsColor()} />

        <NumberCard title="Leftover" value={leftover} color={leftoverColor()} />
        <NumberCard title="Wasted Money" value={wasted} color={wastedColor()} />
      </View>

      {/* SECOND GRID */}
      <View style={styles.grid}>
        <NumberCard title="Savings" value={savingsTotal} color={savingsColor()} />
        <NumberCard title="Debt" value={debtTotal} color={debtColor()} />

        <NumberCard title="Deposit" value={depositTotal} color={depositColor()} />
        <NumberCard title="Actual Leftover" value={actualLeftover} color={leftoverColor()} />
      </View>

      {/* CHARTS */}
      <View style={styles.grid}>
        <ChartCard title="Income vs Commitments Pie">
          <PieChart
            data={[
              { name: "Income", amount: incomeTotal, color: "#4caf50", legendFontColor: "#fff", legendFontSize: 12 },
              { name: "Commitments", amount: commitmentsTotal, color: "#f44336", legendFontColor: "#fff", legendFontSize: 12 },
              { name: "Leftover", amount: leftover, color: "#2196f3", legendFontColor: "#fff", legendFontSize: 12 }
            ]}
            width={screenWidth - 40}
            height={180}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </ChartCard>

        <ChartCard title="Wasted vs Actual Leftover Pie">
          <PieChart
            data={[
              { name: "Wasted", amount: wasted, color: "#ff9800", legendFontColor: "#fff", legendFontSize: 12 },
              { name: "Actual Leftover", amount: actualLeftover, color: "#4caf50", legendFontColor: "#fff", legendFontSize: 12 }
            ]}
            width={screenWidth - 40}
            height={180}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </ChartCard>

        <ChartCard title="Savings vs Debt Pie">
          <PieChart
            data={[
              { name: "Savings", amount: savingsTotal, color: "#00bcd4", legendFontColor: "#fff", legendFontSize: 12 },
              { name: "Debt", amount: debtTotal, color: "#e91e63", legendFontColor: "#fff", legendFontSize: 12 }
            ]}
            width={screenWidth - 40}
            height={180}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </ChartCard>

        <ChartCard title="Income Trend">
          <LineChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr"],
              datasets: [{ data: [500, 600, 550, 700] }]
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#1a1a1a",
              backgroundGradientFrom: "#1a1a1a",
              backgroundGradientTo: "#1a1a1a",
              decimalPlaces: 0,
              color: () => "#4caf50",
              labelColor: () => "#fff"
            }}
            bezier
          />
        </ChartCard>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#111"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20
  }
})