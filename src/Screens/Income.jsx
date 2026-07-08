import Card from "../components/Card.jsx"

export default function Income({ store, update, add, remove }) {
  return (
    <div>
      <Card title="Income Sources">
        {store.income.map((item, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <strong>{item.name}</strong><br />

            <input
              type="number"
              value={item.amount}
              onChange={(e) => update(`income.${index}.amount`, Number(e.target.value))}
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
              onClick={() => remove("income", index)}
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
          onClick={() => add("income", { name: "New Income", amount: 0 })}
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
          + Add Income Source
        </button>
      </Card>

      <Card title="Monthly Total">
        £{store.income.reduce((sum, item) => sum + item.amount, 0)}
      </Card>
    </div>
  )
}
