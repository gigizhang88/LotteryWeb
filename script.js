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
        // Play win sound
        if (typeof soundEffects !== 'undefined') {
            soundEffects.playWinSound();
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

// Sound effects for lottery celebration
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playTone(frequency, duration) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playWinSound() {
        // Play a celebratory sound
        this.playTone(523, 0.2); // C5
        setTimeout(() => this.playTone(659, 0.2), 100); // E5
        setTimeout(() => this.playTone(784, 0.4), 200); // G5
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

