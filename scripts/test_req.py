import requests
import json

data = {
    "soil": {
        "pH": 6.5,
        "nitrogen": 40.0,
        "phosphorus": 30.0,
        "potassium": 20.0,
        "soil_type": "black"
    },
    "weather": {
        "temperature": 28.0,
        "humidity": 60.0,
        "rainfall": 100.0,
        "season": "kharif"
    },
    "location": {
        "latitude": 20.0,
        "longitude": 78.0,
        "state": "Maharashtra",
        "district": "Pune"
    },
    "language": "en"
}

try:
    resp = requests.post("http://localhost:8000/api/recommend-crop", json=data)
    print("STATUS", resp.status_code)
    print(resp.json())
except Exception as e:
    print(e)
