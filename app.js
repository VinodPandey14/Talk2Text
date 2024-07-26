let voiceToText = document.querySelector("#voice-to-text");
let textToVoice = document.querySelector("#text-to-voice");
let stop = document.querySelector("#stop");
let translateBtn = document.querySelector("#translate");
let saveBtn = document.querySelector("#save");
let voiceSelect = document.querySelector("#voice-select");

voiceToText.addEventListener("click", function() {
    let recognition = new webkitSpeechRecognition();
    recognition.lang = "en-GB";
    recognition.onresult = function(event){
        document.querySelector("#text-area").value = event.results[0][0].transcript;
    }
    recognition.start();
});

textToVoice.addEventListener("click", function() {
    let speech = new SpeechSynthesisUtterance();
    speech.text = document.querySelector("#text-area").value;
    speech.pitch = document.querySelector("#pitch").value;
    speech.rate = document.querySelector("#rate").value;
    speech.volume = document.querySelector("#volume").value;

    let selectedVoice = voiceSelect.value;
    let voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
        speech.voice = voice;
    }

    window.speechSynthesis.speak(speech);
});

stop.addEventListener("click", () => {
    window.speechSynthesis.cancel();
});

translateBtn.addEventListener("click", async () => {
    let text = document.querySelector("#text-area").value;
    let targetLanguage = document.querySelector("#language-select").value;
    let translatedText = await translateText(text, targetLanguage);
    document.querySelector("#text-area").value = translatedText;
});

async function translateText(text, targetLanguage) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`;
    const response = await fetch(url);

    if (!response.ok) {
        console.error('Translation API error:', response.statusText);
        return 'Translation error';
    }

    const result = await response.json();
    return result.responseData.translatedText;
}

saveBtn.addEventListener("click", () => {
    let text = document.querySelector("#text-area").value;
    let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Talk2Text.txt";
    link.click();
});

function populateVoiceOptions() {
    let voices = window.speechSynthesis.getVoices();
    let voiceSelect = document.querySelector("#voice-select");

    if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = populateVoiceOptions;
        return;
    }

    let voiceOptions = voices.filter(v =>
        ['Google US English', 'Google UK English Male', 'Google UK English Female', 'Google Hindi', 'Microsoft Hindi Desktop - Hindi'].includes(v.name)
    );
    if (!voiceOptions.some(v => v.name === 'Google Hindi')) {
        voiceOptions.push(voices.find(v => v.name === 'Google Hindi') || {name: 'Google Hindi', lang: 'hi-IN'});
    }
    if (!voiceOptions.some(v => v.name === 'Google US English')) {
        voiceOptions.push(voices.find(v => v.name === 'Google US English') || {name: 'Google US English', lang: 'en-US'});
    }

    voiceSelect.innerHTML = '';
    voiceOptions.forEach(voice => {
        let option = document.createElement("option");
        option.textContent = voice.name;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    });
}

populateVoiceOptions();