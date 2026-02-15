function hablarTexto(texto) {
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance(texto);
  utter.lang = "es-CO";
  utter.rate = 1;
  window.speechSynthesis.speak(utter);
}

// Inicia el reconocimiento de voz
function iniciarSTT(onTextoFinal) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Tu navegador no soporta reconocimiento de voz");
    return null;
  }

  //Se configura el reconocimiento de voz
  const recognition = new SpeechRecognition();
  recognition.lang = "es-CO";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    onTextoFinal(texto);
  };

  // Muestra un error si no hubo reconocimiento de voz
  recognition.onerror = (event) => {
    console.error("Error STT:", event.error);
  };

  recognition.onend = () => {
    console.log("Reconocimiento terminado");
  };

  recognition.start();
  return recognition;
}

// Funcion que se ejecuta al presionar el microfono
const btnMic = document.getElementById("btn-mic");
const textoUser = document.getElementById("texto-user");
const textoAgente = document.getElementById("texto-agente");

btnMic.addEventListener("click", () => {
  iniciarSTT(async (textoReconocido) => {
    // Muestra lo que dijo el usuario
    textoUser.textContent = textoReconocido;

    // Envia lo que dijo el usuario al backend
    const res = await fetch("http://localhost:4000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensaje: textoReconocido,
        tipoUsuario: "free",
      }),
    });

    const data = await res.json(); 

    // Muestra la respuesta en el chat
    textoAgente.textContent = data.respuesta;

    // El bot lee el mensaje por TTS
    hablarTexto(data.respuesta);
  });
});
