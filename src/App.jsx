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
  const [altitude, setAltitude] = useState(400);

  const [isAnomaly, setIsAnomaly] = useState(false);
  const [anomalyScore, setAnomalyScore] = useState(0);
  const [backendConnected, setBackendConnected] = useState(false);
  const [utcTime, setUtcTime] = useState("");

  const [history, setHistory] = useState({
    temperature: [],
    voltage: [],
    altitude: [],
  });

  // 🔥 Backend Polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const payload = {
          satelliteId: "SAT-001",
          temperature: 65 + Math.random() * 20,
          voltage: 3 + Math.random() * 0.5,
          altitude: 400 + Math.random() * 20
        };

        const API_URL =
          import.meta.env.VITE_API_URL ??
          "https://mini-telemetry-dashboard.onrender.com";

        const res = await fetch(`${API_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Backend not reachable");

        const data = await res.json();

        setTemperature(data.temperature);
        setVoltage(data.voltage);
        setAltitude(data.altitude);
        setIsAnomaly(data.isAnomaly);
        setAnomalyScore(data.anomalyScore);
        setBackendConnected(true);

        setHistory(prev => ({
          temperature: [...prev.temperature.slice(-20), data.temperature],
          voltage: [...prev.voltage.slice(-20), data.voltage],
          altitude: [...prev.altitude.slice(-20), data.altitude],
        }));

      } catch (err) {
        setBackendConnected(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // UTC Clock
  useEffect(() => {
    const clock = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(" ")[4]);
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  const chartData = {
    labels: history.temperature.map((_, i) => i + 1),
    datasets: [
      {
        label: "Temperature (°C)",
        data: history.temperature,
        borderColor: "#00ffff",
        tension: 0.4
      },
      {
        label: "Voltage (V)",
        data: history.voltage,
        borderColor: "#ffff00",
        tension: 0.4
      },
      {
        label: "Altitude",
        data: history.altitude,
        borderColor: "#00ff88",
        tension: 0.4
      }
    ]
  };

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>🛰 Mission Control</h2>

        <StatusBadge
          label="Backend"
          status={backendConnected ? "Connected" : "Disconnected"}
          good={backendConnected}
        />

        <StatusBadge
          label="System Status"
          status={isAnomaly ? "Anomaly Detected" : "Normal"}
          good={!isAnomaly}
        />

        <div style={{ marginTop: 30 }}>
          <h4>🧠 Anomaly Score</h4>
          <div style={styles.scoreBar}>
            <div
              style={{
                ...styles.scoreFill,
                width: `${Math.min(Math.abs(anomalyScore) * 100, 100)}%`,
                background: isAnomaly ? "red" : "lime"
              }}
            />
          </div>
          <p style={{ marginTop: 8 }}>{anomalyScore.toFixed(4)}</p>
        </div>

        <div style={{ marginTop: 30 }}>
          <h4>🌍 UTC Time</h4>
          <p>{utcTime}</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <h1>🚀 Satellite Telemetry Dashboard</h1>

        <div style={styles.cardGrid}>
          <MetricCard title="Temperature (°C)" value={temperature.toFixed(2)} />
          <MetricCard title="Voltage (V)" value={voltage.toFixed(2)} />
          <MetricCard title="Altitude" value={altitude.toFixed(2)} />
        </div>

        <div style={styles.chartContainer}>
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p style={{ fontSize: 26 }}>{value}</p>
    </div>
  );
}

function StatusBadge({ label, status, good }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h4>{label}</h4>
      <div
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          background: good ? "#065f46" : "#7f1d1d",
          color: good ? "#6ee7b7" : "#fca5a5",
          marginTop: 5,
          fontSize: 14
        }}
      >
        {status}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(180deg, #0f172a 0%, #0b1120 100%)",
    color: "white",
    fontFamily: "system-ui",
    overflowX: "hidden"  
  },
  sidebar: {
    width: "280px",
    padding: "30px",
    background: "#111827",
    borderRight: "1px solid #1f2937"
  },
  main: {
    flex: 1,
    padding: "40px",
    display: "flex",
    flexDirection: "column"
  },
  cardGrid: {
    display: "flex",
    gap: "20px",
    marginTop: "30px"
  },
  card: {
    flex: 1,
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px"
  },
  chartContainer: {
    flex: 1,
    marginTop: "40px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px"
  },
  scoreBar: {
    height: "10px",
    background: "#1e293b",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: 10
  },
  scoreFill: {
    height: "100%",
    transition: "0.4s"
  }
};

export default App;