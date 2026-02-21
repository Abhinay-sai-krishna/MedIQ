from typing import Dict, List
from datetime import datetime
import uuid
from pydantic import BaseModel

class VitalSigns(BaseModel):
    heartRate: Optional[float] = None
    systolicBP: Optional[float] = None
    diastolicBP: Optional[float] = None
    oxygenSaturation: Optional[float] = None
    respiratoryRate: Optional[float] = None
    temperature: Optional[float] = None

class AlertGenerator:
    """
    Generate explainable alerts based on patient risk and vital signs
    """
    
    def generate_alert(
        self,
        patient_id: str,
        vitals: VitalSigns,
        risk_score: float,
        risk_level: str
    ) -> Dict:
        """
        Generate an explainable alert with actionable steps
        """
        alert_id = str(uuid.uuid4())
        
        # Determine alert type and severity
        alert_type, severity, message = self._determine_alert_type(
            vitals, risk_score, risk_level
        )
        
        # Generate explanation
        explanation = self._generate_explanation(
            vitals, risk_score, risk_level, alert_type
        )
        
        # Generate actionable steps
        actionable_steps = self._generate_actionable_steps(
            vitals, risk_level, alert_type
        )
        
        return {
            "alertId": alert_id,
            "patientId": patient_id,
            "alertType": alert_type,
            "severity": severity,
            "message": message,
            "explanation": explanation,
            "actionableSteps": actionable_steps,
            "timestamp": datetime.now().isoformat()
        }
    
    def _determine_alert_type(
        self,
        vitals: VitalSigns,
        risk_score: float,
        risk_level: str
    ) -> tuple:
        """Determine alert type, severity, and message"""
        
        # Critical alerts
        if risk_level == "critical":
            if vitals.oxygenSaturation and vitals.oxygenSaturation < 90:
                return (
                    "respiratory_distress",
                    "critical",
                    f"Critical: Oxygen saturation at {vitals.oxygenSaturation}% - Immediate intervention required"
                )
            elif vitals.heartRate and (vitals.heartRate < 40 or vitals.heartRate > 150):
                return (
                    "cardiac_alert",
                    "critical",
                    f"Critical: Heart rate {vitals.heartRate} bpm - Cardiac monitoring required"
                )
            elif vitals.systolicBP and vitals.systolicBP < 80:
                return (
                    "hypotension",
                    "critical",
                    f"Critical: Systolic BP {vitals.systolicBP} mmHg - Hypotension detected"
                )
            else:
                return (
                    "high_risk",
                    "critical",
                    f"Critical: Patient risk score {risk_score:.1f} - Immediate assessment required"
                )
        
        # High risk alerts
        elif risk_level == "high":
            if vitals.oxygenSaturation and vitals.oxygenSaturation < 93:
                return (
                    "oxygen_desaturation",
                    "warning",
                    f"Warning: Oxygen saturation {vitals.oxygenSaturation}% - Monitor closely"
                )
            elif vitals.respiratoryRate and vitals.respiratoryRate > 24:
                return (
                    "tachypnea",
                    "warning",
                    f"Warning: Respiratory rate {vitals.respiratoryRate} breaths/min - Elevated"
                )
            elif vitals.temperature and vitals.temperature > 101:
                return (
                    "fever",
                    "warning",
                    f"Warning: Temperature {vitals.temperature}°F - Fever detected"
                )
            else:
                return (
                    "elevated_risk",
                    "warning",
                    f"Warning: Patient risk score {risk_score:.1f} - Increased monitoring recommended"
                )
        
        # Medium risk alerts
        elif risk_level == "medium":
            return (
                "moderate_risk",
                "info",
                f"Info: Patient risk score {risk_score:.1f} - Continue routine monitoring"
            )
        
        # Low risk
        else:
            return (
                "stable",
                "info",
                f"Info: Patient risk score {risk_score:.1f} - Patient stable"
            )
    
    def _generate_explanation(
        self,
        vitals: VitalSigns,
        risk_score: float,
        risk_level: str,
        alert_type: str
    ) -> str:
        """Generate explainable explanation for the alert"""
        
        explanations = {
            "respiratory_distress": (
                f"Patient's oxygen saturation ({vitals.oxygenSaturation}%) is critically low. "
                f"This indicates potential respiratory failure or severe hypoxemia. "
                f"Normal range is 95-100%. Immediate oxygen therapy and respiratory support may be required."
            ),
            "cardiac_alert": (
                f"Patient's heart rate ({vitals.heartRate} bpm) is outside normal range (60-100 bpm). "
                f"This may indicate cardiac arrhythmia, stress response, or medication effects. "
                f"Continuous cardiac monitoring and ECG assessment recommended."
            ),
            "hypotension": (
                f"Patient's systolic blood pressure ({vitals.systolicBP} mmHg) is below normal range (90-140 mmHg). "
                f"This may indicate shock, dehydration, or cardiovascular compromise. "
                f"Fluid resuscitation and blood pressure support may be necessary."
            ),
            "oxygen_desaturation": (
                f"Patient's oxygen saturation ({vitals.oxygenSaturation}%) is below optimal range (95-100%). "
                f"This suggests mild to moderate hypoxemia. Monitor for signs of respiratory distress "
                f"and consider supplemental oxygen if trend continues."
            ),
            "tachypnea": (
                f"Patient's respiratory rate ({vitals.respiratoryRate} breaths/min) is elevated above normal (12-20/min). "
                f"This may indicate respiratory distress, anxiety, or metabolic acidosis. "
                f"Assess for underlying causes and monitor for progression."
            ),
            "fever": (
                f"Patient's temperature ({vitals.temperature}°F) indicates fever. "
                f"This may suggest infection or inflammatory process. "
                f"Consider infection workup and antipyretic management."
            ),
            "elevated_risk": (
                f"Patient's overall risk score ({risk_score:.1f}) indicates elevated risk. "
                f"Multiple vital signs are outside normal ranges, suggesting potential clinical deterioration. "
                f"Increased monitoring frequency and clinical assessment recommended."
            ),
            "moderate_risk": (
                f"Patient's risk score ({risk_score:.1f}) indicates moderate risk. "
                f"Some vital signs are slightly outside normal ranges. "
                f"Continue routine monitoring and assess for trends."
            ),
            "stable": (
                f"Patient's risk score ({risk_score:.1f}) indicates stable condition. "
                f"Vital signs are within acceptable ranges. "
                f"Continue standard monitoring protocols."
            ),
            "high_risk": (
                f"Patient's risk score ({risk_score:.1f}) indicates high risk requiring immediate attention. "
                f"Multiple abnormal vital signs detected. "
                f"Immediate clinical assessment and intervention may be necessary."
            )
        }
        
        return explanations.get(alert_type, "Alert generated based on patient vital signs and risk assessment.")
    
    def _generate_actionable_steps(
        self,
        vitals: VitalSigns,
        risk_level: str,
        alert_type: str
    ) -> List[str]:
        """Generate actionable steps based on alert type"""
        
        steps_map = {
            "respiratory_distress": [
                "Administer supplemental oxygen immediately",
                "Notify respiratory therapy",
                "Consider non-invasive ventilation if indicated",
                "Obtain arterial blood gas (ABG) analysis",
                "Notify physician/rapid response team",
                "Monitor oxygen saturation continuously"
            ],
            "cardiac_alert": [
                "Place patient on continuous cardiac monitoring",
                "Obtain 12-lead ECG",
                "Notify cardiology if available",
                "Check for medication effects",
                "Assess for signs of cardiac compromise",
                "Notify physician immediately"
            ],
            "hypotension": [
                "Assess fluid status and hydration",
                "Consider IV fluid bolus if indicated",
                "Check for signs of bleeding or shock",
                "Monitor blood pressure every 15 minutes",
                "Notify physician",
                "Assess for medication effects"
            ],
            "oxygen_desaturation": [
                "Assess patient's respiratory effort",
                "Consider supplemental oxygen",
                "Monitor oxygen saturation trend",
                "Assess for signs of respiratory distress",
                "Notify nurse/physician if trend continues"
            ],
            "tachypnea": [
                "Assess for signs of respiratory distress",
                "Check for anxiety or pain",
                "Monitor respiratory rate trend",
                "Consider oxygen support if indicated",
                "Notify healthcare provider"
            ],
            "fever": [
                "Obtain cultures if infection suspected",
                "Administer antipyretics as ordered",
                "Monitor temperature trend",
                "Assess for signs of infection",
                "Notify physician for infection workup"
            ],
            "elevated_risk": [
                "Increase monitoring frequency",
                "Notify primary care team",
                "Review patient's medical history",
                "Assess for clinical deterioration",
                "Consider escalation of care"
            ],
            "moderate_risk": [
                "Continue routine monitoring",
                "Document vital signs",
                "Assess for trends",
                "Notify if condition changes"
            ],
            "stable": [
                "Continue standard monitoring",
                "Document vital signs",
                "Maintain current care plan"
            ],
            "high_risk": [
                "Immediate clinical assessment required",
                "Notify rapid response team",
                "Increase monitoring frequency",
                "Prepare for potential intervention",
                "Document all findings"
            ]
        }
        
        return steps_map.get(alert_type, [
            "Monitor patient closely",
            "Notify healthcare provider",
            "Document findings"
        ])


