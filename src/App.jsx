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
  const [utcTime, setUtcTime] = useState("");

  const [history, setHistory] = useState({
    temperature: [],
    voltage: [],
    pressure: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newTemp = 65 + Math.random() * 20;
      const newVoltage = 3 + Math.random() * 0.5;
      const newPressure = 380 + Math.random() * 40;

      setTemperature(newTemp);
      setVoltage(newVoltage);
      setPressure(newPressure);

      setHistory((prev) => ({
        temperature: [...prev.temperature.slice(-10), newTemp],
        voltage: [...prev.voltage.slice(-10), newVoltage],
        pressure: [...prev.pressure.slice(-10), newPressure],
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const clock = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(" ")[4]);
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  const isAnomaly = temperature > 80;
  const aiConfidence = isAnomaly ? 68 : 94;

  const data = {
    labels: history.temperature.map((_, i) => i + 1),
    datasets: [
      {
        label: "Temperature (°C)",
        data: history.temperature,
        borderColor: "#00ffff",
      },
      {
        label: "Voltage (V)",
        data: history.voltage,
        borderColor: "#ffff00",
      },
      {
        label: "Pressure (Pa)",
        data: history.pressure,
        borderColor: "#00ff00",
      },
    ],
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a", color: "white" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "280px",
        padding: "25px",
        background: "linear-gradient(180deg, #0f172a, #111827)",
        borderRight: "1px solid #1f2937"
      }}>
        <h2>🛰 Mission Control</h2>

        {/* Orbit Animation */}
        <div style={{ position: "relative", width: "180px", height: "180px", margin: "30px auto" }}>
          <div style={{
            width: "60px",
            height: "60px",
            background: "radial-gradient(circle, #4fc3f7, #0d47a1)",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 20px #4fc3f7"
          }} />

          <div style={{
            width: "150px",
            height: "150px",
            border: "1px dashed rgba(255,255,255,0.3)",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "spin 8s linear infinite"
          }}>
            <div style={{
              width: "10px",
              height: "10px",
              background: "#00ffcc",
              borderRadius: "50%",
              position: "absolute",
              top: "-5px",
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: "0 0 10px #00ffcc"
            }} />
          </div>
        </div>

        {/* Signal Strength */}
        <h3>📡 Signal Strength</h3>
        <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
          {[1,2,3,4,5].map((bar) => (
            <div key={bar}
              style={{
                width: "10px",
                height: `${bar * 10}px`,
                background: "#00ff00",
                animation: "pulse 1.5s infinite alternate",
                animationDelay: `${bar * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* AI Confidence */}
        <div style={{ marginTop: "25px" }}>
          <h3>🧠 AI Confidence</h3>
          <div style={{
            background: "#1e293b",
            height: "10px",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "8px"
          }}>
            <div style={{
              width: `${aiConfidence}%`,
              background: isAnomaly ? "red" : "lime",
              height: "100%",
              transition: "0.5s"
            }} />
          </div>
          <p style={{ fontSize: "14px", marginTop: "5px" }}>{aiConfidence}%</p>
        </div>

        {/* UTC Clock */}
        <div style={{ marginTop: "25px" }}>
          <h3>🌍 UTC Time</h3>
          <p style={{ fontSize: "18px" }}>{utcTime}</p>
        </div>

        <style>
          {`
            @keyframes spin {
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes pulse {
              from { opacity: 0.4; }
              to { opacity: 1; }
            }
          `}
        </style>
      </div>

      {/* MAIN DASHBOARD */}
      <div style={{ flex: 1, padding: "40px" }}>
        <h1>🚀 Satellite Telemetry Dashboard</h1>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <Card title="Temperature (°C)" value={temperature.toFixed(2)} />
          <Card title="Voltage (V)" value={voltage.toFixed(2)} />
          <Card title="Pressure (Pa)" value={pressure.toFixed(2)} />
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2>
            Status: {isAnomaly ? "🔴 Anomaly Detected" : "🟢 Normal"}
          </h2>
        </div>

        <div style={{ marginTop: "40px", background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
          <Line data={data} />
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
      width: "200px",
      boxShadow: "0 0 10px rgba(0,255,255,0.2)"
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "24px" }}>{value}</p>
    </div>
  );
}

export default App;