# TruthCheck AI

Fake news & deepfake detection platform — website + extension + ML microservices

## 🚀 Features

- 📰 **News Verification** - Analyze news articles and headlines for authenticity
- 🎭 **AI Media Detection** - Detect AI-generated or AI-enhanced images and videos
- 📊 **Statistics Dashboard** - Track verification stats in real-time
- 📜 **Verification History** - Keep a log of all your verifications
- 🎨 **Modern UI** - Beautiful, responsive interface with glassmorphism design

## 🛠️ Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python run_server.py
   # Or using uvicorn directly:
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

The backend will be available at `http://127.0.0.1:8000`

API documentation is at `http://127.0.0.1:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/truthcheck-frontend
   ```

2. Start a simple HTTP server:
   ```bash
   python -m http.server 3000
   ```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
TruthCheck-AI/
├── backend/
│   ├── detectors/         # AI detection modules
│   ├── ensemble/          # Ensemble models
│   ├── metadata/          # Metadata checking tools
│   ├── video/             # Video analysis
│   ├── main.py            # FastAPI backend application
│   ├── database.py        # Database setup
│   ├── models.py          # SQLAlchemy models
│   ├── requirements.txt   # Python dependencies
│   └── run_server.py      # Server startup script
├── frontend/
│   └── truthcheck-frontend/
│       ├── index.html     # Main HTML file
│       ├── style.css      # Stylesheet
│       └── script.js      # JavaScript logic
└── README.md              # This file
```

## 🔧 API Endpoints

### News Verification
```http
POST /ai/verify-news
Content-Type: application/json

{
  "text": "Your news headline or article text here"
}
```

### Image Verification
```http
POST /ai/verify-image
Content-Type: multipart/form-data

file: [your image file]
```

### Video Verification
```http
POST /ai/verify-video
Content-Type: multipart/form-data

file: [your video file]
```

### Statistics
```http
GET /stats
```

### History
```http
GET /history
```

## 📝 Notes

- Currently using demo mode for AI image detection
- For production use, integrate a trained AI detection model (e.g., from Hugging Face)
- The system uses SQLite for data storage by default

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the terms of the LICENSE file.
