// Game Settings and Daily Rewards System
// Retro Bowl 2 Enhancement

class GameSettings {
    constructor() {
        this.settings = this.loadSettings();
        this.lastRewardClaim = this.getLastRewardClaim();
        this.init();
    }

    init() {
        this.createSettingsUI();
        this.setupFPSControl();
        this.checkDailyReward();
    }

    // Load settings from localStorage
    loadSettings() {
        const defaultSettings = {
            fps: 60,
            soundEnabled: true,
            musicEnabled: true
        };
        
        const saved = localStorage.getItem('retroBowl2_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('retroBowl2_settings', JSON.stringify(this.settings));
    }

    // Get last reward claim date
    getLastRewardClaim() {
        const saved = localStorage.getItem('retroBowl2_lastReward');
        return saved ? new Date(saved) : null;
    }

    // Save last reward claim date
    saveLastRewardClaim() {
        localStorage.setItem('retroBowl2_lastReward', new Date().toISOString());
    }

    // Check if daily reward is available
    isDailyRewardAvailable() {
        if (!this.lastRewardClaim) return true;
        
        const now = new Date();
        const lastClaim = new Date(this.lastRewardClaim);
        const diffTime = Math.abs(now - lastClaim);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 1;
    }

    // Setup FPS control
    setupFPSControl() {
        // Override the game's FPS if possible
        if (window.GameMaker_Init) {
            const originalInit = window.GameMaker_Init;
            window.GameMaker_Init = () => {
                originalInit();
                this.applyFPSSetting();
            };
        } else {
            // Try to apply immediately
            setTimeout(() => this.applyFPSSetting(), 1000);
        }
    }

    // Apply FPS setting to the game engine
    applyFPSSetting() {
        try {
            // Try to access GameMaker's FPS variables
            if (window._eQ2 !== undefined) {
                window._eQ2 = this.settings.fps;
            }
            
            // Try alternative FPS controls
            if (window.room_speed !== undefined) {
                window.room_speed = this.settings.fps;
            }

            // Browser-level FPS control for canvas animation
            const canvas = document.getElementById('canvas');
            if (canvas && canvas.getContext) {
                this.setupCanvasFPSLimit(canvas);
            }

            console.log(`FPS set to: ${this.settings.fps}`);
        } catch (e) {
            console.warn('Could not apply FPS setting:', e);
        }
    }

    // Setup canvas FPS limiting
    setupCanvasFPSLimit(canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const targetFPS = this.settings.fps;
        const frameTime = 1000 / targetFPS;
        let lastFrameTime = 0;

        // Override requestAnimationFrame for this canvas
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = (callback) => {
            return originalRAF((currentTime) => {
                if (currentTime - lastFrameTime >= frameTime) {
                    lastFrameTime = currentTime;
                    callback(currentTime);
                }
            });
        };
    }

    // Create settings UI overlay
    createSettingsUI() {
        // Settings button
        const settingsBtn = document.createElement('div');
        settingsBtn.id = 'settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            z-index: 10000;
            transition: all 0.3s ease;
        `;
        
        settingsBtn.onmouseover = () => {
            settingsBtn.style.background = 'rgba(0, 0, 0, 0.9)';
            settingsBtn.style.transform = 'scale(1.1)';
        };
        
        settingsBtn.onmouseout = () => {
            settingsBtn.style.background = 'rgba(0, 0, 0, 0.7)';
            settingsBtn.style.transform = 'scale(1)';
        };

        settingsBtn.onclick = () => this.showSettingsModal();
        document.body.appendChild(settingsBtn);

        this.createSettingsModal();
    }

    // Create settings modal
    createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            padding: 30px;
            border-radius: 15px;
            border: 3px solid #fff;
            max-width: 400px;
            width: 90%;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;

        modalContent.innerHTML = `
            <h2 style="margin: 0 0 20px 0; text-align: center; color: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Game Settings</h2>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 10px; font-weight: bold;">Frame Rate (FPS):</label>
                <select id="fps-select" style="width: 100%; padding: 8px; border-radius: 5px; border: none; font-size: 16px;">
                    <option value="60" ${this.settings.fps === 60 ? 'selected' : ''}>60 FPS (Smooth)</option>
                    <option value="120" ${this.settings.fps === 120 ? 'selected' : ''}>120 FPS (Ultra Smooth)</option>
                </select>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="sound-toggle" ${this.settings.soundEnabled ? 'checked' : ''} style="margin-right: 10px;">
                    <span>Sound Effects</span>
                </label>
            </div>

            <div style="margin-bottom: 30px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="music-toggle" ${this.settings.musicEnabled ? 'checked' : ''} style="margin-right: 10px;">
                    <span>Background Music</span>
                </label>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="save-settings" style="flex: 1; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">Save</button>
                <button id="close-settings" style="flex: 1; padding: 12px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">Close</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('save-settings').onclick = () => {
            this.settings.fps = parseInt(document.getElementById('fps-select').value);
            this.settings.soundEnabled = document.getElementById('sound-toggle').checked;
            this.settings.musicEnabled = document.getElementById('music-toggle').checked;
            
            this.saveSettings();
            this.applyFPSSetting();
            this.hideSettingsModal();
            
            // Show confirmation
            this.showNotification('Settings saved successfully!', 'success');
        };

        document.getElementById('close-settings').onclick = () => this.hideSettingsModal();
        modal.onclick = (e) => {
            if (e.target === modal) this.hideSettingsModal();
        };
    }

    // Show settings modal
    showSettingsModal() {
        document.getElementById('settings-modal').style.display = 'flex';
    }

    // Hide settings modal
    hideSettingsModal() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    // Check and show daily reward
    checkDailyReward() {
        if (this.isDailyRewardAvailable()) {
            setTimeout(() => this.showDailyReward(), 2000); // Show after game loads
        }
    }

    // Show daily reward modal
    showDailyReward() {
        const modal = document.createElement('div');
        modal.id = 'daily-reward-modal';
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
            z-index: 10002;
            animation: fadeIn 0.5s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #FFD700, #FFA500);
            padding: 40px;
            border-radius: 20px;
            border: 4px solid #fff;
            max-width: 500px;
            width: 90%;
            text-align: center;
            color: #333;
            font-family: Arial, sans-serif;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.6s ease;
        `;

        modalContent.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">🎁</div>
            <h2 style="margin: 0 0 15px 0; color: #333; font-size: 28px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">Daily Reward!</h2>
            <p style="font-size: 18px; margin-bottom: 25px; color: #555;">Welcome back! Claim your daily reward of:</p>
            <div style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                <div style="font-size: 36px; color: #4CAF50; font-weight: bold; margin-bottom: 5px;">💰 5 Credits</div>
                <div style="font-size: 14px; color: #666;">Come back tomorrow for another reward!</div>
            </div>
            <button id="claim-reward" style="background: #4CAF50; color: white; border: none; padding: 15px 40px; border-radius: 10px; font-size: 18px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3); transition: all 0.3s ease;">Claim Reward</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px) scale(0.8); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
            }
            #claim-reward:hover {
                background: #45a049 !important;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
            }
        `;
        document.head.appendChild(style);

        // Claim reward event
        document.getElementById('claim-reward').onclick = () => {
            this.claimDailyReward();
            document.body.removeChild(modal);
        };
    }

    // Claim daily reward
    claimDailyReward() {
        // Save the claim date
        this.saveLastRewardClaim();
        this.lastRewardClaim = new Date();

        // Try to add credits to the game
        this.addCreditsToGame(5);

        // Show success notification
        this.showNotification('Daily reward claimed! +5 Credits added', 'success');
    }

    // Add credits to game (try multiple methods)
    addCreditsToGame(amount) {
        try {
            // Try to find and modify GameMaker credit variables
            // These are common patterns in GameMaker games
            if (window.global && window.global.credits !== undefined) {
                window.global.credits += amount;
            }
            
            // Alternative credit storage locations
            const creditVariables = ['credits', 'coins', 'money', 'cash', '_SF', 'coach_credit'];
            
            for (let varName of creditVariables) {
                if (window[varName] !== undefined) {
                    window[varName] += amount;
                    break;
                }
            }

            // Store credits in localStorage as backup
            const currentCredits = parseInt(localStorage.getItem('retroBowl2_credits') || '0');
            localStorage.setItem('retroBowl2_credits', (currentCredits + amount).toString());

            console.log(`Added ${amount} credits to the game`);
        } catch (e) {
            console.warn('Could not add credits directly to game, stored in localStorage:', e);
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            z-index: 10003;
            animation: slideDown 0.5s ease, slideUp 0.5s ease 2.5s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translate(-50%, -100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translate(-50%, 0); opacity: 1; }
                to { transform: translate(-50%, -100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameSettings = new GameSettings();
});

// Also initialize if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gameSettings = new GameSettings();
    });
} else {
    window.gameSettings = new GameSettings();
}