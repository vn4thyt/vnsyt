# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import subprocess
import tkinter as tk
import threading

def output(text, tag = None):
    text_area.config(state = "normal")
    if tag:
        text_area.insert(tk.END, text, tag)
    else:
        text_area.insert(tk.END, text)
    text_area.config(state = "disabled")
    text_area.see(tk.END)

def run_cmd():
    cmd = entry.get()
    if cmd.strip() == "":
        return

    output(f"> {cmd}\n", "cmd")
    entry.delete(0, tk.END)

    threading.Thread(target=exec_cmd, args=(cmd,), daemon=True).start()

def exec_cmd(cmd):
    try:
        cmdoutput = subprocess.getoutput(cmd)
        output(f"{cmdoutput}\n\n", "output")
    except Exception as e:
        output(f"Error: {e}\n\n", "output")

root = tk.Tk()
root.title("School Terminal Restrictions Bypasser")
root.geometry("900x500")
root.configure(bg = "#090909")

text_area = tk.Text(
    root,
    bg = "#090909",
    fg = "#ffffff",
    insertbackground = "white",
    font = ("Consolas", 11),
    bd = 0,
    padx = 8,
    pady = 8,
    state = "disabled"
)

text_area.tag_config("cmd", foreground = "#67ffbb")
text_area.tag_config("output", foreground = "#ffffff")

text_area.pack(expand = True, fill = "both", padx = 10, pady = (10, 5))

input_frame = tk.Frame(root, bg = "#090909")
input_frame.pack(fill = "x", padx = 10, pady = (0, 10))

entry = tk.Entry(
    input_frame,
    bg = "#2a2a2a",
    fg = "white",
    insertbackground = "white",
    font = ("Consolas", 11),
    bd = 0
)
entry.pack(side = "left", fill = "x", expand = True, padx = (0, 10), ipady = 6)

button = tk.Button(
    input_frame,
    text = "Run",
    command = run_cmd,
    bg = "#ffffff",
    fg = "black",
    font = ("Segoe UI", 10, "bold"),
    bd = 0,
    padx = 15,
    pady = 5,
    activebackground = "#67ffbb"
)
button.pack(side = "right")

entry.bind("<Return>", lambda event: run_cmd())
entry.focus()

startup_text = """Windows PowerShell
> You can use this to bypass schools Cmd/PS restrictions.
> Thanks to Vexi, this product is brought to you for free! :3\n
"""

output(startup_text)

root.mainloop()
