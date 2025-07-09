// Enhanced Credits Integration System
// This script attempts to integrate credits more deeply with the GameMaker game

class CreditsIntegration {
    constructor() {
        this.credits = 0;
        this.creditsHistory = [];
        this.gameVariables = {};
        this.init();
    }

    init() {
        this.scanGameVariables();
        this.setupCreditWatcher();
        this.setupAdvancedRewards();
        this.createCreditsDisplay();
        this.interceptGameSave();
    }

    // Scan for possible credit variables in the game
    scanGameVariables() {
        const possibleCreditVars = [
            '_SF', 'coach_credit', '_9n', 'credits', 'coins', 'money', 'cash'
        ];

        // Check if we have access to the game's global variables
        if (typeof window !== 'undefined') {
            for (let varName of possibleCreditVars) {
                if (window[varName] !== undefined) {
                    this.gameVariables[varName] = window[varName];
                    console.log(`Found potential credit variable: ${varName} = ${window[varName]}`);
                }
            }
        }

        // Load stored credits
        this.loadCredits();
    }

    // Load credits from localStorage
    loadCredits() {
        const stored = localStorage.getItem('retroBowl2_credits_enhanced');
        if (stored) {
            const data = JSON.parse(stored);
            this.credits = data.credits || 0;
            this.creditsHistory = data.history || [];
        }
    }

