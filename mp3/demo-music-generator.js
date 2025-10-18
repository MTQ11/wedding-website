// Music Generator for Demo
// This creates a simple demo audio file for testing

function generateDemoMusic() {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a simple melody using oscillators
    const createTone = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    };
    
    // Simple wedding march melody notes
    const notes = [
        { freq: 523.25, time: 0, duration: 0.5 },    // C5
        { freq: 587.33, time: 0.5, duration: 0.5 },  // D5
        { freq: 659.25, time: 1, duration: 0.5 },    // E5
        { freq: 698.46, time: 1.5, duration: 0.5 },  // F5
        { freq: 783.99, time: 2, duration: 1 },      // G5
        { freq: 659.25, time: 3, duration: 0.5 },    // E5
        { freq: 587.33, time: 3.5, duration: 0.5 },  // D5
        { freq: 523.25, time: 4, duration: 1 },      // C5
    ];
    
    // Play the melody
    notes.forEach(note => {
        createTone(note.freq, audioContext.currentTime + note.time, note.duration);
    });
    
    console.log('Demo music playing...');
}

// Export for use in wedding website
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateDemoMusic };
}