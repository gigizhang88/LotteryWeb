class LotteryApp {
    constructor() {
        this.participants = [
            'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown',
            'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Anderson',
            'Kate Martinez', 'Liam Thompson', 'Maya Rodriguez', 'Noah Garcia', 'Olivia White',
            'Paul Harris', 'Quinn Clark', 'Ruby Lewis', 'Sam Walker', 'Tina Hall'
        ];
        
        this.isRunning = false;
        this.animationInterval = null;
        this.currentDisplay = document.getElementById('currentDisplay');
        this.winnersDisplay = document.getElementById('winnersDisplay');
        this.lotteryBtn = document.getElementById('lotteryBtn');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.lotteryBtn.addEventListener('click', () => {
            if (this.isRunning) {
                this.stopLottery();
            } else {
                this.startLottery();
            }
        });
        
    }
    
    
    startLottery() {
        this.isRunning = true;
        this.lotteryBtn.textContent = 'Stop Lottery';
        this.lotteryBtn.classList.add('running');
        this.currentDisplay.innerHTML = '<span class="spinning">🎲 Spinning...</span>';
        this.winnersDisplay.innerHTML = '<span class="placeholder">Winners will appear here...</span>';
        
        // Start sound effects
        if (typeof soundEffects !== 'undefined') {
            // Ensure audio context is ready
            soundEffects.ensureAudioContext();
            // Play a quick test sound to activate audio
            soundEffects.playTone(440, 0.1, 'sine', 0.2); // A4 note
            // Start the main sound effects
            soundEffects.startSpinningSounds();
            soundEffects.startTensionBuild();
            soundEffects.startLotterySounds();
        }
        
        // Start the spinning animation
        this.animationInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * this.participants.length);
            this.currentDisplay.innerHTML = `<span class="spinning">${this.participants[randomIndex]}</span>`;
        }, 100);
        
        // Auto-stop after 5 seconds
        setTimeout(() => {
            if (this.isRunning) {
                this.stopLottery();
            }
        }, 5000);
    }
    
    stopLottery() {
        this.isRunning = false;
        this.lotteryBtn.textContent = 'Start Lottery';
        this.lotteryBtn.classList.remove('running');
        
        // Stop sound effects
        if (typeof soundEffects !== 'undefined') {
            soundEffects.stopSpinningSounds();
            soundEffects.stopTensionBuild();
            soundEffects.stopLotterySounds();
            // Play drum roll before finale
            soundEffects.playDrumRoll();
        }
        
        // Clear the spinning animation immediately
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        // Immediately clear any spinning elements and show congratulations
        this.currentDisplay.innerHTML = '';
        
        // Force stop any CSS animations
        this.currentDisplay.style.animation = 'none';
        
        // Show congratulations banner
        this.showCongratulations();
        
        // Select winners (fixed to 6 winners)
        const winners = this.selectWinners(6);
        
        // Display winners
        this.displayWinners(winners);
        
        // Play celebration effects
        this.playCelebrationEffects();
    }
    
    selectWinners(count) {
        const shuffled = [...this.participants].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
    
    displayWinners(winners) {
        this.winnersDisplay.innerHTML = '';
        
        winners.forEach((winner, index) => {
            setTimeout(() => {
                const winnerElement = document.createElement('div');
                winnerElement.className = 'winner-item';
                winnerElement.textContent = `${index + 1}. ${winner}`;
                this.winnersDisplay.appendChild(winnerElement);
            }, index * 200); // Stagger the appearance of winners
        });
    }
    
    
    showCongratulations() {
        this.currentDisplay.innerHTML = `
            <div class="congratulations-banner">
                <div class="congratulations-text">🎉 Congratulations! 🎉</div>
            </div>
        `;
        
        // Ensure no image elements exist
        const images = this.currentDisplay.querySelectorAll('img');
        images.forEach(img => img.remove());
    }
    
    playCelebrationEffects() {
        // Play enhanced win sound with delay to sync with drum roll
        if (typeof soundEffects !== 'undefined') {
            setTimeout(() => {
                soundEffects.playWinSound();
            }, 400); // Delay to sync with drum roll
        }
        
        // Create confetti effect
        setTimeout(() => {
            createConfetti();
        }, 500);
    }
    
}

// Initialize the lottery app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LotteryApp();
});

