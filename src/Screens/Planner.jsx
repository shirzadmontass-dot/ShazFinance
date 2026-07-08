import Card from "../components/Card.jsx"

export default function Planner({ store, update, add, remove }) {
  return (
    <div>
      <Card title="Monthly Planner">
        {store.planner.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <strong>{item.month}</strong><br />

            <textarea
              value={item.notes}
              onChange={(e) => update(`planner.${index}.notes`, e.target.value)}
              style={{
                marginTop: "8px",
                padding: "10px",
                width: "300px",
                height: "80px",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#222",
                color: "white"
              }}
            />

            <button
              onClick={() => remove("planner", index)}
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
          onClick={() => add("planner", { month: "New Month", notes: "" })}
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
          + Add Month
        </button>
      </Card>
    </div>
  )
}
