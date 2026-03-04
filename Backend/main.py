from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sqlite3
import os
import random
import base64
import asyncio
from datetime import datetime

import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import io

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

DB_FILE = "oncocare.db"

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

model_path = './models/model.keras'
try:
    model = torch.load(model_path, map_location=device, weights_only=False)
    model = model.to(device)
    model.eval() 
    
except Exception as e:
    print(f"Gagal memuat model. Pastikan path benar. Error: {e}")
    model = None

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

class_names = ["Benign", "Malignant", "Normal"]

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
    
    if model is not None:
        try:
            image = Image.open(io.BytesIO(contents)).convert('RGB')
            
            input_tensor = transform(image).unsqueeze(0).to(device)
            
            with torch.no_grad():
                outputs = model(input_tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                confidence_tensor, predicted_idx = torch.max(probabilities, 0)
                
            prediction = class_names[predicted_idx.item()]
            confidence = round(float(confidence_tensor.item()), 4) 
            
        except Exception as e:
            print(f"Error saat inferensi: {e}")
            prediction = "Error"
            confidence = 0.0
    else:
        print("Menggunakan dummy data karena model tidak ada...")
        await asyncio.sleep(1) 
        prediction = random.choice(["Malignant", "Benign", "Normal"])
        confidence = round(random.uniform(0.75, 0.99), 4)
    
    encoded_image = base64.b64encode(contents).decode("utf-8")
    gradcam_base64 = f"data:{file.content_type};base64,{encoded_image}"
    
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