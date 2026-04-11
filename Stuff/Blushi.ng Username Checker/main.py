# Disclaimer: This is only for entertainment and educational purposes.  
# I'm not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import asyncio
import random
import string
import os
import aiohttp
from bs4 import BeautifulSoup

try:
    import colorama
    colorama.init()
except:
    if os.name == "nt":
        try:
            import ctypes
            kernel32 = ctypes.windll.kernel32
            handle = kernel32.GetStdHandle(-11)
            mode = ctypes.c_uint32()
            if kernel32.GetConsoleMode(handle, ctypes.byref(mode)):
                kernel32.SetConsoleMode(handle, mode.value | 0x0004)
        except:
            pass

RESET = "\033[0m"
BLUE = "\033[34m"
RED = "\033[91m"
GREEN = "\033[92m"
CYAN = "\033[96m"
PINK = "\033[95m"
YELLOW = "\033[93m"
GREY = "\033[90m"

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
EXOZ-MT
██████╗ ██╗     ██╗   ██╗███████╗██╗  ██╗██╗███╗   ██╗ ██████╗     ██╗   ██╗███████╗███████╗██████╗ ███╗   ██╗ █████╗ ███╗   ███╗███████╗     ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███████╗██████╗ 
██╔══██╗██║     ██║   ██║██╔════╝██║  ██║██║████╗  ██║██╔════╝     ██║   ██║██╔════╝██╔════╝██╔══██╗████╗  ██║██╔══██╗████╗ ████║██╔════╝    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
██████╔╝██║     ██║   ██║███████╗███████║██║██╔██╗ ██║██║  ███╗    ██║   ██║███████╗█████╗  ██████╔╝██╔██╗ ██║███████║██╔████╔██║█████╗      ██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝
██╔══██╗██║     ██║   ██║╚════██║██╔══██║██║██║╚██╗██║██║   ██║    ██║   ██║╚════██║██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║╚██╔╝██║██╔══╝      ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗
██████╔╝███████╗╚██████╔╝███████║██║  ██║██║██║ ╚████║╚██████╔╝    ╚██████╔╝███████║███████╗██║  ██║██║ ╚████║██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║
╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝      ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
"""

print(gradient(title))

menu = """
[ 1 ] Generate Usernames
[ 2 ] Check Single Username
[ 0 ] Exit
"""

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

async def check(session, name):
    url = f"https://blushi.ng/{name}"
    try:
        async with session.get(url, timeout=10, allow_redirects=True) as response:
            text = await response.text()
            soup = BeautifulSoup(text, "html.parser")

            h1 = soup.find("h1")
            uid_span = soup.find("span", string=lambda x: x and "UID:" in x)
            uid = uid_span.text.replace("UID:", "").strip() if uid_span else "?"

            if h1 and ("404" in h1.text):
                print(f"{RESET}{PINK}blushi.ng/{name} {GREEN}Available{RESET}")
                return True
            elif h1 and ("banned" in h1.text.lower()):
                print(f"{RESET}{PINK}blushi.ng/{name} {RED}Banned      {GREY}#{uid}{RESET}")
                return False
            else:
                print(f"{RESET}{PINK}blushi.ng/{name} {RED}Taken       {GREY}#{uid}{RESET}")
                return False

    except Exception as e:
        print(f"{RESET} {PINK}blushi.ng/{name} {YELLOW}Error{RESET} ({e})")
        return False

async def checker():
    length = int(input(f"{BLUE}Username length → {RESET}"))
    numbers = input(f"{BLUE}Include numbers? (y/n) → {RESET}").lower() == "y"
    amount = int(input(f"{BLUE}How many usernames → {RESET}"))
    delay_input = input(f"{BLUE}Delay between checks (seconds, default 0.5) → {RESET}")
    
    try:
        delay = float(delay_input) if delay_input.strip() else 0.5
    except:
        delay = 0.5
        print(f"{YELLOW}Invalid delay, using 0.5 seconds{RESET}")
    
    save = input(f"{BLUE}Save available? (y/n) → {RESET}").lower() == "y"

    chars = string.ascii_lowercase + (string.digits if numbers else "")
    usernames = ["".join(random.choice(chars) for _ in range(length)) for _ in range(amount)]

    available = []

    async with aiohttp.ClientSession(headers=HEADERS) as session:

        if delay < 0.01:
            sem = asyncio.Semaphore(50)

            async def worker(name, i):
                async with sem:
                    result = await check(session, name)
                    return result, name

            tasks = [asyncio.create_task(worker(name, i)) for i, name in enumerate(usernames, 1)]

            for task in asyncio.as_completed(tasks):
                result, name = await task
                if result:
                    available.append(name)

        else:
            for i, name in enumerate(usernames, 1):
                print(f"{YELLOW}[{i}/{amount}]{RESET} ", end="")
                if await check(session, name):
                    available.append(name)
                if delay > 0 and i < amount:
                    await asyncio.sleep(delay)

    if save and available:
        with open("availableBlushingUsernames.txt", "w") as f:
            for u in available:
                f.write(f"blushi.ng/{u}\n")
        print(f"\n{GREEN}Saved {len(available)} usernames{RESET}")
    elif not save and not available:
        print(f"\n{YELLOW}No usernames saved{RESET}")

async def single_check():
    name = input(f"{BLUE}Username → {RESET}").strip()
    async with aiohttp.ClientSession(headers=HEADERS) as session:
        await check(session, name)

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
            print(f"{RED}Invalid option{RESET}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n{RED}Interrupted{RESET}")