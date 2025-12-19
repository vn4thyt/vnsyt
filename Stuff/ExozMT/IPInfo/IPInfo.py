import asyncio
import aiohttp
import ipaddress
from datetime import datetime
import json
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

RESET = "\033[0m"
BLUE = "\033[34m"
DARK_RED = "\033[31m"
LIGHT_RED = "\033[91m"

def table(data):
    headers = ["Field", "Value"]
    rows = [
        ["IP", data.get("query", "")],
        ["Country", data.get("country", "")],
        ["Region", data.get("regionName", "")],
        ["City", data.get("city", "")],
        ["Zip", data.get("zip", "")],
        ["ISP", data.get("isp", "")],
        ["Timezone", data.get("timezone", "")]
    ]
    col_widths = [max(len(str(row[i])) for row in rows + [headers]) + 2 for i in range(2)]
    print(f"{DARK_RED}{headers[0]:<{col_widths[0]}}| {headers[1]:<{col_widths[1]}}{RESET}")
    print(f"{DARK_RED}{'-' * (sum(col_widths) + 1)}{RESET}")
    for row in rows:
        print(f"{LIGHT_RED}{row[0]:<{col_widths[0]}}| {row[1]:<{col_widths[1]}}{RESET}")

title = r"""
EXOZ-MT
█████████████████████████████████████████████████████████████████████████████████

██╗██████╗     ██╗███╗   ██╗███████╗ ██████╗ 
██║██╔══██╗    ██║████╗  ██║██╔════╝██╔═══██╗
██║██████╔╝    ██║██╔██╗ ██║█████╗  ██║   ██║
██║██╔═══╝     ██║██║╚██╗██║██╔══╝  ██║   ██║
██║██║         ██║██║ ╚████║██║     ╚██████╔╝
╚═╝╚═╝         ╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝ 

████████████████████████████████████████████████████████████████████
"""

print(gradient(title))

menu = """
[ 1 ] Get Info From IP
[ 0 ] Exit
"""

menu2 = """"
[ 1 ] Save IP Info To File
[ 2 ] Go Back To Menu
[ 0 ] Exit
"""

async def info(session, ip):
    url = f"http://ip-api.com/json/{ip}"
    try:
        async with session.get(url, timeout=10) as resp:
            return await resp.json()
    except:
        return {"status": "fail", "message": "Network error"}

async def submenu(data):
    while True:
        print(gradient(menu2))
        choice = input(f"{BLUE}Choose an option → {RESET}").strip()
        if choice == "1":
            with open("ip_lookup_results.txt", "a") as f:
                f.write(f"{datetime.now()} - {data}\n")
            print(f"{LIGHT_RED}IP info saved to ip_lookup_results.txt{RESET}")
        elif choice == "2":
            return
        elif choice == "0":
            exit()
        else:
            print(f"{LIGHT_RED}Invalid option!{RESET}")

async def main():
    while True:
        print(gradient(menu))
        choice = input(f"{BLUE}Choose an option → {RESET}").strip()
        if choice == "1":
            ip = input(f"{BLUE}Enter IP Address: {RESET}").strip()
            try:
                ipaddress.ip_address(ip)
            except:
                print(f"{LIGHT_RED}Invalid IP address!{RESET}")
                continue
            async with aiohttp.ClientSession() as session:
                data = await info(session, ip)
            if data["status"] != "success":
                print(f"{LIGHT_RED}Error: {data.get('message', 'Unknown error')}{RESET}")
                continue
            table(data)
            await submenu(data)
        elif choice == "0":
            print("Exitting")
            break
        else:
            print(f"{LIGHT_RED}Invalid option!{RESET}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n{LIGHT_RED}Program interrupted. Exiting...{RESET}")
