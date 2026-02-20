from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sqlite3
import os
import random
import base64
import asyncio
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

DB_FILE = "oncocare.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scan_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            prediction TEXT,
            confidence REAL,
            gradcam_image TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.post("/api/scan")
async def scan_image(file: UploadFile = File(...)):
    contents = await file.read()
    await asyncio.sleep(1) # Simulasi loading model AI
    
    encoded_image = base64.b64encode(contents).decode("utf-8")
    gradcam_base64 = f"data:{file.content_type};base64,{encoded_image}"
    
    prediction = random.choice(["Malignant", "Benign"])
    confidence = round(random.uniform(0.75, 0.99), 4)
    timestamp = datetime.now().strftime("%d %B %Y, %H:%M")
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO scan_history (timestamp, prediction, confidence, gradcam_image)
        VALUES (?, ?, ?, ?)
    ''', (timestamp, prediction, confidence, gradcam_base64))
    
    # Ambil ID yang baru saja dibuat
    inserted_id = cursor.lastrowid 
    conn.commit()
    conn.close()
    
    return {
        "status": "success",
        "result": {
            "id": inserted_id,
            "timestamp": timestamp,
            "prediction": prediction,
            "confidence": confidence,
            "gradcam_image": gradcam_base64
        }
    }

@app.get("/api/history")
def get_history():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row 
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM scan_history ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    history_list = [dict(row) for row in rows]
    
    return {
        "status": "success",
        "data": history_list
    }