import Card from "../components/Card.jsx"

export default function Bank({ store, update }) {
  return (
    <div>
      <Card title="Bank Accounts (Manual Sync)">
        {store.bankAccounts.map((acc, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <strong>{acc.name}</strong><br />

            Balance:
            <input
              type="number"
              value={acc.balance}
              onChange={(e) => update(`bankAccounts.${index}.balance`, Number(e.target.value))}
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

            <div style={{ marginTop: "10px", color: "#aaa" }}>
              Last Sync: {acc.lastSync || "Never"}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
