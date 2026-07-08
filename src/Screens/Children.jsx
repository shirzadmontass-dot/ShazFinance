import Card from "../components/Card.jsx"

export default function Children({ store, update, add, remove }) {
  return (
    <div>
      <Card title="Children ISA Accounts">
        {store.children.map((child, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <strong>{child.name}</strong><br />

            <input
              type="number"
              value={child.isa}
              onChange={(e) => update(`children.${index}.isa`, Number(e.target.value))}
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
              onClick={() => remove("children", index)}
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
          onClick={() => add("children", { name: "New Child", isa: 0 })}
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
          + Add Child
        </button>
      </Card>
    </div>
  )
}
