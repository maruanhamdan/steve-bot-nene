// Intro animation
window.addEventListener('load', () => {
    const intro = document.getElementById('intro');
    const main = document.getElementById('main');
    
    // Show intro for 2.5 seconds
    setTimeout(() => {
        intro.style.opacity = '0';
        intro.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            intro.style.display = 'none';
            main.style.display = 'flex';
            main.style.animation = 'fadeIn 0.5s ease-in';
        }, 500);
    }, 2500);
});

// Start game button
document.getElementById('startGame').addEventListener('click', () => {
    window.location.href = 'game.html';
});

// Start sequence game button
document.getElementById('startGameSequence').addEventListener('click', () => {
    window.location.href = 'game-sequence.html';
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add click effect to blocks
    const blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
        block.addEventListener('click', () => {
            block.style.transform = 'scale(1.2)';
            setTimeout(() => {
                block.style.transform = '';
            }, 200);
        });
    });
});
