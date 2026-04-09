"""
ML Model Training Pipeline for Crop Prediction
Uses Random Forest classifier for crop recommendation trained on Kaggle dataset.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import kagglehub
import os

MODEL_DIR = os.path.dirname(__file__)
os.makedirs(MODEL_DIR, exist_ok=True)

def train_model():
    """
    Train Random Forest model for crop prediction using Kaggle dataset
    """
    print("📥 Downloading dataset from Kaggle...")
    # Download latest version from Kaggle
    path = kagglehub.dataset_download("atharvaingle/crop-recommendation-dataset")
    csv_path = os.path.join(path, "Crop_recommendation.csv")
    
    print(f"🌾 Loading training data from {csv_path}...")
    data = pd.read_csv(csv_path)
    
    # We include 'ph' as well since it's important and available in the UI
    X = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = data['label']
    
    print(f"✅ Loaded {len(data)} samples")
    print(f"🌱 Supported crops: {', '.join(y.unique())}")
    
    # Split data
    print("📊 Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train Random Forest
    print("🤖 Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    test_accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n📈 Testing Accuracy: {test_accuracy:.4f} (Expected 95%+)")
    
    # Save model (We no longer use scaler as per user flow, RF doesn't strictly need scaling)
    model_path = os.path.join(MODEL_DIR, 'crop_model.pkl')
    joblib.dump(model, model_path)
    
    print(f"\n✅ Model saved to: {model_path}")
    
    return model

if __name__ == "__main__":
    print("=" * 60)
    print("🌾 KrishiSense AI - ML Model Training Pipeline (Kaggle)")
    print("=" * 60 + "\n")
    
    model = train_model()
    
    print("\n" + "=" * 60)
    print("✅ Training Complete! Dataset downloaded automatically.")
    print("✅ Use crop_model.pkl in backend.")
    print("=" * 60)

