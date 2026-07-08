import Card from "../components/Card.jsx"

export default function History({ store, update, add, remove }) {
  return (
    <div>
      <Card title="History">
        {store.history.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <strong>{item.month}</strong><br /><br />

            Leftover:
            <input
              type="number"
              value={item.leftover}
              onChange={(e) => update(`history.${index}.leftover`, Number(e.target.value))}
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

            Debt Paid:
            <input
              type="number"
              value={item.debtPaid}
              onChange={(e) => update(`history.${index}.debtPaid`, Number(e.target.value))}
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
              onClick={() => remove("history", index)}
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
          onClick={() => add("history", { month: "New Month", leftover: 0, debtPaid: 0 })}
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
          + Add History Entry
        </button>
      </Card>
    </div>
  )
}
