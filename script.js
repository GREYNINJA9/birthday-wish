document.getElementById('wishForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const wish = document.getElementById('wish').value;

    document.getElementById('wish-name').textContent = `Happy Birthday, ${name}!`;
    document.getElementById('wish-age').textContent = `Age: ${age}`;
    document.getElementById('wish-message').textContent = wish;

    document.getElementById('form-container').style.display = 'none';
    document.getElementById('wish-container').style.display = 'block';

    startListeningForBlow();
});

function startListeningForBlow() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            function checkBlow() {
                analyser.getByteFrequencyData(dataArray);
                const blowLevel = dataArray.reduce((a, b) => a + b) / bufferLength;

                if (blowLevel > 150) {
                    blowOutCandles();
                } else {
                    requestAnimationFrame(checkBlow);
                }
            }

            checkBlow();
        });
}

function blowOutCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach(candle => candle.style.background = 'gray');
    document.querySelectorAll('.candle::before').forEach(flame => flame.style.display = 'none');

    setTimeout(() => {
        document.getElementById('message-container').style.display = 'block';
    }, 2000);
}
