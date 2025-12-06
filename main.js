const audioContext = new AudioContext();
const currentBuffer = {};
const masterGain = audioContext.createGain();
masterGain.connect(audioContext.destination);

//master volume control
const masterVolumeSlider = document.getElementById("master-volume");

masterVolumeSlider.addEventListener("input", () => {
    if(!isMuted)
    {masterGain.gain.value = parseFloat(masterVolumeSlider.value);}
});

//mute button :D
let isMuted = false;
let lastVolume = masterGain.gain.value;
const muteButton = document.getElementById("mute-toggle");
muteButton.addEventListener("click", () => {
    if (!isMuted) {
        masterGain.gain.value = 0;
        muteButton.textContent = "Unmute";
        isMuted = true;
    } else {
        masterGain.gain.value = lastVolume;
        muteButton.textContent = "Mute";
        isMuted = false;
    }
});

async function loadSound(name) {
    console.log("Loading:", name);
    const response = await fetch(`sounds/${name}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    currentBuffer[name] = audioBuffer;
    
}
async function preloadAllSounds() {
    const buttons = document.querySelectorAll('.sound-button');
    const soundFiles = [...buttons].map(btn => btn.dataset.sound);

    const uniqueSounds = [...new Set(soundFiles)];

    await Promise.all(uniqueSounds.map(loadSound));
}

function playSound(name) {
    const src = audioContext.createBufferSource();
    src.buffer = currentBuffer[name];
    const pitchSlider = document.querySelector(`.pitch-slider[data-sound="${name}"]`);
    const pitch = pitchSlider ? parseFloat(pitchSlider.value) : 1;
    src.playbackRate.value = pitch;
    console.log("Pitch for", name, "=", pitch);
    src.connect(masterGain);
    src.start(0);
}
preloadAllSounds();

const button = document.querySelectorAll('.sound-button');
button.forEach(btn => {
    btn.addEventListener('click', () => {
        playSound(btn.dataset.sound);
    });
});