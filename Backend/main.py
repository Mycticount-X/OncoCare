from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
import base64

app = FastAPI(title="OncoCare API", description="API untuk deteksi Kanker Payudara")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "OncoCare API is running!"}

@app.post("/api/scan")
async def scan_image(file: UploadFile = File(...)):
    contents = await file.read()
    
    await asyncio.sleep(2)
    
    classes = ["Malignant", "Benign"]
    predicted_class = random.choice(classes)
    confidence = round(random.uniform(0.75, 0.99), 4) # Placeholder confidence score
    
    # Placeholder: Logika Grad-CAM
    encoded_image = base64.b64encode(contents).decode("utf-8")
    gradcam_placeholder = f"data:{file.content_type};base64,{encoded_image}"
    
    return {
        "status": "success",
        "filename": file.filename,
        "result": {
            "prediction": predicted_class,
            "confidence": confidence,
            "gradcam_image": gradcam_placeholder
        }
    }