// Enhanced sound effects for lottery celebration
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.spinningInterval = null;
        this.tensionInterval = null;
        this.drummingInterval = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    ensureAudioContext() {
        if (!this.audioContext) {
            this.initAudio();
        }
        // Resume audio context if it's suspended (required by some browsers)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        this.ensureAudioContext();
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playSpinningSound() {
        // Create a gentle lottery wheel spinning sound
        this.ensureAudioContext();
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Gentle spinning frequency
        oscillator.frequency.value = 300 + Math.random() * 100; // 300-400Hz
        oscillator.type = 'sine';
        
        filter.type = 'lowpass';
        filter.frequency.value = 500;
        filter.Q.value = 0.5;
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }
    
    startSpinningSounds() {
        // Play gentle spinning sounds every 200ms during lottery
        console.log('Starting spinning sounds...');
        this.spinningInterval = setInterval(() => {
            this.playSpinningSound();
        }, 200);
    }
    
    stopSpinningSounds() {
        if (this.spinningInterval) {
            clearInterval(this.spinningInterval);
            this.spinningInterval = null;
        }
    }
    
    playTensionBuild(progress) {
        // Progress from 0 to 1 over 5 seconds
        this.ensureAudioContext();
        if (!this.audioContext) return;
        
        const baseFreq = 200 + (progress * 300); // 200Hz to 500Hz
        const volume = 0.1 + (progress * 0.2); // 0.1 to 0.3
        
        this.playTone(baseFreq, 0.1, 'triangle', volume);
        
        // Add harmonics for richness
        if (progress > 0.3) {
            this.playTone(baseFreq * 1.5, 0.1, 'triangle', volume * 0.5);
        }
        if (progress > 0.6) {
            this.playTone(baseFreq * 2, 0.1, 'triangle', volume * 0.3);
        }
    }
    
    startTensionBuild() {
        let progress = 0;
        const startTime = Date.now();
        const duration = 5000; // 5 seconds
        
        console.log('Starting tension build...');
        this.tensionInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            this.playTensionBuild(progress);
            
            if (progress >= 1) {
                clearInterval(this.tensionInterval);
                this.tensionInterval = null;
            }
        }, 200);
    }
    
    stopTensionBuild() {
        if (this.tensionInterval) {
            clearInterval(this.tensionInterval);
            this.tensionInterval = null;
        }
    }
    
    playWinSound() {
        // Enhanced celebratory sound with multiple layers
        const now = this.audioContext.currentTime;
        
        // Main melody
        this.playTone(523, 0.3, 'sine', 0.4); // C5
        setTimeout(() => this.playTone(659, 0.3, 'sine', 0.4), 100); // E5
        setTimeout(() => this.playTone(784, 0.5, 'sine', 0.4), 200); // G5
        
        // Add harmony
        setTimeout(() => this.playTone(392, 0.4, 'sine', 0.2), 150); // G4
        setTimeout(() => this.playTone(494, 0.4, 'sine', 0.2), 250); // B4
        
        // Add sparkle effect
        setTimeout(() => this.playTone(1047, 0.1, 'sine', 0.3), 300); // C6
        setTimeout(() => this.playTone(1319, 0.1, 'sine', 0.3), 350); // E6
        setTimeout(() => this.playTone(1568, 0.2, 'sine', 0.3), 400); // G6
        
        // Final fanfare
        setTimeout(() => {
            this.playTone(523, 0.2, 'sine', 0.5); // C5
            this.playTone(659, 0.2, 'sine', 0.5); // E5
            this.playTone(784, 0.2, 'sine', 0.5); // G5
            this.playTone(1047, 0.3, 'sine', 0.5); // C6
        }, 500);
    }
    
    playDrumRoll() {
        // Quick drum roll effect before the finale
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.playTone(60, 0.05, 'sawtooth', 0.2); // Low frequency for drum effect
            }, i * 50);
        }
    }
    
    createLotterySound(type = 'tick') {
        this.ensureAudioContext();
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        if (type === 'tick') {
            // Lottery wheel tick sound - like a spinning wheel
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
            oscillator.type = 'sine';
            
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            
            gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
            
        } else if (type === 'bounce') {
            // Bouncing ball sound - like lottery balls bouncing
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
            oscillator.type = 'triangle';
            
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
            
        } else if (type === 'chime') {
            // Pleasant chime sound - like a bell
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            filter.type = 'lowpass';
            filter.frequency.value = 2000;
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
            
        } else if (type === 'whoosh') {
            // Whoosh sound - like air rushing
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(50, this.audioContext.currentTime + 0.2);
            oscillator.type = 'sawtooth';
            
            filter.type = 'lowpass';
            filter.frequency.value = 300;
            
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.25);
        }
    }
    
    startLotterySounds() {
        console.log('Starting lottery sounds...');
        let beatCount = 0;
        const startTime = Date.now();
        
        this.drummingInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / 5000, 1); // 5 seconds total
            
            // Create different lottery-themed patterns based on progress
            let pattern;
            
            if (progress < 0.2) {
                // Slow start: gentle ticks
                pattern = ['tick', 'tick', 'chime', 'tick'];
            } else if (progress < 0.4) {
                // Building up: add bounces
                pattern = ['tick', 'bounce', 'tick', 'chime'];
            } else if (progress < 0.6) {
                // Getting more active: mix of sounds
                pattern = ['tick', 'bounce', 'chime', 'tick', 'bounce'];
            } else if (progress < 0.8) {
                // Intensifying: faster patterns
                pattern = ['tick', 'bounce', 'tick', 'bounce', 'chime', 'tick'];
            } else {
                // Final intensity: rapid lottery sounds
                pattern = ['tick', 'bounce', 'tick', 'bounce', 'tick', 'chime', 'bounce', 'tick'];
            }
            
            const currentBeat = beatCount % pattern.length;
            this.createLotterySound(pattern[currentBeat]);
            beatCount++;
            
            // Add occasional whoosh sounds for excitement
            if (Math.random() < 0.1) {
                setTimeout(() => this.createLotterySound('whoosh'), 50);
            }
            
        }, 120); // Faster tempo for excitement
    }
    
    stopLotterySounds() {
        if (this.drummingInterval) {
            clearInterval(this.drummingInterval);
            this.drummingInterval = null;
            console.log('Stopped lottery sounds');
        }
    }
}

// Initialize sound effects
const soundEffects = new SoundEffects();

// Confetti effect for winners
function createConfetti() {
    const colors = ['#040c2c', '#263d7f', '#695aa7', '#4a5d8a', '#7b68ee', '#9370db'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 10);
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

