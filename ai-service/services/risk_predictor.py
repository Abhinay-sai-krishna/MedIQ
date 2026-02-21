import numpy as np
from typing import List, Optional, Tuple
from datetime import datetime
from pydantic import BaseModel

class VitalSigns(BaseModel):
    heartRate: Optional[float] = None
    systolicBP: Optional[float] = None
    diastolicBP: Optional[float] = None
    oxygenSaturation: Optional[float] = None
    respiratoryRate: Optional[float] = None
    temperature: Optional[float] = None

class RiskPredictor:
    """
    Risk prediction using rule-based logic + simple ML scoring
    """
    
    def __init__(self):
        # Normal ranges for vital signs
        self.normal_ranges = {
            'heartRate': (60, 100),
            'systolicBP': (90, 140),
            'diastolicBP': (60, 90),
            'oxygenSaturation': (95, 100),
            'respiratoryRate': (12, 20),
            'temperature': (97.0, 99.5)  # Fahrenheit
        }
        
        # Risk weights for different vital signs
        self.risk_weights = {
            'heartRate': 0.20,
            'bloodPressure': 0.25,
            'oxygenSaturation': 0.30,
            'respiratoryRate': 0.15,
            'temperature': 0.10
        }
    
    def calculate_risk(
        self,
        vitals: VitalSigns,
        age: Optional[int] = None,
        medical_history: List[str] = [],
        historical_vitals: List[VitalSigns] = []
    ) -> Tuple[float, str, List[str]]:
        """
        Calculate risk score (0-100) and risk level
        Returns: (risk_score, risk_level, contributing_factors)
        """
        risk_score = 0.0
        contributing_factors = []
        
        # 1. Heart Rate Analysis
        if vitals.heartRate:
            hr_risk = self._assess_heart_rate(vitals.heartRate, age)
            risk_score += hr_risk * self.risk_weights['heartRate']
            if hr_risk > 50:
                contributing_factors.append(
                    f"Heart rate {vitals.heartRate} bpm is {'elevated' if vitals.heartRate > 100 else 'low'}"
                )
        
        # 2. Blood Pressure Analysis
        if vitals.systolicBP and vitals.diastolicBP:
            bp_risk = self._assess_blood_pressure(vitals.systolicBP, vitals.diastolicBP)
            risk_score += bp_risk * self.risk_weights['bloodPressure']
            if bp_risk > 50:
                contributing_factors.append(
                    f"Blood pressure {vitals.systolicBP}/{vitals.diastolicBP} mmHg is abnormal"
                )
        
        # 3. Oxygen Saturation Analysis
        if vitals.oxygenSaturation:
            spo2_risk = self._assess_oxygen_saturation(vitals.oxygenSaturation)
            risk_score += spo2_risk * self.risk_weights['oxygenSaturation']
            if spo2_risk > 50:
                contributing_factors.append(
                    f"Oxygen saturation {vitals.oxygenSaturation}% is below normal"
                )
        
        # 4. Respiratory Rate Analysis
        if vitals.respiratoryRate:
            rr_risk = self._assess_respiratory_rate(vitals.respiratoryRate)
            risk_score += rr_risk * self.risk_weights['respiratoryRate']
            if rr_risk > 50:
                contributing_factors.append(
                    f"Respiratory rate {vitals.respiratoryRate} breaths/min is abnormal"
                )
        
        # 5. Temperature Analysis
        if vitals.temperature:
            temp_risk = self._assess_temperature(vitals.temperature)
            risk_score += temp_risk * self.risk_weights['temperature']
            if temp_risk > 50:
                contributing_factors.append(
                    f"Temperature {vitals.temperature}°F indicates {'fever' if vitals.temperature > 99.5 else 'hypothermia'}"
                )
        
        # 6. Trend Analysis (if historical data available)
        if historical_vitals and len(historical_vitals) > 1:
            trend_risk = self._analyze_trends(vitals, historical_vitals)
            risk_score += trend_risk * 0.15
            if trend_risk > 30:
                contributing_factors.append("Deteriorating trend detected in vital signs")
        
        # 7. Medical History Impact
        history_risk = self._assess_medical_history(medical_history)
        risk_score += history_risk * 0.10
        
        # Normalize risk score to 0-100
        risk_score = min(100, max(0, risk_score))
        
        # Determine risk level
        if risk_score >= 75:
            risk_level = "critical"
        elif risk_score >= 50:
            risk_level = "high"
        elif risk_score >= 25:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return risk_score, risk_level, contributing_factors
    
    def _assess_heart_rate(self, hr: float, age: Optional[int] = None) -> float:
        """Assess heart rate risk (0-100)"""
        normal_min, normal_max = self.normal_ranges['heartRate']
        
        if normal_min <= hr <= normal_max:
            return 0
        elif hr < 50:
            return 60 + (50 - hr) * 2  # Very low HR
        elif hr > 120:
            return 50 + (hr - 120) * 1.5  # Elevated HR
        elif hr > 100:
            return 30 + (hr - 100) * 1.0
        else:
            return 20 + (normal_min - hr) * 1.0
    
    def _assess_blood_pressure(self, systolic: float, diastolic: float) -> float:
        """Assess blood pressure risk (0-100)"""
        normal_sys_min, normal_sys_max = self.normal_ranges['systolicBP']
        normal_dia_min, normal_dia_max = self.normal_ranges['diastolicBP']
        
        risk = 0
        
        # Systolic BP
        if systolic < normal_sys_min:
            risk += 40 + (normal_sys_min - systolic) * 2
        elif systolic > normal_sys_max:
            risk += 30 + (systolic - normal_sys_max) * 1.5
            if systolic > 180:
                risk += 30  # Hypertensive crisis
        
        # Diastolic BP
        if diastolic < normal_dia_min:
            risk += 30 + (normal_dia_min - diastolic) * 2
        elif diastolic > normal_dia_max:
            risk += 25 + (diastolic - normal_dia_max) * 1.5
            if diastolic > 120:
                risk += 25  # Hypertensive crisis
        
        return min(100, risk)
    
    def _assess_oxygen_saturation(self, spo2: float) -> float:
        """Assess oxygen saturation risk (0-100)"""
        normal_min, normal_max = self.normal_ranges['oxygenSaturation']
        
        if spo2 >= normal_min:
            return 0
        elif spo2 >= 90:
            return 30 + (normal_min - spo2) * 3
        elif spo2 >= 85:
            return 60 + (90 - spo2) * 4
        else:
            return 90 + (85 - spo2) * 5  # Critical
    
    def _assess_respiratory_rate(self, rr: float) -> float:
        """Assess respiratory rate risk (0-100)"""
        normal_min, normal_max = self.normal_ranges['respiratoryRate']
        
        if normal_min <= rr <= normal_max:
            return 0
        elif rr < 10:
            return 50 + (10 - rr) * 5  # Very low
        elif rr > 25:
            return 40 + (rr - 25) * 2  # Elevated
        elif rr > normal_max:
            return 20 + (rr - normal_max) * 1.5
        else:
            return 15 + (normal_min - rr) * 1.5
    
    def _assess_temperature(self, temp: float) -> float:
        """Assess temperature risk (0-100)"""
        normal_min, normal_max = self.normal_ranges['temperature']
        
        if normal_min <= temp <= normal_max:
            return 0
        elif temp > 102:
            return 60 + (temp - 102) * 10  # High fever
        elif temp > normal_max:
            return 30 + (temp - normal_max) * 5
        elif temp < 95:
            return 70 + (95 - temp) * 10  # Hypothermia
        else:
            return 20 + (normal_min - temp) * 5
    
    def _analyze_trends(self, current: VitalSigns, historical: List[VitalSigns]) -> float:
        """Analyze trends in vital signs"""
        if not historical:
            return 0
        
        risk = 0
        
        # Check for deteriorating trends
        if current.heartRate and historical[-1].heartRate:
            if current.heartRate > historical[-1].heartRate + 10:
                risk += 20
            elif current.heartRate < historical[-1].heartRate - 10:
                risk += 15
        
        if current.oxygenSaturation and historical[-1].oxygenSaturation:
            if current.oxygenSaturation < historical[-1].oxygenSaturation - 3:
                risk += 30  # Significant drop in SpO2
        
        if current.systolicBP and historical[-1].systolicBP:
            if current.systolicBP < historical[-1].systolicBP - 20:
                risk += 25  # Significant BP drop
        
        return min(100, risk)
    
    def _assess_medical_history(self, history: List[str]) -> float:
        """Assess risk based on medical history"""
        high_risk_conditions = [
            'diabetes', 'heart disease', 'copd', 'asthma',
            'hypertension', 'kidney disease', 'cancer'
        ]
        
        risk = 0
        for condition in history:
            condition_lower = condition.lower()
            for high_risk in high_risk_conditions:
                if high_risk in condition_lower:
                    risk += 15
        
        return min(50, risk)


