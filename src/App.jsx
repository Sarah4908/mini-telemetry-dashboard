import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function App() {
  const [temperature, setTemperature] = useState(70);
  const [voltage, setVoltage] = useState(3.3);
  const [pressure, setPressure] = useState(400);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTemp = 65 + Math.random() * 15;
      setTemperature(newTemp);
      setVoltage(3 + Math.random() * 0.5);
      setPressure(380 + Math.random() * 40);

      setHistory((prev) => [...prev.slice(-10), newTemp]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const isAnomaly = temperature > 80;

  const data = {
    labels: history.map((_, i) => i + 1),
    datasets: [
      {
        label: "Temperature",
        data: history,
        borderColor: "cyan",
      },
    ],
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: "40px", color: "white" }}>
      <h1>🚀 Satellite Telemetry Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Card title="Temperature (°C)" value={temperature.toFixed(2)} />
        <Card title="Voltage (V)" value={voltage.toFixed(2)} />
        <Card title="Pressure (Pa)" value={pressure.toFixed(2)} />
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Status: {isAnomaly ? "🔴 Anomaly Detected" : "🟢 Normal"}</h2>
      </div>

      <div style={{ marginTop: "40px", background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
        <Line data={data} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px", width: "200px" }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "24px" }}>{value}</p>
    </div>
  );
}

export default App;