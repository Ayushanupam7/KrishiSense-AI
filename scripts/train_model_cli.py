"""
KrishiSense AI - ML Model Setup
Run this file to initialize and train the ML model
"""

import sys
import os

# Add ml_model to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'ml_model'))

if __name__ == "__main__":
    from ml_model.train_model import train_model
    
    print("=" * 70)
    print("🌾 KrishiSense AI - ML Model Training")
    print("=" * 70)
    
    model, scaler = train_model()
    
    print("\n" + "=" * 70)
    print("✅ Setup Complete!")
    print("=" * 70)
    print("\nNext steps:")
    print("1. Backend: cd backend && python main.py")
    print("2. Frontend: cd frontend && npm install && npm start")
    print("=" * 70)
