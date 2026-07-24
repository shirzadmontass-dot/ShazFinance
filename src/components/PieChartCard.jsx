import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PieChartCard({ title, labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: [
          "#4e9eff",
          "#ff6384",
          "#36a2eb",
          "#ffcd56",
          "#8bc34a",
          "#e91e63",
          "#9c27b0"
        ],
        borderColor: "#222",
        borderWidth: 2
      }
    ]
  }

  return (
    <div style={{
      background: "#222",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      border: "1px solid #333"
    }}>
      <h3 style={{ marginBottom: "12px", color: "white" }}>{title}</h3>
      <Pie data={data} />
    </div>
  )
}
