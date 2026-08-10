# Disclaimer: This is only for entertainment and educational purposes.  
# I'm not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import asyncio
import aiohttp
import random
import string
from colorama import *
init(autoreset=True)

Fore.ORANGE = "\u001b[38;5;208m"

title = Fore.LIGHTRED_EX + r"""
╭─╴╷  ╭─╮╷ ╷╶┬╮╭─╴╷  ╭─╮╭─╮╭─╴ ╭─╮╭─╮╷ ╷   ╷ ╷╭─╮╭─╴╭─╮╭╮╷╭─╮╭┬╮╭─╴   ╭─╴╷ ╷╭─╴╭─╴╷╭ ╭─╴╭─╮
│  │  │ ││ │ ││├╴ │  ├─┤├┬╯├╴  ├─╯├─┤╰┬╯   │ │╰─╮├╴ ├┬╯│╰┤├─┤│││├╴    │  ├─┤├╴ │  ├┴╮├╴ ├┬╯
╰─╴╰─╴╰─╯╰─╯╶┴╯╵  ╰─╴╵ ╵╵╰╴╰─╴╵╵  ╵ ╵ ╵    ╰─╯╰─╯╰─╴╵╰╴╵ ╵╵ ╵╵ ╵╰─╴   ╰─╴╵ ╵╰─╴╰─╴╵ ╵╰─╴╵╰╴
"""
print(title)

menu = Fore.LIGHTRED_EX + """
[ 1 ] Generate Usernames
[ 2 ] Check Username
[ 0 ] Exit
""" + Style.RESET_ALL

async def check(session, name):
    url = f"https://cloudflare.pay/api/check?tag={name}"
    
    try:
        async with session.get(url, timeout=10) as response:
            data = await response.json()
            
            if data.get("available") is True:
                print(Fore.ORANGE + f"{name}.cloudflare.pay" + Fore.LIGHTGREEN_EX + " Available" + Style.RESET_ALL)
                return True
            
            if data.get("available") is False:
                print(Fore.ORANGE + f"{name}.cloudflare.pay" + Fore.LIGHTRED_EX + " Taken" + Style.RESET_ALL)
                return False
            
            print(Fore.ORANGE + f"{name}.cloudflare.pay" + Fore.LIGHTYELLOW_EX + " Error" + Style.RESET_ALL)
            return False
    
    except Exception:
        print(Fore.ORANGE + f"{name}.cloudflare.pay" + Fore.LIGHTYELLOW_EX + " Error" + Style.RESET_ALL)
        return False

async def checker():
    length = int(input(Fore.CYAN + "Username length (3-32) → " + Style.RESET_ALL))
    nums = input(Fore.CYAN + "Include numbers? (y/n) → " + Style.RESET_ALL).lower()
    amount = int(input(Fore.CYAN + "How many usernames to generate? → " + Style.RESET_ALL))
    save = input(Fore.CYAN + "Save available usernames? (y/n) → " + Style.RESET_ALL).lower()

    chars = string.ascii_lowercase + (string.digits if nums == 'y' else "")
    if not chars:
        print(Fore.RED + "No characters selected for generation!" + Style.RESET_ALL)
        return

    usernames = ["".join(random.choice(chars) for _ in range(length)) for _ in range(amount)]
    available = []
    
    async with aiohttp.ClientSession() as session:
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
        with open("availableCloudflarepayUsernames.txt", "w") as f:
            for u in available:
                f.write(f"https://{u}.cloudflare.pay/\n")
        print(Fore.LIGHTGREEN_EX + f"\nSaved {len(available)} usernames" + Style.RESET_ALL)
    elif save == 'y' and not available:
        print(Fore.LIGHTYELLOW_EX + "\nNo available usernames found" + Style.RESET_ALL)
    else:
        print(Fore.LIGHTYELLOW_EX + "\nUsernames not saved" + Style.RESET_ALL)

async def singlecheck():
    name = input(Fore.CYAN + "Username → " + Style.RESET_ALL).strip()
    async with aiohttp.ClientSession() as session:
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
