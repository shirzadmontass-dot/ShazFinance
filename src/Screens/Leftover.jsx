import Card from "../components/Card.jsx"

export default function Leftover({ store }) {
  const incomeTotal = store.income.reduce((sum, i) => sum + i.amount, 0)
  const commitmentsTotal = store.commitments.reduce((sum, c) => sum + c.amount, 0)
  const leftover = incomeTotal - commitmentsTotal

  return (
    <div>
      <Card title="Leftover Money">£{leftover}</Card>

      <Card title="Breakdown">
        Income: £{incomeTotal}<br />
        Commitments: £{commitmentsTotal}
      </Card>
    </div>
  )
}
