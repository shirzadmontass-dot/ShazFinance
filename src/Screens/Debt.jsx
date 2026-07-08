import Card from "../components/Card.jsx"

export default function Debt({ store, update, add, remove }) {
  return (
    <div>
      <Card title="Debts">
        {store.debts.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <strong>{item.name}</strong><br />

            Balance:
            <input
              type="number"
              value={item.balance}
              onChange={(e) => update(`debts.${index}.balance`, Number(e.target.value))}
              style={{
                marginLeft: "10px",
                padding: "6px",
                width: "150px",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#222",
                color: "white"
              }}
            /><br /><br />

            Minimum Payment:
            <input
              type="number"
              value={item.minPayment}
              onChange={(e) => update(`debts.${index}.minPayment`, Number(e.target.value))}
              style={{
                marginLeft: "10px",
                padding: "6px",
                width: "150px",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#222",
                color: "white"
              }}
            />

            <button
              onClick={() => remove("debts", index)}
              style={{
                marginLeft: "10px",
                padding: "6px 12px",
                background: "#aa0000",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() => add("debts", { name: "New Debt", balance: 0, minPayment: 0 })}
          style={{
            marginTop: "10px",
            padding: "10px 16px",
            background: "#0066ff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          + Add Debt
        </button>
      </Card>

      <Card title="Total Debt">
        £{store.debts.reduce((sum, d) => sum + d.balance, 0)}
      </Card>
    </div>
  )
}
