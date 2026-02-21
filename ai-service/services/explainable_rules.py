from typing import List, Dict
from pydantic import BaseModel

class VitalSigns(BaseModel):
    heartRate: Optional[float] = None
    systolicBP: Optional[float] = None
    diastolicBP: Optional[float] = None
    oxygenSaturation: Optional[float] = None
    respiratoryRate: Optional[float] = None
    temperature: Optional[float] = None

class ExplainableRules:
    """
    Generate explainable rules and recommendations
    """
    
    def generate_explanation(
        self,
        risk_score: float,
        risk_level: str,
        vitals: VitalSigns,
        contributing_factors: List[str]
    ) -> str:
        """Generate human-readable explanation"""
        
        explanation_parts = [
            f"Patient risk assessment: {risk_level.upper()} RISK (Score: {risk_score:.1f}/100)"
        ]
        
        if contributing_factors:
            explanation_parts.append("\nContributing factors:")
            for i, factor in enumerate(contributing_factors[:5], 1):
                explanation_parts.append(f"{i}. {factor}")
        
        # Add vital-specific explanations
        vital_explanations = []
        
        if vitals.heartRate:
            if vitals.heartRate > 100:
                vital_explanations.append(
                    f"Elevated heart rate ({vitals.heartRate} bpm) may indicate stress, "
                    "pain, or cardiovascular issues."
                )
            elif vitals.heartRate < 60:
                vital_explanations.append(
                    f"Low heart rate ({vitals.heartRate} bpm) may indicate medication effects "
                    "or cardiac conduction issues."
                )
        
        if vitals.oxygenSaturation and vitals.oxygenSaturation < 95:
            vital_explanations.append(
                f"Oxygen saturation below normal ({vitals.oxygenSaturation}%) suggests "
                "potential respiratory compromise or hypoxemia."
            )
        
        if vitals.systolicBP:
            if vitals.systolicBP < 90:
                vital_explanations.append(
                    f"Low blood pressure ({vitals.systolicBP} mmHg) may indicate "
                    "hypotension, dehydration, or cardiovascular compromise."
                )
            elif vitals.systolicBP > 140:
                vital_explanations.append(
                    f"Elevated blood pressure ({vitals.systolicBP} mmHg) may indicate "
                    "hypertension or stress response."
                )
        
        if vital_explanations:
            explanation_parts.append("\nClinical interpretation:")
            explanation_parts.extend(vital_explanations)
        
        return "\n".join(explanation_parts)
    
    def generate_recommendations(
        self,
        risk_level: str,
        vitals: VitalSigns,
        factors: List[str]
    ) -> List[str]:
        """Generate actionable recommendations"""
        
        recommendations = []
        
        if risk_level == "critical":
            recommendations.extend([
                "Immediate clinical assessment required",
                "Notify rapid response team",
                "Consider escalation to ICU if appropriate",
                "Increase monitoring frequency to every 5-15 minutes",
                "Prepare for potential emergency intervention"
            ])
        elif risk_level == "high":
            recommendations.extend([
                "Increase monitoring frequency",
                "Notify primary care team",
                "Consider additional diagnostic tests",
                "Review medication regimen",
                "Assess for clinical deterioration"
            ])
        elif risk_level == "medium":
            recommendations.extend([
                "Continue routine monitoring",
                "Document vital signs",
                "Assess for trends",
                "Notify if condition changes"
            ])
        else:
            recommendations.extend([
                "Continue standard monitoring",
                "Maintain current care plan"
            ])
        
        # Vital-specific recommendations
        if vitals.oxygenSaturation and vitals.oxygenSaturation < 93:
            recommendations.append("Consider supplemental oxygen therapy")
        
        if vitals.heartRate and vitals.heartRate > 120:
            recommendations.append("Consider ECG monitoring and cardiac assessment")
        
        if vitals.systolicBP and vitals.systolicBP < 90:
            recommendations.append("Assess fluid status and consider fluid resuscitation")
        
        return recommendations[:8]  # Limit to 8 recommendations
    
    def get_all_rules(self) -> Dict:
        """Return all explainable rules used in the system"""
        return {
            "risk_levels": {
                "critical": "Risk score ≥ 75 - Immediate intervention required",
                "high": "Risk score 50-74 - Increased monitoring and assessment",
                "medium": "Risk score 25-49 - Routine monitoring with attention to trends",
                "low": "Risk score < 25 - Standard monitoring"
            },
            "vital_sign_ranges": {
                "heartRate": {
                    "normal": "60-100 bpm",
                    "low": "< 60 bpm (bradycardia)",
                    "high": "> 100 bpm (tachycardia)"
                },
                "bloodPressure": {
                    "normal": "Systolic: 90-140 mmHg, Diastolic: 60-90 mmHg",
                    "low": "Systolic < 90 mmHg (hypotension)",
                    "high": "Systolic > 140 mmHg (hypertension)"
                },
                "oxygenSaturation": {
                    "normal": "95-100%",
                    "low": "< 95% (hypoxemia)",
                    "critical": "< 90% (severe hypoxemia)"
                },
                "respiratoryRate": {
                    "normal": "12-20 breaths/min",
                    "low": "< 12 breaths/min (bradypnea)",
                    "high": "> 20 breaths/min (tachypnea)"
                },
                "temperature": {
                    "normal": "97.0-99.5°F",
                    "low": "< 97.0°F (hypothermia)",
                    "high": "> 99.5°F (fever)"
                }
            },
            "risk_calculation": {
                "weights": {
                    "heartRate": "20%",
                    "bloodPressure": "25%",
                    "oxygenSaturation": "30%",
                    "respiratoryRate": "15%",
                    "temperature": "10%"
                },
                "trend_analysis": "15% weight for deteriorating trends",
                "medical_history": "10% weight for high-risk conditions"
            },
            "alert_triggers": {
                "critical": [
                    "Oxygen saturation < 90%",
                    "Heart rate < 40 or > 150 bpm",
                    "Systolic BP < 80 mmHg",
                    "Risk score ≥ 75"
                ],
                "warning": [
                    "Oxygen saturation < 93%",
                    "Respiratory rate > 24 breaths/min",
                    "Temperature > 101°F",
                    "Risk score 50-74"
                ]
            }
        }


