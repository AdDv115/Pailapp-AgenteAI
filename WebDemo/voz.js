export function STT(onTextoFinal) { 
 iniciarSTT(onTextoFinal) {
    const SpeechRecognition = windows.SpeechRecognition = windows.SpeechRecognition || windows.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Tu navegador no soporta Reconocimiento de voz")
        return null;
    }

    const recognition = new SpeechRecognition();
        SpeechRecognition();

        recognition.lang = "es-CO";

        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const texto = event.results[0][0].transcript;

            onTextoFinal(texto); //Texto al api
        };

        recognition.onerror = (event) => {
            console.error("Error STT: ",event.error);
        };

        recognition.onend = () => {
            console.log("Reconocimiento de voz terminado");
        };

        recognition.start();

        return recognition;
 }
    
}