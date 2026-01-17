# Disclaimer: This is only for entertainment and educational purposes.  
# I’m not responsible for what you do with it or any consequences.  
# Made by Vexi :3
# Flames skid :c

clear
echo "Cracking MacSploit"
echo "Thanks to Vexi, this product is brought to you for free! 🎀"

echo "Please wait, macsploit is being installed and cracked."

curl -s "https://git.raptor.fun/main/version.json" -o v.json
ver=$(cat v.json | jq -r ".clientVersionUpload")
curl -O "http://setup.rbxcdn.com/mac/arm64/$ver-RobloxPlayer.zip"

unzip -o -q "$ver-RobloxPlayer.zip"
mv ./RobloxPlayer.app /Applications/Roblox.app
rm "$ver-RobloxPlayer.zip"

curl -s -O "https://git.raptor.fun/main/macsploit.zip"
unzip -o -q macsploit.zip
mv ./MacSploit.app /Applications/MacSploit.app
rm macsploit.zip

curl -s -O "https://git.raptor.fun/arm/macsploit.dylib"
codesign --remove-signature /Applications/Roblox.app
./insert_dylib /Applications/Roblox.app/Contents/MacOS/macsploit.dylib /Applications/Roblox.app/Contents/MacOS/RobloxPlayer --strip-codesig --all-yes
mv /Applications/Roblox.app/Contents/MacOS/RobloxPlayer_patched /Applications/Roblox.app/Contents/MacOS/RobloxPlayer

echo "Installed Macsploit cracked! Enjoy :3"
