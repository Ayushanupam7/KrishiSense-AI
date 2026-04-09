"""
Crop Prediction service using trained ML model
"""

import joblib
import numpy as np
import os
from typing import Dict, List

class CropPredictor:
    def __init__(self, model_path: str = None):
        """
        Initialize the crop predictor with trained model
        """
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 'crop_model.pkl')
        
        try:
            self.model = joblib.load(model_path)
            self.is_loaded = True
            print(f"✅ Model loaded from {model_path}")
        except FileNotFoundError:
            self.is_loaded = False
            print(f"⚠️  Model not found at {model_path}. Using demo mode.")

    def predict(self, 
                pH: float, 
                nitrogen: float, 
                phosphorus: float, 
                potassium: float,
                temperature: float, 
                humidity: float, 
                rainfall: float,
                **kwargs) -> Dict:
        """
        Predict best crop given soil and weather parameters
        """
        if not self.is_loaded:
            return self._demo_prediction()
        
        try:
            # Prepare features matching Kaggle dataset: N, P, K, temperature, humidity, ph, rainfall
            features = np.array([[
                nitrogen, phosphorus, potassium,
                temperature, humidity, pH, rainfall
            ]])
            
            # Make prediction
            prediction = self.model.predict(features)[0]
            probabilities = self.model.predict_proba(features)[0]
            confidence = float(np.max(probabilities))
            
            # Get top 3 predictions
            top_3_indices = np.argsort(probabilities)[-3:][::-1]
            top_3_crops = [self.model.classes_[i] for i in top_3_indices]
            top_3_probs = [float(probabilities[i]) for i in top_3_indices]
            
            return {
                "predicted_crop": prediction,
                "confidence_score": confidence,
                "top_3_predictions": list(zip(top_3_crops, top_3_probs)),
                "all_probabilities": dict(zip(self.model.classes_, probabilities))
            }
        except Exception as e:
            print(f"❌ Prediction error: {str(e)}")
            return self._demo_prediction()

    def _demo_prediction(self) -> Dict:
        """
        Demo prediction when model is not loaded
        """
        # Return a few plausible crops instead of just one
        demo_crops = [
            ("rice", 0.35),
            ("maize", 0.28),
            ("wheat", 0.25),
            ("soybean", 0.12)
        ]
        
        return {
            "predicted_crop": demo_crops[0][0], # Defaults to rice, but better variety
            "confidence_score": 0.35,
            "top_3_predictions": demo_crops[:3],
            "all_probabilities": {crop: prob for crop, prob in demo_crops},
            "note": "Demo prediction - train model for real predictions"
        }

    def batch_predict(self, samples: List[Dict]) -> List[Dict]:
        """
        Predict for multiple samples
        """
        results = []
        for sample in samples:
            result = self.predict(**sample)
            results.append(result)
        return results

# Create global predictor instance
crop_predictor = CropPredictor()

if __name__ == "__main__":
    # Test the predictor
    predictor = CropPredictor()
    
    # Test prediction
    test_data = {
        "pH": 7.0,
        "nitrogen": 90,
        "phosphorus": 40,
        "potassium": 50,
        "temperature": 25,
        "humidity": 80,
        "rainfall": 200
    }
    
    print("🌾 Testing Crop Predictor")
    print(f"Input: {test_data}")
    print("\nPrediction:")
    result = predictor.predict(**test_data)
    print(f"  Predicted Crop: {result.get('predicted_crop')}")
    print(f"  Confidence: {result.get('confidence_score'):.2%}")
    print(f"  Top 3: {result.get('top_3_predictions')}")

