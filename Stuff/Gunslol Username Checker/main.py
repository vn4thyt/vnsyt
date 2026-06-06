# Disclaimer: This is only for entertainment and educational purposes.  
# I'm not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import asyncio
import random
import string
import aiohttp
from bs4 import BeautifulSoup
from colorama import *
init(autoreset=True)

title = Fore.LIGHTRED_EX + r"""
╭─╴╷ ╷╭╮╷╭─╮ ╷  ╭─╮╷     ╷ ╷╭─╮╭─╴╭─╮╭╮╷╭─╮╭┬╮╭─╴   ╭─╴╷ ╷╭─╴╭─╴╷╭ ╭─╴╭─╮
│╶╮│ ││╰┤╰─╮ │  │ ││     │ │╰─╮├╴ ├┬╯│╰┤├─┤│││├╴    │  ├─┤├╴ │  ├┴╮├╴ ├┬╯
╰─╯╰─╯╵ ╵╰─╯╵╰─╴╰─╯╰─╴   ╰─╯╰─╯╰─╴╵╰╴╵ ╵╵ ╵╵ ╵╰─╴   ╰─╴╵ ╵╰─╴╰─╴╵ ╵╰─╴╵╰╴
""" + Style.RESET_ALL

menu = Fore.LIGHTRED_EX + """
[ 1 ] Generate Usernames
[ 2 ] Check Username
[ 0 ] Exit
""" + Style.RESET_ALL

print(title)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

async def check(session, name):
    url = f"https://guns.lol/{name}"
    try: 
        async with session.get(url, timeout=10, allow_redirects=True) as response:
            text = await response.text()
            soup = BeautifulSoup(text, "html.parser")
            h1 = soup.find("h1")
            h3 = soup.find("h3")
            uidspan = soup.find("span", string=lambda x: x and "UID" in x)
            uid = uidspan.text.replace("UID", "").replace(",", "").strip() if uidspan else "?"

            if (h1 and h3) and "username not found" in h1.text.lower() and "claim this username by clicking on the button below" in h3.text.lower():
                print(Fore.LIGHTBLACK_EX + f"{uid}" + Style.RESET_ALL + Fore.MAGENTA + f" guns.lol/{name}" + Fore.LIGHTGREEN_EX + " Available" + Style.RESET_ALL)
                return True
            elif h1 and "we couldn't find this page" in h1.text.lower():
                print(Fore.LIGHTBLACK_EX + f"{uid}" + Style.RESET_ALL + Fore.MAGENTA + f" guns.lol/{name}" + Fore.YELLOW + " ERROR" + Style.RESET_ALL)
                return False
            else:
                print(Fore.LIGHTBLACK_EX + f"{uid}" + Style.RESET_ALL + Fore.MAGENTA + f" guns.lol/{name}" + Fore.LIGHTRED_EX + " Taken" + Style.RESET_ALL)
                return False
    except Exception as e:
        print(Fore.LIGHTBLACK_EX + f"{uid}" + Style.RESET_ALL + Fore.MAGENTA + f"guns.lol/{name}" + Fore.YELLOW + f" Error: {e}" + Style.RESET_ALL)
        return False
    
async def checker():
    length = int(input(Fore.CYAN + "Username length → " + Style.RESET_ALL))
    nums = input(Fore.CYAN + "Include numbers? (y/n) → " + Style.RESET_ALL).lower()
    amount = int(input(Fore.CYAN + "How many usernames to generate? → " + Style.RESET_ALL))
    save = input(Fore.CYAN + "Save available usernames? (y/n) → " + Style.RESET_ALL).lower()

    chars = string.ascii_lowercase + (string.digits if nums == 'y' else "")
    if not chars:
        print(Fore.RED + "No characters selected for generation!" + Style.RESET_ALL)
        return
    
    usernames = ["".join(random.choice(chars) for _ in range(length)) for _ in range(amount)]
    available = []

    async with aiohttp.ClientSession(headers=HEADERS) as session:
        sem = asyncio.Semaphore(50)
        
        async def worker(name):
            async with sem:
                is_available = await check(session, name)
                return is_available, name
        
        tasks = [asyncio.create_task(worker(name)) for name in usernames]
        
        for task in asyncio.as_completed(tasks):
            is_available, name = await task
            if is_available:
                available.append(name)
        
    if save == 'y' and available:
        with open("availableGunslolUsernames.txt", "w") as f:
            for u in available:
                f.write(f"https://guns.lol/{u}\n")
        print(Fore.LIGHTGREEN_EX + f"\nSaved {len(available)} usernames" + Style.RESET_ALL)
    elif save == 'y' and not available:
        print(Fore.LIGHTYELLOW_EX + "\nNo available usernames found" + Style.RESET_ALL)
    else:
        print(Fore.LIGHTYELLOW_EX + "\nUsernames not saved" + Style.RESET_ALL)

async def singlecheck():
    name = input(Fore.CYAN + "Username → " + Style.RESET_ALL).strip()
    async with aiohttp.ClientSession(headers=HEADERS) as session:
        await check(session, name)

async def main():
    while True:
        print(menu)
        choice = input(Fore.CYAN + "Choose → " + Style.RESET_ALL).strip()
        if choice == "1":
            await checker()
        elif choice == "2":
            await singlecheck()
        elif choice == "0":
            print(Fore.LIGHTRED_EX + "Cya!" + Style.RESET_ALL)
            break
        else:
            print(Fore.RED + "Invalid option" + Style.RESET_ALL)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(Fore.RED + "\nInterrupted" + Style.RESET_ALL)
