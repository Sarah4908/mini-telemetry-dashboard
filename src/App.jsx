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

  const [threshold, setThreshold] = useState(80);
  const [range, setRange] = useState(10);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [utcTime, setUtcTime] = useState("");
  const [showExplain, setShowExplain] = useState(false);

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
        temperature: [...prev.temperature.slice(-range), newTemp],
        voltage: [...prev.voltage.slice(-range), newVoltage],
        pressure: [...prev.pressure.slice(-range), newPressure],
      }));
    }, 2000);

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

    return () => clearInterval(interval);
  }, [range]);

  useEffect(() => {
    const clock = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(" ")[4]);
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  const isAnomaly = temperature > threshold;
  const aiConfidence = isAnomaly ? 65 : 94;

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
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: emergencyMode ? "#1a0000" : "#0f172a",
      color: "white",
      transition: "0.3s"
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: "300px",
        padding: "25px",
        background: "linear-gradient(180deg, #0f172a, #111827)",
        borderRight: "1px solid #1f2937"
      }}>
        <h2>🛰 Mission Control</h2>

        {/* Emergency Toggle */}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            style={{
              padding: "8px 12px",
              background: emergencyMode ? "red" : "#1e293b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {emergencyMode ? "Deactivate Emergency" : "Activate Emergency"}
          </button>
        </div>

        {/* Threshold Slider */}
        <div style={{ marginTop: "25px" }}>
          <h3>🌡 Temp Threshold: {threshold}°C</h3>
          <input
            type="range"
            min="70"
            max="100"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        {/* Range Slider */}
        <div style={{ marginTop: "25px" }}>
          <h3>📈 Data Points: {range}</h3>
          <input
            type="range"
            min="5"
            max="20"
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        {/* AI Confidence */}
        <div style={{ marginTop: "25px" }}>
          <h3>🧠 AI Confidence</h3>
          <div style={{
            background: "#1e293b",
            height: "10px",
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${aiConfidence}%`,
              background: isAnomaly ? "red" : "lime",
              height: "100%",
              transition: "0.5s"
            }} />
          </div>
          <p style={{ fontSize: "14px" }}>{aiConfidence}%</p>
        </div>

        {/* UTC Clock */}
        <div style={{ marginTop: "25px" }}>
          <h3>🌍 UTC Time</h3>
          <p style={{ fontSize: "18px" }}>{utcTime}</p>
        </div>
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
          <h2 style={{
            color: isAnomaly ? "red" : "#22c55e",
            animation: emergencyMode && isAnomaly ? "blink 1s infinite" : "none"
          }}>
            Status: {isAnomaly ? "🔴 Anomaly Detected" : "🟢 Normal"}
          </h2>

          <button
            onClick={() => setShowExplain(true)}
            style={{
              marginTop: "10px",
              padding: "8px 14px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            🧠 Explain Anomaly
          </button>
        </div>

        <div style={{
          marginTop: "40px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <Line data={data} />
        </div>

        {/* Logs */}
        <div style={{
          marginTop: "30px",
          background: "#111827",
          padding: "20px",
          borderRadius: "10px",
          height: "200px",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "13px"
        }}>
          <h3>📋 Live System Logs</h3>
          {history.temperature.slice(-6).map((temp, i) => (
            <p key={i} style={{ color: temp > threshold ? "red" : "#22c55e" }}>
              [{new Date().toLocaleTimeString()}] Temp: {temp.toFixed(2)}°C
            </p>
          ))}
        </div>
      </div>

      {/* SUBSYSTEM HEALTH */}
      <div style={{
        marginTop: "30px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
      }}>

        <SubsystemCard
          title="⚡ Power System"
          status={voltage > 3.4 ? "Warning" : "Nominal"}
          value={voltage.toFixed(2) + " V"}
        />

        <SubsystemCard
          title="🔥 Thermal Control"
          status={temperature > threshold ? "Critical" : "Stable"}
          value={temperature.toFixed(2) + " °C"}
        />

        <SubsystemCard
          title="📡 Communication"
          status={Math.random() > 0.2 ? "Connected" : "Weak Signal"}
          value="Signal Locked"
        />

        <SubsystemCard
          title="🧭 Navigation"
          status="Operational"
          value="Orbit Stable"
        />
      </div>

      {/* QUICK ANALYTICS */}
      <div style={{
        marginTop: "30px",
        background: "#1e293b",
        padding: "20px",
        borderRadius: "10px"
      }}>
        <h3>📊 Quick Analytics</h3>
        <p>Max Temp: {Math.max(...history.temperature, 0).toFixed(2)} °C</p>
        <p>Min Voltage: {Math.min(...history.voltage, 3.3).toFixed(2)} V</p>
        <p>Pressure Avg: {
          history.pressure.length
            ? (history.pressure.reduce((a,b)=>a+b,0) / history.pressure.length).toFixed(2)
            : "0"
        } Pa</p>
      </div>

      {/* COMMAND CONSOLE */}
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

      {/* Modal */}
      {showExplain && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "#111827",
            padding: "30px",
            borderRadius: "10px",
            width: "400px"
          }}>
            <h3>AI Explanation</h3>
            <p>
              {isAnomaly
                ? "Temperature exceeded adaptive threshold. Model predicts thermal instability risk in next orbit cycle."
                : "Telemetry stable. No anomaly risk predicted."}
            </p>
            <button
              onClick={() => setShowExplain(false)}
              style={{
                marginTop: "15px",
                padding: "6px 12px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "6px"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>
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

function SubsystemCard({ title, status, value }) {
  const getColor = () => {
    if (status === "Critical") return "red";
    if (status === "Warning" || status === "Weak Signal") return "orange";
    if (status === "Connected" || status === "Operational" || status === "Stable" || status === "Nominal") return "lime";
    return "white";
  };

  return (
    <div style={{
      background: "#111827",
      padding: "15px",
      borderRadius: "10px",
      borderLeft: `4px solid ${getColor()}`
    }}>
      <h4>{title}</h4>
      <p style={{ margin: "5px 0", fontSize: "14px" }}>Status: 
        <span style={{ color: getColor(), marginLeft: "5px" }}>
          {status}
        </span>
      </p>
      <p style={{ fontSize: "18px" }}>{value}</p>
    </div>
  );
}

export default App;