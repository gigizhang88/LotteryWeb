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
            soundEffects.playLotterySound();
        }
        
        // Start the spinning animation
        this.animationInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * this.participants.length);
            this.currentDisplay.innerHTML = `<span class="spinning">${this.participants[randomIndex]}</span>`;
        }, 100);
        
        // Auto-stop after 4 seconds
        setTimeout(() => {
            if (this.isRunning) {
                this.stopLottery();
            }
        }, 4000);
    }
    
    stopLottery() {
        this.isRunning = false;
        this.lotteryBtn.textContent = 'Start Lottery';
        this.lotteryBtn.classList.remove('running');
        
        // Don't stop sound effects - let them play to completion
        
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
        // Fixed winners that must always be included
        const fixedWinners = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'];
        
        // Get remaining candidates (excluding fixed winners)
        const remainingCandidates = this.participants.filter(
            participant => !fixedWinners.includes(participant)
        );
        
        // Randomly select 2 winners from remaining candidates
        const shuffledRemaining = [...remainingCandidates].sort(() => Math.random() - 0.5);
        const randomWinners = shuffledRemaining.slice(0, 2);
        
        // Combine fixed winners and random winners
        const allWinners = [...fixedWinners, ...randomWinners];
        
        // Shuffle the final list so fixed winners don't always appear first
        return allWinners.sort(() => Math.random() - 0.5);
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
        // Don't play additional win sound - let the lottery sound finish naturally
        
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

// Sound effects using audio file
class SoundEffects {
    constructor() {
        this.lotteryAudio = null;
        this.winAudio = null;
        this.initAudio();
    }
    
    initAudio() {
        // Create audio elements for lottery and win sounds
        this.lotteryAudio = new Audio('sound.mp3');
        this.winAudio = new Audio('sound.mp3');
        
        // Set audio properties
        this.lotteryAudio.loop = false;
        this.lotteryAudio.volume = 0.7;
        this.winAudio.volume = 0.8;
    }
    
    playLotterySound() {
        if (this.lotteryAudio) {
            this.lotteryAudio.currentTime = 0;
            this.lotteryAudio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    playWinSound() {
        if (this.winAudio) {
            this.winAudio.currentTime = 0;
            this.winAudio.play().catch(e => console.log('Audio play failed:', e));
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

