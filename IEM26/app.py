from flask import Flask, render_template, jsonify, request
import json
import os 
from flask_cors import CORS
import asyncio
import utils.database as db
from dotenv import load_dotenv

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": [
            "http://127.0.0.1:6100",
            "https://superaitutor.vercel.app"
        ],
        "supports_credentials": True
    }
})

load_dotenv()
SECRET_PASSWORD = os.getenv("SECRET_PASSWORD")
DATABASE_ID = os.getenv("DATABASE_ID")

def load_events():
    with open("data/events.json") as f:
        return json.load(f)

@app.route("/")
def home():
    event_list = asyncio.run(db.read(DATABASE_ID))
    event_list = event_list if (isinstance(event_list, list) and (all(isinstance(item, dict) and "name" in item and "date" in item for item in event_list))) else load_events()
    return render_template("events.html", events=event_list)

@app.route("/about")
def about():
    return render_template("base.html")

@app.route("/auth", methods=["POST"]) 
def check_password(): 
    data = request.get_json() 
    password = data.get("password")
    if password == SECRET_PASSWORD:
        return "0" 
    else: 
        return "1"

@app.route("/update", methods=["POST"]) 
def update_data():
    data = request.get_json(force=True)
    events = data.get("events")
    status = asyncio.run(db.write(DATABASE_ID, events))
    if status:
        return status 
    else:
        return {"status": 400}

if __name__ == "__main__":
    app.run(debug=True)
