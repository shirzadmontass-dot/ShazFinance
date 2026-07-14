import Card from "../components/Card.jsx"

export default function Deposit({ store, update }) {
  const savings = store.savings || []
  const lisaIndex = savings.findIndex(s => s.name === "LISA")
  const lisa = lisaIndex >= 0 ? savings[lisaIndex].balance : 0

  const goals = store.goals || { houseDepositTarget: 0 }
  const target = goals.houseDepositTarget || 0

  return (
    <div>
      <Card title="LISA Balance">
        <input
          type="number"
          value={lisa}
          onChange={(e) => {
            if (lisaIndex >= 0) {
              update(`savings.${lisaIndex}.balance`, Number(e.target.value))
            }
          }}
          style={{
            padding: "8px",
            width: "200px",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "white"
          }}
        />
      </Card>

      <Card title="Deposit Target">
        <input
          type="number"
          value={target}
          onChange={(e) => update("goals.houseDepositTarget", Number(e.target.value))}
          style={{
            padding: "8px",
            width: "200px",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "white"
          }}
        />
      </Card>

      <Card title="Progress">
        {target > 0 ? `${((lisa / target) * 100).toFixed(1)}%` : "No target set"}
      </Card>
    </div>
  )
}