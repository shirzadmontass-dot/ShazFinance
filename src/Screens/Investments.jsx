import Card from "../components/Card.jsx"

export default function Investments({ store, update, add, remove }) {
  return (
    <div>
      <Card title="Investments">
        {store.investments.map((item, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <strong>{item.name}</strong><br />

            <input
              type="number"
              value={item.balance}
              onChange={(e) => update(`investments.${index}.balance`, Number(e.target.value))}
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
              onClick={() => remove("investments", index)}
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
          onClick={() => add("investments", { name: "New Investment", balance: 0 })}
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
          + Add Investment
        </button>
      </Card>

      <Card title="Total Investments">
        £{store.investments.reduce((sum, i) => sum + i.balance, 0)}
      </Card>
    </div>
  )
}
