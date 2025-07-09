# Retro Bowl 2 - Game Enhancements

## Overview
This document describes the new features that have been added to Retro Bowl 2, including FPS settings and a comprehensive daily rewards system.

## 🎮 New Features

### ⚙️ Settings System

#### FPS Control
- **60 FPS Mode**: Standard smooth gameplay
- **120 FPS Mode**: Ultra-smooth gameplay for high-refresh rate displays
- **Automatic Detection**: System attempts to integrate with the GameMaker engine's FPS controls
- **Browser Fallback**: Uses requestAnimationFrame limiting when direct engine access isn't available

#### Audio Settings
- **Sound Effects Toggle**: Enable/disable game sound effects
- **Background Music Toggle**: Control background music playback
- **Persistent Storage**: Settings are saved in localStorage and persist between sessions

#### How to Access Settings
1. Look for the **⚙️ settings button** in the top-right corner of the game
2. Click to open the settings modal
3. Adjust FPS and audio preferences
4. Click "Save" to apply changes

### 💰 Daily Rewards System

#### Daily Login Rewards
- **5 Credits per day**: Automatically awarded when you join the game
- **24-Hour Cooldown**: Must wait 24 hours between claims
- **Welcome Back Message**: Attractive modal appears when reward is available
- **Automatic Detection**: Checks reward availability on game startup

#### Advanced Reward Features

##### Weekly Loyalty Bonus
- **25 Credits**: Special bonus for players who return after a week
- **Loyalty Tracking**: Automatically tracks your playing habits
- **Special UI**: Premium-styled modal with crown icon

##### Playtime Rewards
- **1 Credit per 10 minutes**: Continuous rewards for active play
- **Session Tracking**: Monitors time spent in-game
- **Background Monitoring**: Works automatically while playing

##### Achievement System
- **First Game**: 10 credits for playing 5+ minutes
- **Dedicated Player**: 50 credits for 1+ hours of playtime
- **Marathon Player**: 100 credits for 3+ hours of playtime
- **Toast Notifications**: Beautiful achievement unlock animations

### 📊 Credits Display & Management

#### Real-Time Credits Counter
- **Top-Left Display**: Shows current credit balance
- **Live Updates**: Animates when credits are added
- **Click to View History**: Interactive credits history viewer
- **Professional Styling**: Gold color scheme with hover effects

#### Credits History
- **Transaction Log**: Complete history of all credit transactions
- **Detailed Tracking**: Shows amount, reason, and timestamp for each transaction
- **Recent Activity**: Displays last 10 transactions
- **Easy Access**: Click the credits display to view history

#### Game Integration
- **Multiple Sync Methods**: Attempts to integrate with various GameMaker credit systems
- **Variable Detection**: Scans for common credit variable names
- **Save Game Injection**: Modifies save data to include earned credits
- **Fallback Storage**: Uses localStorage when direct integration isn't possible

## 🛠 Technical Implementation

### Files Added
- `game-settings.js`: Core settings system and daily rewards
- `credits-integration.js`: Advanced credits system and achievement tracking
- Updated `index.html`: Includes new JavaScript files

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: Responsive design works on tablets and phones
- **LocalStorage**: Requires browser localStorage support for persistent data

### Performance
- **Lightweight**: Minimal impact on game performance
- **Efficient**: Uses optimized polling and event handling
- **Memory Safe**: Automatically cleans up old data and notifications

## 🎯 Usage Instructions

### For Players

1. **Starting the Game**:
   - Load the game normally
   - New UI elements will appear automatically
   - Daily reward popup will show if available

2. **Managing Settings**:
   - Click the ⚙️ button (top-right)
   - Choose your preferred FPS (60 or 120)
   - Toggle audio settings as desired
   - Save changes

3. **Collecting Rewards**:
   - Daily rewards appear automatically when available
   - Click "Claim Reward" to receive 5 credits
   - Continue playing to earn playtime rewards
   - Achievements unlock automatically based on activity

4. **Tracking Progress**:
   - View credits in the top-left corner
   - Click credits display to see transaction history
   - Achievement notifications appear in bottom-right

### For Developers

#### Customizing Rewards
Edit `credits-integration.js` to modify reward amounts and conditions:

```javascript
// Daily reward amount (line ~290)
this.addCreditsToGame(5); // Change the number

// Achievement definitions (line ~250)
const achievements = [
    { id: 'first_game', name: 'First Game', credits: 10, condition: () => this.getPlaytimeMinutes() > 5 },
    // Add more achievements here
];
```

#### FPS Settings
Modify `game-settings.js` to add more FPS options:

```javascript
// FPS options (line ~170)
<option value="60">60 FPS (Smooth)</option>
<option value="120">120 FPS (Ultra Smooth)</option>
<option value="144">144 FPS (Gaming)</option> // Add this line
```

## 🔧 Configuration Options

### Credit Variables
The system automatically detects these GameMaker variables:
- `_SF` (common GameMaker credit variable)
- `coach_credit` (Retro Bowl specific)
- `_9n` (obfuscated variable name)
- `credits`, `coins`, `money`, `cash` (generic names)

### Timing Settings
- **Daily Reward**: 24-hour cooldown period
- **Weekly Bonus**: 7-day cooldown period
- **Playtime Rewards**: Every 10 minutes of play
- **Achievement Checks**: Every 5 seconds

### UI Positioning
All UI elements use fixed positioning with high z-index values to ensure they appear above the game:
- Settings button: top-right (z-index: 10000)
- Credits display: top-left (z-index: 10000)
- Modals: center screen (z-index: 10001+)

## 📱 Mobile Optimization

- **Touch-Friendly**: All buttons sized for touch interaction
- **Responsive**: Adapts to different screen sizes
- **Performance**: Optimized for mobile browsers
- **Notifications**: Positioned to avoid interference with gameplay

## 🐛 Troubleshooting

### Common Issues

1. **Credits not adding to game**:
   - Credits are stored in localStorage as backup
   - Check browser console for integration messages
   - Some GameMaker variables may not be accessible

2. **FPS setting not working**:
   - Browser may limit frame rate
   - GameMaker engine may override settings
   - Try refreshing the page

3. **Daily rewards not appearing**:
   - Check if 24 hours have passed since last claim
   - Clear browser cache if needed
   - Ensure localStorage is enabled

### Console Debugging
Open browser developer tools and check console for messages like:
- "Found potential credit variable: [variable] = [value]"
- "FPS set to: [fps]"
- "Added [amount] credits to the game"

## 🔮 Future Enhancements

### Planned Features
- **Streak Bonuses**: Increased rewards for consecutive daily logins
- **Special Events**: Limited-time reward multipliers
- **Social Features**: Share achievements with friends
- **Advanced Statistics**: Detailed gameplay analytics

### Customization Options
- **Theme Selection**: Different color schemes for UI
- **Sound Customization**: Custom notification sounds
- **Advanced FPS**: More granular frame rate control
- **Reward Scheduling**: Customizable reward timing

## 📄 License & Support

This enhancement system is designed to work alongside the existing Retro Bowl 2 game without modifying core game files. All features are implemented as overlay systems that integrate respectfully with the original game.

For support or feature requests, refer to the game's main documentation or contact the development team.

---

**Enjoy your enhanced Retro Bowl 2 experience!** 🏈