from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
from datetime import datetime
import os
from dotenv import load_dotenv

from services.risk_predictor import RiskPredictor
from services.alert_generator import AlertGenerator
from services.explainable_rules import ExplainableRules

load_dotenv()

app = FastAPI(
    title="MedIQ AI Service",
    description="AI-powered risk prediction and alert generation for healthcare",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
        os.getenv("BACKEND_URL", "http://localhost:5000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
risk_predictor = RiskPredictor()
alert_generator = AlertGenerator()
explainable_rules = ExplainableRules()

# Request/Response Models
class VitalSigns(BaseModel):
    heartRate: Optional[float] = None
    systolicBP: Optional[float] = None
    diastolicBP: Optional[float] = None
    oxygenSaturation: Optional[float] = None
    respiratoryRate: Optional[float] = None
    temperature: Optional[float] = None
    timestamp: Optional[str] = None

class PatientData(BaseModel):
    patientId: str
    vitals: VitalSigns
    age: Optional[int] = None
    medicalHistory: Optional[List[str]] = None
    currentMedications: Optional[List[str]] = None
    labResults: Optional[Dict[str, Any]] = None

class RiskAssessmentRequest(BaseModel):
    patientData: PatientData
    historicalVitals: Optional[List[VitalSigns]] = None

class RiskAssessmentResponse(BaseModel):
    patientId: str
    riskScore: float
    riskLevel: str
    explanation: str
    contributingFactors: List[str]
    recommendations: List[str]
    timestamp: str

class AlertRequest(BaseModel):
    patientId: str
    vitals: VitalSigns
    riskScore: float
    riskLevel: str

class AlertResponse(BaseModel):
    alertId: str
    patientId: str
    alertType: str
    severity: str
    message: str
    explanation: str
    actionableSteps: List[str]
    timestamp: str

# Health check
@app.get("/")
async def root():
    return {
        "service": "MedIQ AI Service",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "ai-service"}

# Risk Prediction Endpoint
@app.post("/api/ai/assess-risk", response_model=RiskAssessmentResponse)
async def assess_risk(request: RiskAssessmentRequest):
    """
    Assess patient risk based on vital signs and medical history
    """
    try:
        vitals = request.patientData.vitals
        
        # Calculate risk score using ML + rule-based logic
        risk_score, risk_level, factors = risk_predictor.calculate_risk(
            vitals=vitals,
            age=request.patientData.age,
            medical_history=request.patientData.medicalHistory or [],
            historical_vitals=request.historicalVitals or []
        )
        
        # Generate explainable explanation
        explanation = explainable_rules.generate_explanation(
            risk_score=risk_score,
            risk_level=risk_level,
            vitals=vitals,
            contributing_factors=factors
        )
        
        # Generate recommendations
        recommendations = explainable_rules.generate_recommendations(
            risk_level=risk_level,
            vitals=vitals,
            factors=factors
        )
        
        return RiskAssessmentResponse(
            patientId=request.patientData.patientId,
            riskScore=round(risk_score, 2),
            riskLevel=risk_level,
            explanation=explanation,
            contributingFactors=factors,
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Alert Generation Endpoint
@app.post("/api/ai/generate-alert", response_model=AlertResponse)
async def generate_alert(request: AlertRequest):
    """
    Generate explainable alerts based on patient risk
    """
    try:
        alert = alert_generator.generate_alert(
            patient_id=request.patientId,
            vitals=request.vitals,
            risk_score=request.riskScore,
            risk_level=request.riskLevel
        )
        
        return AlertResponse(
            alertId=alert["alertId"],
            patientId=alert["patientId"],
            alertType=alert["alertType"],
            severity=alert["severity"],
            message=alert["message"],
            explanation=alert["explanation"],
            actionableSteps=alert["actionableSteps"],
            timestamp=alert["timestamp"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Batch Risk Assessment
@app.post("/api/ai/batch-assess-risk")
async def batch_assess_risk(patients: List[RiskAssessmentRequest]):
    """
    Assess risk for multiple patients at once
    """
    results = []
    for patient_request in patients:
        try:
            result = await assess_risk(patient_request)
            results.append(result)
        except Exception as e:
            results.append({
                "patientId": patient_request.patientData.patientId,
                "error": str(e)
            })
    return {"results": results, "total": len(results)}

# Explainable Rules Endpoint
@app.get("/api/ai/explain-rules")
async def explain_rules():
    """
    Get explainable rules used for risk assessment
    """
    return explainable_rules.get_all_rules()

# Risk Heatmap Data
@app.post("/api/ai/risk-heatmap")
async def generate_risk_heatmap(patients: List[PatientData]):
    """
    Generate risk heatmap data for multiple patients
    """
    heatmap_data = []
    
    for patient in patients:
        try:
            risk_score, risk_level, _ = risk_predictor.calculate_risk(
                vitals=patient.vitals,
                age=patient.age,
                medical_history=patient.medicalHistory or []
            )
            
            heatmap_data.append({
                "patientId": patient.patientId,
                "riskScore": round(risk_score, 2),
                "riskLevel": risk_level,
                "vitals": patient.vitals.dict()
            })
        except Exception as e:
            continue
    
    return {"heatmap": heatmap_data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


