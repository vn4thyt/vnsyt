import asyncio
import random
import string
import os
import time
import requests
from bs4 import BeautifulSoup

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

RESET = "\033[0m"
BLUE = "\033[34m"
RED = "\033[91m"
GREEN = "\033[92m"
CYAN = "\033[96m"
MAGENTA = "\033[95m"

def gradient(text):
    lines = text.splitlines()
    start = (120, 0, 0)
    end = (255, 60, 60)
    out = []
    for li, line in enumerate(lines):
        lr = li / max(len(lines) - 1, 1)
        chars = []
        for ci, ch in enumerate(line):
            cr = ci / max(len(line) - 1, 1)
            r = (lr + cr) / 2
            rc = int(start[0] + (end[0] - start[0]) * r)
            gc = int(start[1] + (end[1] - start[1]) * r)
            bc = int(start[2] + (end[2] - start[2]) * r)
            chars.append(f"\033[38;2;{rc};{gc};{bc}m{ch}")
        out.append("".join(chars) + RESET)
    return "\n".join(out)

title = r"""
EXOZ-MT - Thanks to Vn, this product is brought to you for free! 🎀
█████████████████████████████████████████████████████████████████████████████████

 ██████╗ ██╗   ██╗███╗   ██╗███████╗   ██╗      ██████╗ ██╗         ██╗   ██╗███████╗███████╗██████╗ ███╗   ██╗ █████╗ ███╗   ███╗███████╗     ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███████╗██████╗ 
██╔════╝ ██║   ██║████╗  ██║██╔════╝   ██║     ██╔═══██╗██║         ██║   ██║██╔════╝██╔════╝██╔══██╗████╗  ██║██╔══██╗████╗ ████║██╔════╝    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
██║  ███╗██║   ██║██╔██╗ ██║███████╗   ██║     ██║   ██║██║         ██║   ██║███████╗█████╗  ██████╔╝██╔██╗ ██║███████║██╔████╔██║█████╗      ██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝
██║   ██║██║   ██║██║╚██╗██║╚════██║   ██║     ██║   ██║██║         ██║   ██║╚════██║██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║╚██╔╝██║██╔══╝      ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗
╚██████╔╝╚██████╔╝██║ ╚████║███████║██╗███████╗╚██████╔╝███████╗    ╚██████╔╝███████║███████╗██║  ██║██║ ╚████║██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║
 ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝╚══════╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝                                                                                                                                                                                                   

████████████████████████████████████████████████████████████████████
"""

print(gradient(title))

menu = """
[ 1 ] Generate Usernames
[ 2 ] Check Single Username
[ 0 ] Exit
"""

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def check(name):
    url = f"https://guns.lol/{name}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        h1 = soup.find("h1")

        if h1 and "username not found" in h1.text.lower():
            print(f"{CYAN}URL:{RESET} {MAGENTA}guns.lol/{name} {GREEN}Unclaimed{RESET}")
            return True
        elif h1 and "we couldn't find this page" in h1.text.lower():
            print(f"{CYAN}URL:{RESET} {MAGENTA}guns.lol/{name} {RED}ERROR{RESET}")
            return False
        else:
            print(f"{CYAN}URL:{RESET} {MAGENTA}guns.lol/{name} {RED}Claimed{RESET}")
            return False
    except:
        print(f"{CYAN}URL:{RESET} {MAGENTA}guns.lol/{name} {RED}ERROR{RESET}")
        return False

async def checker():
    length = int(input(f"{BLUE}Username length → {RESET}"))
    numbers = input(f"{BLUE}Include numbers? (y/n) → {RESET}").lower() == "y"
    amount = int(input(f"{BLUE}How many usernames → {RESET}"))
    delay = float(input(f"{BLUE}Delay between checks → {RESET}"))
    save = input(f"{BLUE}Save unclaimed? (y/n) → {RESET}").lower() == "y"

    chars = string.ascii_lowercase + (string.digits if numbers else "")
    usernames = ["".join(random.choice(chars) for _ in range(length)) for _ in range(amount)]

    unclaimed = []

    for name in usernames:
        if check(name):
            unclaimed.append(name)
        time.sleep(max(delay, 0))

    if save and unclaimed:
        with open("unclaimedGunslolUsernames.txt", "w") as f:
            for u in unclaimed:
                f.write(f"guns.lol/{u}\n")
        print(f"\n{GREEN}Saved {len(unclaimed)} usernames{RESET}")
    else:
        print(f"\n{RED}No usernames saved{RESET}")

async def single_check():
    name = input(f"{BLUE}Username → {RESET}").strip()
    check(name)

async def main():
    while True:
        print(gradient(menu))
        choice = input(f"{BLUE}Choose → {RESET}").strip()
        if choice == "1":
            await checker()
        elif choice == "2":
            await single_check()
        elif choice == "0":
            print(f"{RED}Exiting...{RESET}")
            break
        else:
            print(f"{RED}Invalid option!{RESET}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n{RED}Interrupted.{RESET}")
