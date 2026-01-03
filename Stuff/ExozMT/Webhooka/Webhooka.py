# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import requests
import base64
import aiohttp
import asyncio
import json
import sys
import os

try:
    import colorama
    colorama.init()
except Exception:
    if os.name == "nt":
        try:
            import ctypes
            kernel32 = ctypes.windll.kernel32
            handle = kernel32.GetStdHandle(-11)  
            mode = ctypes.c_uint32()
            if kernel32.GetConsoleMode(handle, ctypes.byref(mode)):

                kernel32.SetConsoleMode(handle, mode.value | 0x0004)
        except Exception:
            pass

RED = "\033[31m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
BLUE = "\033[34m"
CYAN = "\033[36m"
RESET = "\033[0m"

def gradient(text):
    lines = text.splitlines()
    if not lines:
        return ""

    start_color = (120, 0, 0)
    end_color = (255, 60, 60)
    num_lines = len(lines)
    max_length = max((len(line) for line in lines), default=1)

    out_lines = []
    for li, line in enumerate(lines):

        line_ratio = li / (num_lines - 1) if num_lines > 1 else 0
        chars = []
        for ci, ch in enumerate(line):
            char_ratio = ci / (max_length - 1) if max_length > 1 else 0
            ratio = (line_ratio + char_ratio) / 2.0
            r = int(start_color[0] + (end_color[0] - start_color[0]) * ratio)
            g = int(start_color[1] + (end_color[1] - start_color[1]) * ratio)
            b = int(start_color[2] + (end_color[2] - start_color[2]) * ratio)
            chars.append(f"\033[38;2;{r};{g};{b}m{ch}")

        out_lines.append("".join(chars) + RESET)
    return "\n".join(out_lines)

title = r"""
EXOZ-MT - Thanks to Vexi, this product is brought to you for free! 🎀
█████████████████████████████████████████████████████████████████████████████████

██╗    ██╗███████╗██████╗ ██╗  ██╗ ██████╗  ██████╗ ██╗  ██╗ █████╗ 
██║    ██║██╔════╝██╔══██╗██║  ██║██╔═══██╗██╔═══██╗██║ ██╔╝██╔══██╗
██║ █╗ ██║█████╗  ██████╔╝███████║██║   ██║██║   ██║█████╔╝ ███████║
██║███╗██║██╔══╝  ██╔══██╗██╔══██║██║   ██║██║   ██║██╔═██╗ ██╔══██║
╚███╔███╔╝███████╗██████╔╝██║  ██║╚██████╔╝╚██████╔╝██║  ██╗██║  ██║
 ╚══╝╚══╝ ╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝                                                               

████████████████████████████████████████████████████████████████████
"""

menu = """
[ 1 ] Change Webhook Name
[ 2 ] Change Webhook PFP
[ 3 ] Spam Webhook
[ 4 ] Destroy Webhook
[ 0 ] Exit
"""

print(gradient(title))

def changeWebhookName(url, new_name):
    response = requests.patch(url, json={"name": new_name})
    if response.ok:
        print(f"{GREEN}Webhook name changed to: {new_name}{RESET}")
    else:
        print(f"{RED}Failed ({response.status_code}): {response.text}{RESET}")

def changeWebhookPfp(url, image_source):
    try:
        if image_source.startswith("http"):
            image_data = requests.get(image_source).content
        else:
            with open(image_source, "rb") as f:
                image_data = f.read()

        encoded_avatar = base64.b64encode(image_data).decode("utf-8")
        data = {"avatar": f"data:image/png;base64,{encoded_avatar}"}
        response = requests.patch(url, json=data)

        if response.ok:
            print(f"{GREEN}Webhook avatar updated!{RESET}")
        else:
            print(f"{RED}Failed ({response.status_code}): {response.text}{RESET}")
    except Exception as e:
        print(f"{YELLOW}Error: {e}{RESET}")

async def spamWebhookMessage(url, message, amount, delay):
    headers = {"Content-Type": "application/json"}

    async with aiohttp.ClientSession() as session:

        async def send_message(i):
            try:
                async with session.post(url, headers=headers, data=json.dumps({"content": message})) as r:
                    if r.status in (200, 204):
                        print(f"{GREEN}Sent {i + 1}/{amount}{RESET}")
                    elif r.status == 429:
                        data = await r.json()
                        wait = data.get("retry_after", 1)
                        print(f"{YELLOW}Rate limited ({wait}s)...{RESET}")
                        await asyncio.sleep(wait)
                        await send_message(i)
                    else:
                        print(f"{RED}Failed ({r.status}): {await r.text()}{RESET}")
            except Exception as e:
                print(f"{RED}Error sending message {i + 1}: {e}{RESET}")
            await asyncio.sleep(float(delay))

        tasks = [asyncio.create_task(send_message(i)) for i in range(int(amount))]
        await asyncio.gather(*tasks)

def destroyWebhook(url):
    response = requests.delete(url)
    if response.ok:
        print(f"{RED}Webhook deleted successfully!{RESET}")
    else:
        print(f"{RED}Failed ({response.status_code}): {response.text}{RESET}")

while True:
    print(gradient(menu))
    choice = input(f"{BLUE}Choose an option → {RESET}").strip()

    if choice == "1":
        webhook = input(f"{BLUE}Webhook URL → {RESET}").strip()
        name = input(f"{CYAN}New name → {RESET}").strip()
        changeWebhookName(webhook, name)

    elif choice == "2":
        webhook = input(f"{BLUE}Webhook URL → {RESET}").strip()
        img = input(f"{CYAN}Image file path or image URL → {RESET}").strip()
        changeWebhookPfp(webhook, img)

    elif choice == "3":
        webhook = input(f"{BLUE}Webhook URL → {RESET}").strip()
        msg = input(f"{CYAN}Message → {RESET}").strip()
        amount = input(f"{YELLOW}How many messages → {RESET}").strip()
        delay = input(f"{YELLOW}Delay between messages → {RESET}").strip()
        asyncio.run(spamWebhookMessage(webhook, msg, amount, delay))

    elif choice == "4":
        webhook = input(f"{BLUE}Webhook URL → {RESET}").strip()
        destroyWebhook(webhook)

    elif choice == "0":
        print(f"{GREEN}Exiting.. {RESET}")
        sys.exit()

    else:
        print(f"{YELLOW}Invalid option, please choose 0–4.{RESET}")