    // Save credits to localStorage
    saveCredits() {
        const data = {
            credits: this.credits,
            history: this.creditsHistory,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('retroBowl2_credits_enhanced', JSON.stringify(data));
    }

    // Add credits with history tracking
    addCredits(amount, reason = 'Unknown') {
        this.credits += amount;
        this.creditsHistory.push({
            amount: amount,
            reason: reason,
            timestamp: new Date().toISOString(),
            total: this.credits
        });

        // Keep only last 50 transactions
        if (this.creditsHistory.length > 50) {
            this.creditsHistory = this.creditsHistory.slice(-50);
        }

        this.saveCredits();
        this.updateCreditsDisplay();
        this.syncWithGame();
    }

    // Try to sync credits with the actual game
    syncWithGame() {
        try {
            // Try multiple methods to add credits to the game
            const creditAmount = this.credits;

            // Method 1: Direct variable access
            for (let varName in this.gameVariables) {
                if (window[varName] !== undefined) {
                    window[varName] = Math.max(window[varName] || 0, creditAmount);
                }
            }

            // Method 2: Try to find and modify game save data
            if (window.localStorage) {
                // Look for game save keys
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.includes('save') || key.includes('game') || key.includes('retro'))) {
                        try {
                            const data = localStorage.getItem(key);
                            if (data && data.includes('credit')) {
                                // Try to parse and modify
                                console.log(`Found potential save data in: ${key}`);
                            }
                        } catch (e) {
                            // Ignore parsing errors
                        }
                    }
                }
            }

        } catch (e) {
            console.warn('Could not sync credits with game:', e);
        }
    }

    // Setup credit watcher to detect game credit changes
    setupCreditWatcher() {
        setInterval(() => {
            this.watchGameCredits();
        }, 1000);
    }

    // Watch for changes in game credit variables
    watchGameCredits() {
        try {
            for (let varName in this.gameVariables) {
                if (window[varName] !== undefined && window[varName] !== this.gameVariables[varName]) {
                    const oldValue = this.gameVariables[varName];
                    const newValue = window[varName];
                    
                    console.log(`Game credit variable ${varName} changed: ${oldValue} -> ${newValue}`);
                    this.gameVariables[varName] = newValue;
                    
                    // If game credits increased, sync our credits
                    if (newValue > oldValue) {
                        const increase = newValue - oldValue;
                        this.addCredits(increase, `Game credit increase (${varName})`);
                    }
                }
            }
        } catch (e) {
            // Ignore errors
        }
    }

    // Setup advanced reward system
    setupAdvancedRewards() {
        this.setupWeeklyReward();
        this.setupPlaytimeRewards();
        this.setupAchievementRewards();
    }

    // Weekly reward system
    setupWeeklyReward() {
        const lastWeeklyReward = localStorage.getItem('retroBowl2_weeklyReward');
        const now = new Date();
        
        if (!lastWeeklyReward) {
            localStorage.setItem('retroBowl2_weeklyReward', now.toISOString());
            return;
        }

        const lastReward = new Date(lastWeeklyReward);
        const daysSinceReward = Math.floor((now - lastReward) / (1000 * 60 * 60 * 24));
        
        if (daysSinceReward >= 7) {
            setTimeout(() => {
                this.showWeeklyReward();
            }, 5000);
        }
    }

    // Show weekly reward
    showWeeklyReward() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10004;
        `;

        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #8A2BE2, #4B0082); padding: 40px; border-radius: 20px; border: 4px solid #fff; text-align: center; color: white; font-family: Arial, sans-serif; max-width: 500px;">
                <div style="font-size: 60px; margin-bottom: 20px;">👑</div>
                <h2 style="margin: 0 0 15px 0; font-size: 28px;">Weekly Bonus!</h2>
                <p style="font-size: 18px; margin-bottom: 25px;">You've been playing for a week! Here's your loyalty bonus:</p>
                <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <div style="font-size: 36px; color: #FFD700; font-weight: bold;">💰 25 Credits</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove(); window.creditsIntegration.claimWeeklyReward();" style="background: #4CAF50; color: white; border: none; padding: 15px 40px; border-radius: 10px; font-size: 18px; cursor: pointer; font-weight: bold;">Claim Weekly Bonus</button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Claim weekly reward
    claimWeeklyReward() {
        localStorage.setItem('retroBowl2_weeklyReward', new Date().toISOString());
        this.addCredits(25, 'Weekly loyalty bonus');
        this.showNotification('Weekly bonus claimed! +25 Credits', 'success');
    }

    // Playtime rewards
    setupPlaytimeRewards() {
        this.startPlaytimeTracking();
    }

    // Track playtime
    startPlaytimeTracking() {
        let sessionStartTime = Date.now();
        let totalPlaytime = parseInt(localStorage.getItem('retroBowl2_playtime') || '0');
        
        setInterval(() => {
            const currentSession = Date.now() - sessionStartTime;
            const currentTotal = totalPlaytime + currentSession;
            
            // Award credits every 10 minutes of play
            const minutes = Math.floor(currentTotal / (1000 * 60));
            const rewardMinutes = Math.floor(minutes / 10) * 10;
            const lastRewardMinutes = parseInt(localStorage.getItem('retroBowl2_playtimeRewards') || '0');
            
            if (rewardMinutes > lastRewardMinutes) {
                const creditsEarned = (rewardMinutes - lastRewardMinutes) / 10;
                this.addCredits(creditsEarned, `Playtime reward (${rewardMinutes} minutes)`);
                localStorage.setItem('retroBowl2_playtimeRewards', rewardMinutes.toString());
                this.showNotification(`+${creditsEarned} Credits for playing!`, 'info');
            }
            
            localStorage.setItem('retroBowl2_playtime', currentTotal.toString());
        }, 60000); // Check every minute
    }

    // Achievement rewards
    setupAchievementRewards() {
        // Monitor for game achievements
        setInterval(() => {
            this.checkAchievements();
        }, 5000);
    }

    // Check for achievements (simplified)
    checkAchievements() {
        const achievements = [
            { id: 'first_game', name: 'First Game', credits: 10, condition: () => this.getPlaytimeMinutes() > 5 },
            { id: 'dedicated_player', name: 'Dedicated Player', credits: 50, condition: () => this.getPlaytimeMinutes() > 60 },
            { id: 'marathon_player', name: 'Marathon Player', credits: 100, condition: () => this.getPlaytimeMinutes() > 180 }
        ];

        const unlockedAchievements = JSON.parse(localStorage.getItem('retroBowl2_achievements') || '[]');

        achievements.forEach(achievement => {
            if (!unlockedAchievements.includes(achievement.id) && achievement.condition()) {
                unlockedAchievements.push(achievement.id);
                localStorage.setItem('retroBowl2_achievements', JSON.stringify(unlockedAchievements));
                this.addCredits(achievement.credits, `Achievement: ${achievement.name}`);
                this.showAchievementUnlocked(achievement);
            }
        });
    }

    // Get playtime in minutes
    getPlaytimeMinutes() {
        const playtime = parseInt(localStorage.getItem('retroBowl2_playtime') || '0');
        return Math.floor(playtime / (1000 * 60));
    }

    // Show achievement unlocked
    showAchievementUnlocked(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #333;
            padding: 20px;
            border-radius: 15px;
            font-family: Arial, sans-serif;
            z-index: 10005;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            max-width: 300px;
            animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 4s;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="font-size: 24px; margin-right: 10px;">🏆</div>
                <strong>Achievement Unlocked!</strong>
            </div>
            <div style="font-size: 16px; margin-bottom: 10px;">${achievement.name}</div>
            <div style="font-size: 14px; color: #4CAF50; font-weight: bold;">+${achievement.credits} Credits</div>
        `;

        document.body.appendChild(notification);

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }

    // Create credits display overlay
    createCreditsDisplay() {
        const display = document.createElement('div');
        display.id = 'credits-display';
        display.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #FFD700;
            padding: 10px 15px;
            border-radius: 20px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 16px;
            z-index: 10000;
            border: 2px solid #FFD700;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        `;

        display.innerHTML = `💰 ${this.credits} Credits`;
        
        display.onclick = () => this.showCreditsHistory();
        
        display.onmouseover = () => {
            display.style.background = 'rgba(0, 0, 0, 0.95)';
            display.style.transform = 'scale(1.05)';
        };
        
        display.onmouseout = () => {
            display.style.background = 'rgba(0, 0, 0, 0.8)';
            display.style.transform = 'scale(1)';
        };

        document.body.appendChild(display);
    }

    // Update credits display
    updateCreditsDisplay() {
        const display = document.getElementById('credits-display');
        if (display) {
            display.innerHTML = `💰 ${this.credits} Credits`;
            
            // Animation effect
            display.style.transform = 'scale(1.2)';
            display.style.color = '#4CAF50';
            setTimeout(() => {
                display.style.transform = 'scale(1)';
                display.style.color = '#FFD700';
            }, 300);
        }
    }

    // Show credits history
    showCreditsHistory() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10006;
        `;

        const historyHtml = this.creditsHistory.slice(-10).reverse().map(entry => `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <span>${entry.reason}</span>
                <span style="color: #4CAF50;">+${entry.amount}</span>
            </div>
        `).join('');

        modal.innerHTML = `
            <div style="background: #1e3c72; padding: 30px; border-radius: 15px; border: 3px solid #fff; max-width: 500px; width: 90%; color: white; font-family: Arial, sans-serif;">
                <h2 style="margin: 0 0 20px 0; text-align: center;">Credits History</h2>
                <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <div style="font-size: 24px; text-align: center; color: #FFD700;">Total: ${this.credits} Credits</div>
                </div>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${historyHtml || '<div style="text-align: center; color: #ccc;">No transactions yet</div>'}
                </div>
                <button onclick="this.parentElement.parentElement.remove();" style="width: 100%; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; margin-top: 20px;">Close</button>
            </div>
        `;

        document.body.appendChild(modal);
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    // Intercept game save to inject credits
    interceptGameSave() {
        // Override localStorage.setItem to inject credits
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            try {
                // Check if this might be a game save
                if (key.includes('save') || key.includes('game') || key.includes('retro')) {
                    // Try to parse and modify the save data
                    if (value && typeof value === 'string') {
                        // If it looks like JSON, try to add credits
                        if (value.startsWith('{') || value.startsWith('[')) {
                            try {
                                const data = JSON.parse(value);
                                if (typeof data === 'object') {
                                    // Add our credits to various possible credit fields
                                    const creditFields = ['credits', 'coins', 'money', 'cash', 'coach_credit'];
                                    creditFields.forEach(field => {
                                        if (data[field] !== undefined) {
                                            data[field] = Math.max(data[field], this.credits);
                                        }
                                    });
                                    value = JSON.stringify(data);
                                }
                            } catch (e) {
                                // If parsing fails, use original value
                            }
                        }
                    }
                }
            } catch (e) {
                // If anything goes wrong, use original value
            }
            
            return originalSetItem.call(localStorage, key, value);
        };
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            z-index: 10007;
            font-size: 14px;
            animation: slideDown 0.3s ease, slideUp 0.3s ease 2.2s;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 2500);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.creditsIntegration = new CreditsIntegration();
});

// Also initialize if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.creditsIntegration = new CreditsIntegration();
    });
} else {
    window.creditsIntegration = new CreditsIntegration();
}