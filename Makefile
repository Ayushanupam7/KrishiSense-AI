# Makefile for KrishiSense AI

.PHONY: help backend frontend ml-train setup test clean

help:
	@echo "🌾 KrishiSense AI - Available Commands"
	@echo "========================================"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make setup       - Install all dependencies"
	@echo "  make backend     - Setup backend only"
	@echo "  make frontend    - Setup frontend only"
	@echo ""
	@echo "Development:"
	@echo "  make run-backend    - Start FastAPI server"
	@echo "  make run-frontend   - Start React dev server"
	@echo "  make run-all        - Start both backend and frontend"
	@echo "  make ml-train       - Train ML model"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean       - Clean up generated files"
	@echo "  make test        - Run tests (future)"
	@echo "  make docs        - View documentation"
	@echo ""

setup: backend frontend ml-train
	@echo "✅ Setup complete!"

backend:
	@echo "🔧 Setting up backend..."
	cd backend && pip install -r requirements.txt
	@echo "✅ Backend ready!"

frontend:
	@echo "🔧 Setting up frontend..."
	cd frontend && npm install
	@echo "✅ Frontend ready!"

ml-train:
	@echo "🤖 Training ML model..."
	python setup.py
	@echo "✅ ML model trained!"

run-backend:
	@echo "🚀 Starting FastAPI server..."
	cd backend && python main.py

run-frontend:
	@echo "🚀 Starting React server..."
	cd frontend && npm start

run-all:
	@echo "🚀 Starting both servers..."
	@echo "Starting Backend..."
	cd backend && python main.py &
	@echo "Waiting 3 seconds..."
	@sleep 3
	@echo "Starting Frontend..."
	cd frontend && npm start

clean:
	@echo "🧹 Cleaning up..."
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	cd backend && rm -rf *.pkl *.model *.joblib
	cd ml_model && rm -rf *.pkl *.model *.joblib
	@echo "✅ Clean complete!"

test:
	@echo "🧪 Running tests..."
	@echo "⚠️  Tests not yet implemented"

docs:
	@echo "📚 Documentation files available:"
	@echo "  - README.md (Project overview)"
	@echo "  - SETUP.md (Setup instructions)"
	@echo "  - docs/API.md (API reference)"
	@echo "  - docs/FRONTEND.md (Frontend guide)"
	@echo "  - docs/ML_MODEL.md (Model documentation)"
	@echo "  - docs/PROJECT_SUMMARY.md (Complete summary)"
