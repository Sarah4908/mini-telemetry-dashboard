# 🛰 Satellite Telemetry Monitoring & Anomaly Detection System

A real-time satellite telemetry monitoring dashboard with statistical anomaly detection using Isolation Forest.

This system simulates satellite telemetry data, processes it through a machine learning anomaly detection service, and visualizes system health in a live dashboard.

---

## 🚀 Live Deployment

Frontend (Vercel):
https://mini-telemetry-dashboard.vercel.app

Backend (Render):
https://mini-telemetry-dashboard.onrender.com

---

## 📊 Features

- Real-time telemetry simulation (Temperature, Voltage, Altitude)
- Machine learning–based anomaly detection
- Live anomaly scoring
- System status indicator
- Telemetry history visualization
- Backend connectivity monitoring
- Diagnosis panel for detected irregularities

---

## 🧠 Anomaly Detection Logic

The backend uses:

- **Isolation Forest**
- Trained on normal telemetry distribution
- Detects statistical deviations from learned patterns

Features used:
- Temperature
- Voltage
- Altitude
- Temperature delta
- Voltage delta
- Rolling temperature mean

The model outputs:
- `anomalyScore`
- `isAnomaly` flag

---
## 🏗 Architecture
React Frontend (Vite + Chart.js)
↓
FastAPI ML Microservice
↓
Isolation Forest Model (joblib)

### Frontend
- React (Vite)
- Chart.js
- Fetch API polling every 2 seconds

### Backend
- FastAPI
- scikit-learn
- joblib
- NumPy

---

## ⚙️ Local Setup

### Clone Repository

```bash
git clone https://github.com/Sarah4908/mini-telemetry-dashboard.git
cd mini-telemetry-dashboard
```

 ### Backend Setup
 ```bash
cd backend/ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

### Frontend Setup
```bash
cd ../../
npm install
npm run dev
Environment Variables
```

### For production (Vercel):
```bash
VITE_API_URL=https://mini-telemetry-dashboard.onrender.com
```