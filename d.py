import pyttsx3
# Obtiene una lista de voces disponibles
voices = pyttsx3.init()


# Selecciona una voz con la tonalidad deseada
voices.setVoice(voices[1].id)

# Hace que el motor hable en voz alta
voices.say("Hola, ¿cómo estás?")
voices.runAndWait()
