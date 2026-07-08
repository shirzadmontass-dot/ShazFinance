import Card from "../components/Card.jsx"

export default function Savings({ store, update, add, remove }) {
  return (
    <div>
      <Card title="Savings Pots">
        {store.savings.map((item, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <strong>{item.name}</strong><br />

            <input
              type="number"
              value={item.balance}
              onChange={(e) => update(`savings.${index}.balance`, Number(e.target.value))}
              style={{
                marginTop: "8px",
                padding: "8px",
                width: "200px",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#222",
                color: "white"
              }}
            />

            <button
              onClick={() => remove("savings", index)}
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
          onClick={() => add("savings", { name: "New Savings Pot", balance: 0 })}
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
          + Add Savings Pot
        </button>
      </Card>

      <Card title="Total Savings">
        £{store.savings.reduce((sum, s) => sum + s.balance, 0)}
      </Card>
    </div>
  )
}
