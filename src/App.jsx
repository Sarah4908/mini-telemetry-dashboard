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
  const [isAnomaly, setIsAnomaly] = useState(false);
  const [anomalyScore, setAnomalyScore] = useState(0);

  const [range, setRange] = useState(10);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [utcTime, setUtcTime] = useState("");

  const [history, setHistory] = useState({
    temperature: [],
    voltage: [],
    pressure: [],
  });

  const commandBtnStyle = {
    marginRight: "10px",
    marginTop: "10px",
    padding: "8px 14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };

  // 🔥 CONNECTED TO BACKEND
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const payload = {
          satelliteId: "SAT-001",
          temperature: 65 + Math.random() * 20,
          voltage: 3 + Math.random() * 0.5,
          altitude: 400 + Math.random() * 20
        };

        const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        setTemperature(data.temperature);
        setVoltage(data.voltage);
        setPressure(data.altitude);
        setIsAnomaly(data.isAnomaly);
        setAnomalyScore(data.anomalyScore);

        setHistory((prev) => ({
          temperature: [...prev.temperature.slice(-range), data.temperature],
          voltage: [...prev.voltage.slice(-range), data.voltage],
          pressure: [...prev.pressure.slice(-range), data.altitude],
        }));

      } catch (err) {
        console.error("Backend error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [range]);

  useEffect(() => {
    const clock = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(" ")[4]);
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  const aiConfidence = isAnomaly ? 60 : 95;

  const data = {
    labels: history.temperature.map((_, i) => i + 1),
    datasets: [
      { label: "Temperature (°C)", data: history.temperature, borderColor: "#00ffff" },
      { label: "Voltage (V)", data: history.voltage, borderColor: "#ffff00" },
      { label: "Altitude", data: history.pressure, borderColor: "#00ff00" },
    ],
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: emergencyMode ? "#1a0000" : "#0f172a",
      color: "white"
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: "300px",
        padding: "25px",
        background: "linear-gradient(180deg, #0f172a, #111827)",
        borderRight: "1px solid #1f2937"
      }}>
        <h2>🛰 Mission Control</h2>

        <button
          onClick={() => setEmergencyMode(!emergencyMode)}
          style={{
            marginTop: "20px",
            padding: "8px 12px",
            background: emergencyMode ? "red" : "#1e293b",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          {emergencyMode ? "Deactivate Emergency" : "Activate Emergency"}
        </button>

        <div style={{ marginTop: "25px" }}>
          <h3>🧠 Anomaly Score</h3>
          <p>{anomalyScore.toFixed(4)}</p>
        </div>

        <div style={{ marginTop: "25px" }}>
          <h3>🌍 UTC Time</h3>
          <p>{utcTime}</p>
        </div>
      </div>

      {/* MAIN PANEL */}
      <div style={{ flex: 1, padding: "40px" }}>

        <h1>🚀 Satellite Telemetry Dashboard</h1>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <Card title="Temperature (°C)" value={temperature.toFixed(2)} />
          <Card title="Voltage (V)" value={voltage.toFixed(2)} />
          <Card title="Altitude" value={pressure.toFixed(2)} />
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2 style={{ color: isAnomaly ? "red" : "#22c55e" }}>
            Status: {isAnomaly ? "🔴 Anomaly Detected" : "🟢 Normal"}
          </h2>
        </div>

        <div style={{
          marginTop: "40px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <Line data={data} />
        </div>

        <div style={{
          marginTop: "30px",
          background: "#111827",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <h3>📡 Command Console</h3>
          <button style={commandBtnStyle}>Recalibrate Sensors</button>
          <button style={commandBtnStyle}>Stabilize Orbit</button>
          <button style={commandBtnStyle}>Reset Thermal Unit</button>
        </div>

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "10px",
      width: "200px"
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "24px" }}>{value}</p>
    </div>
  );
}

export default App;