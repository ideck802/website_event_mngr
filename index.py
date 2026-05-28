import requests
import base64
import json
from typing import Any
from fastapi import FastAPI

with open("keys.json") as f:
    keys = json.load(f)

TOKEN = keys["github_token"]
OWNER = "ideck802"
REPO = "church_website"
PATH = "events.json"

app = FastAPI()

# ------------------------
# TO FIX CORS ISSUES IN DEV. COMMENT OUT OR REMOVE IN PROD
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------
# ------------------------

def get_sha(url, headers):
    r = requests.get(url, headers=headers)
    file_data = r.json()
    return file_data["sha"]

@app.get("/get_events")
async def get_events():
    url = f"https://{OWNER}.github.io/{REPO}/{PATH}"
    
    response = requests.get(url)

    data = response.json()
    return data

@app.get("/set_events")
async def set_events(events: Any):

    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{PATH}"

    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    sha = get_sha(url, headers)

    encoded = base64.b64encode(
        events.encode()
    ).decode()

    payload = {
        "message": "Update data.json",
        "content": encoded,
        "sha": sha
    }

    r = requests.put(url, headers=headers, json=payload)
    return {"status": r.status_code, "result": r.json()}

@app.get("/store_events")
async def store_events(events: Any):
    with open("events.json", "w") as f:
        json.dump(json.loads(events), f, indent=4)
    
    return {"status": "success"}

@app.get("/load_events")
async def load_events():
    with open("events.json", "r") as f:
        data = json.load(f)
    return data

# New JSON content
new_json = [
    {
        "title": "County Fair Booth",
        "start-date": "6-18-2026",
        "end-date": "6-21-2026",
        "details": ""
    },
    {
        "title": "Temp",
        "start-date": "7-6-2026",
        "end-date": "7-6-2026",
        "details": ""
    }
]