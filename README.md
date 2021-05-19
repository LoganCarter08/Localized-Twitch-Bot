# Localized-Twitch-Bot

The following is intended to be an easy to use bot for Twitch that will extend what is possible from existing third party apps such as in game interactions and audio/visual cues. The intent is to create a bot so easy any computer skill level streamer can operate. Designed for Windows use only at the moment. 

If you would like to see this in action before using please stop by [Axiova's Twitch Channel](twitch.tv/axiova) as he is my test subject for new features. 

Before using you must install/update [Node.JS version 16.0](https://nodejs.org/en/download/current/) (Subject to change as development continues). 

Work on this will only continue as there is a need. If you have feature requests/find bugs/or want to see more in the future please let me know. I can also be bribed to continue work on this if you buy me a beer. 

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=XNUJQACTEAUR8)

### Current Capabilities
1. Hardcoded bits for buttons to allow for chat to cheer bits to press buttons on your keyboard or mouse to manipulate your game
2. Easy to use installer
3. Starts up with Windows
4. Text to speech - Allows viewers to donate bits to have their message read out loud
5. Subathon support - Each sub adds an hour to the streamer's time to stay live with a !timeleft command to check remaining time

### Planned Capabilities
1. Have a menu to allow for easy bits for buttons configuration
2. Include quick swappable configurations in aforementioned menu
3. Allow for a free button pressing menu to allow chat to "play" games. Think of Twitch Plays Pokemon
4. Menu to allow for simple chat commands
5. Support for watch time and (maybe) follow time
6. Allow login with twitch account instead of OAuth
7. Support for bits for serial communication (allow for chat to control things in streamer's room via Arduino)
8. Better installer that can detect failures and steps to fix
9. Better GUI for ease of use
10. Allow for chat to get current Spotify songs, skip songs, etc

### Usage:
1. Download latest release in the release menu (will link once one is up, if you are reading this you're too early)
2. Install Node.JS linked above, be sure to click the 
3. Unzip the latest release downloaded .zip file
4. Double click the installer.exe
5. If a command prompt window opens press enter and wait for it to exit
6. Once everything closes you can delete the installer.exe and the folder that it is in, the folder should now be empty otherwise
7. Open your favorite browser and in the url bar enter localhost:6969
8. Login to your Twitch account or bot account on the login page, there should be notes to help you accomplish this. Once succesfully logged in you will see a green text saying logged in
9. Setup the rest of the menus however you'd like and give it a test! (At the time of writing this the menus are not created, only imagined. Currently everything is hardcoded for testing. Report back for a customizable version in the future)
