let voiceToText = document.querySelector("#voice-to-text");
let textToVoice = document.querySelector("#text-to-voice");

voiceToText.addEventListener("click",function() {
let recognition = new webkitSpeechRecognition();
recognition.lang = "en-GB";
recognition.onresult = function(event){
    document.querySelector("#text-area").value = event.results[0][0].transcript;
}
recognition.start();
});

textToVoice.addEventListener("click",function(){
    let speech = new SpeechSynthesisUtterance();
    speech.text = document.querySelector("#text-area").value;
    window.speechSynthesis.speak(speech);
} )
                                                                                                                                                