# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by Vexi :3

#!/bin/zsh
clear
echo "Cracking MacSploit"
echo "Thanks to Vexi, this product is brought to you for free! 🎀"

killall RobloxPlayer 2>/dev/null
killall RobloxPlayerBeta 2>/dev/null

echo "Please wait, macsploit is being installed and cracked."

ver=$(curl -s "https://git.raptor.fun/main/version.json" | grep -o '"clientVersionUpload":"[^"]*"' | cut -d '"' -f4)
curl -O "http://setup.rbxcdn.com/mac/arm64/$ver-RobloxPlayer.zip"

unzip -o -q "$ver-RobloxPlayer.zip"
sudo mv ./RobloxPlayer.app /Applications/Roblox.app
rm "$ver-RobloxPlayer.zip"

curl -s -O "https://git.raptor.fun/main/macsploit.zip"
unzip -o -q macsploit.zip
sudo mv ./MacSploit.app /Applications/MacSploit.app
rm macsploit.zip

curl -s -O "https://git.raptor.fun/arm/macsploit.dylib"
if [[ ! -f "./insert_dylib" ]]; then
    curl -s -O "https://raw.githubusercontent.com/Tyilo/insert_dylib/master/insert_dylib"
    chmod +x insert_dylib
fi

sudo mv ./macsploit.dylib /Applications/Roblox.app/Contents/MacOS/macsploit.dylib

sudo codesign --remove-signature /Applications/Roblox.app
sudo ./insert_dylib /Applications/Roblox.app/Contents/MacOS/macsploit.dylib /Applications/Roblox.app/Contents/MacOS/RobloxPlayer --strip-codesign --all-yes

sudo mv /Applications/Roblox.app/Contents/MacOS/RobloxPlayer_patched /Applications/Roblox.app/Contents/MacOS/RobloxPlayer

echo "Installed Macsploit cracked! Enjoy :3"
