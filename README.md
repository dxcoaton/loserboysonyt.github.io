# Welcome to Retro Bowl 2
Retro Bowl 2 is an American style football game created by New Star Games. Are you ready to manage your dream team into victory? Be the boss of your NFL franchise, expand your roster, take care of your press duties to keep your team and fans happy. MORE UPDATES SOON!!!

## 🚀 Where You Can Play
- **Web Browser**: This game runs directly in your web browser - no downloads required!
- **Supported Browsers**: Chrome, Firefox, Safari, Edge (any modern browser with HTML5 support)
- **Platforms**: Desktop, Mobile, Tablet

## 🎮 How to Launch the Project

### Option 1: Using Python (Recommended)
If you have Python installed:
```bash
# Python 3
python -m http.server 8000

# Python 2 (if needed)
python -m SimpleHTTPServer 8000
```
Then open your browser and go to: `http://localhost:8000`

### Option 2: Using Node.js
If you have Node.js installed:
```bash
# Install a simple HTTP server globally
npm install -g http-server

# Start the server
http-server -p 8000
```
Then open your browser and go to: `http://localhost:8000`

### Option 3: Using PHP
If you have PHP installed:
```bash
php -S localhost:8000
```
Then open your browser and go to: `http://localhost:8000`

### Option 4: Live Server (VS Code)
If you're using VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 5: Direct File Opening (Not Recommended)
You can try opening `index.html` directly in your browser, but this may cause issues with loading game assets due to CORS restrictions.

## � How to Play on Mobile/Phone

### Method 1: Using Your Computer's IP Address
1. **Find your computer's IP address**:
   - **Windows**: Open Command Prompt and type `ipconfig`
   - **Mac/Linux**: Open Terminal and type `ifconfig` or `ip addr`
   - Look for your local IP (usually starts with `192.168.` or `10.0.`)

2. **Start the server** using any of the methods above (Python recommended)

3. **On your phone**:
   - Make sure your phone is connected to the same WiFi network as your computer
   - Open your phone's browser (Chrome, Safari, etc.)
   - Go to: `http://[YOUR_COMPUTER_IP]:8000`
   - Example: `http://192.168.1.100:8000`

### Method 2: Using ngrok (Recommended for Easy Access)
1. **Install ngrok**:
   ```bash
   # Download from https://ngrok.com/download
   # Or install via package manager
   ```

2. **Start your local server** (using any method above)

3. **Create a tunnel**:
   ```bash
   ngrok http 8000
   ```

4. **On your phone**:
   - Open your browser
   - Go to the URL shown by ngrok (e.g., `https://abc123.ngrok.io`)
   - Share this URL with friends to play together!

### Method 3: Using LocalTunnel
1. **Install LocalTunnel**:
   ```bash
   npm install -g localtunnel
   ```

2. **Start your local server** (using any method above)

3. **Create a tunnel**:
   ```bash
   lt --port 8000
   ```

4. **On your phone**:
   - Open your browser
   - Go to the URL provided by LocalTunnel

### Mobile Tips:
- **Rotate your phone** to landscape mode for the best gaming experience
- **Use headphones** for better audio experience
- **Close other apps** to ensure smooth performance
- **Keep your phone charged** - gaming can drain battery quickly

## �📋 Requirements
- Modern web browser with HTML5 canvas support
- Local web server (for proper asset loading)
- Internet connection (for some integrations)

# Subscribe To **Loser Boys** On youtube for Future updates and leaks Link Below:

https://www.youtube.com/channel/UCSjd2xkw3oG66hCDH9BZoWQ

# Future Updates 
#1 More Uniforms/Helments

#2 More Fields/Stadiums

#3 Emotes

#4 Levels/Tiers

