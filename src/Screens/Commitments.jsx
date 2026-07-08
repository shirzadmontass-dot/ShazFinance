import Card from "../components/Card.jsx"

export default function Commitments({ store, update, add, remove }) {
  return (
    <div>
      <Card title="Bills & Commitments">
        {store.commitments.map((item, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <strong>{item.name}</strong><br />

            <input
              type="number"
              value={item.amount}
              onChange={(e) => update(`commitments.${index}.amount`, Number(e.target.value))}
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

            <select
              value={item.category}
              onChange={(e) => update(`commitments.${index}.category`, e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "8px",
                borderRadius: "6px",
                background: "#222",
                color: "white",
                border: "1px solid #444"
              }}
            >
              <option value="Bills">Bills</option>
              <option value="Food">Food</option>
              <option value="Fuel">Fuel</option>
              <option value="Kids">Kids</option>
              <option value="Wants">Wants</option>
              <option value="Shopping">Shopping</option>
              <option value="Misc">Misc</option>
            </select>

            <button
              onClick={() => remove("commitments", index)}
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
          onClick={() => add("commitments", { name: "New Commitment", amount: 0, category: "Misc" })}
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
          + Add Commitment
        </button>
      </Card>

      <Card title="Monthly Total">
        £{store.commitments.reduce((sum, item) => sum + item.amount, 0)}
      </Card>
    </div>
  )
}
