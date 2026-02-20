from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import uuid
import os
import random

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

@app.post("/api/scan")
async def scan_image(file: UploadFile = File(...)):
    # Generate id
    file_id = str(uuid.uuid4())
    ext = file.filename.split('.')[-1]
    
    original_filename = f"{file_id}_original.{ext}"
    gradcam_filename = f"{file_id}_gradcam.{ext}"
    
    original_path = os.path.join(UPLOAD_DIR, original_filename)
    gradcam_path = os.path.join(UPLOAD_DIR, gradcam_filename)

    with open(original_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Placeholder
    prediction = random.choice(["Malignant", "Benign"])
    confidence = round(random.uniform(0.75, 0.99), 4)
    
    shutil.copyfile(original_path, gradcam_path)
    base_url = "http://localhost:8000"
    
    return {
        "status": "success",
        "result": {
            "prediction": prediction,
            "confidence": confidence,
            "original_image": f"{base_url}/uploads/{original_filename}",
            "gradcam_image": f"{base_url}/uploads/{gradcam_filename}"
        }
    }