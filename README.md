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

## screenshots
<img width="1850" height="462" alt="image" src="https://github.com/user-attachments/assets/66cb0493-21c2-44f1-bd5f-148815196cb4" />
<img width="1846" height="846" alt="image" src="https://github.com/user-attachments/assets/b7ba6620-74c4-41bd-83db-66c875ef1a9d" />
<img width="1799" height="484" alt="image" src="https://github.com/user-attachments/assets/fa2cdb4f-ee26-4102-af3b-58d7e943b7d0" />

## 📄 License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.




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
