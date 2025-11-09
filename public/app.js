// Elementos
const splash = document.getElementById('splash');
const mainApp = document.getElementById('mainApp');
const enterAppBtn = document.getElementById('enterApp');
const backToVideoBtn = document.getElementById('backToVideo');
const splashVideo = document.getElementById('splashVideo');

const chat = document.getElementById('chat');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const status = document.getElementById('status');
const cards = document.querySelectorAll('.card');

// Web Speech API - Configuração CORRETA para Safari iOS/iPad
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// Detectar se está em iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

console.log('🔍 Detecção:', { isIOS, isSafari, hasRecognition: !!recognition });

if (recognition) {
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3; // Mais alternativas para iOS
    
    // Configuração especial para iOS/Safari
    if (isIOS || isSafari) {
        console.log('📱 Modo iOS/Safari ativado');
    }
}

let isListening = false;
let isSpeaking = false;
let recognitionTimeout = null;
let micPermissionGranted = false;

// Emojis Minecraft
const emojis = {
    'espada': '⚔️', 'picareta': '⛏️', 'machado': '🪓', 
    'diamante': '💎', 'ouro': '✨', 'ferro': '⚙️',
    'armadura': '🛡️', 'casa': '🏠', 'castelo': '🏰',
    'portal': '🌀', 'carne': '🍖', 'pão': '🍞',
    'creeper': '💥', 'zombie': '🧟', 'esqueleto': '💀',
    'dragão': '🐉', 'dragon': '🐉', 'poção': '🧪',
    'nether': '🔥', 'end': '🌌', 'craft': '🔨',
    'minerar': '⛏️', 'build': '🏗️'
};

function addEmojis(text) {
    let result = text;
    for (let word in emojis) {
        const regex = new RegExp(`\\b${word}s?\\b`, 'gi');
        if (regex.test(result) && !result.includes(emojis[word])) {
            result = result.replace(regex, match => `${match} ${emojis[word]}`);
        }
    }
    return result;
}

// Adicionar mensagem
function addMsg(text, isUser = false) {
    // Remove welcome
    const welcome = chat.querySelector('.welcome');
    if (welcome) welcome.remove();
    
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user-msg' : 'bot-msg'}`;
    div.innerHTML = isUser ? text : addEmojis(text);
    
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// LIMPAR EMOJIS E MELHORAR PRONÚNCIA
function cleanTextForSpeech(text) {
    return text
        // Remove apenas emojis e símbolos
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[\u{2600}-\u{26FF}]/gu, '')
        .replace(/[\u{2700}-\u{27BF}]/gu, '')
        // CORREÇÃO ESPECÍFICA: Heitor com pronúncia fluida e natural
        .replace(/\bHeitor\b/gi, 'Eitor')
        // Remove múltiplos espaços
        .replace(/\s+/g, ' ')
        .trim();
}

// UMA VOZ SÓ - A MELHOR DISPONÍVEL
// === VOICE FUNCTIONS - ELEVENLABS ===
async function speak(text) {
  if (isSpeaking) return;
  
  isSpeaking = true;
  const cleanedText = cleanTextForSpeech(text);
  
  status.textContent = '🔊 Stive falando...';
  
  try {
    // Chamar API do ElevenLabs via servidor
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanedText })
    });
    
    if (!response.ok) {
      throw new Error('Erro na resposta do servidor');
    }
    
    const data = await response.json();
    
    // Converter base64 para blob
    const audioBlob = base64ToBlob(data.audio, 'audio/mp3');
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const audio = new Audio(audioUrl);
    await audio.play();
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      isSpeaking = false;
      status.textContent = '';
    };
    
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      isSpeaking = false;
      status.textContent = '';
      console.error('Erro ao reproduzir áudio');
    };
    
  } catch (error) {
    console.error('Erro no TTS:', error);
    isSpeaking = false;
    status.textContent = '';
  }
}

// Helper: converte base64 para Blob
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

// Enviar mensagem
async function send(msg = null) {
    const text = msg || input.value.trim();
    if (!text) return;
    
    if (!msg) {
        addMsg(text, true);
        input.value = '';
    }
    
    status.textContent = '🤔 Pensando...';
    
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await res.json();
        
        if (data.response) {
            addMsg(data.response);
            speak(data.response);
        } else {
            throw new Error('Erro na resposta');
        }
        
        status.textContent = '';
        
    } catch (err) {
        console.error(err);
        const errorMsg = 'Deu ruim, tenta de novo!';
        addMsg(errorMsg);
        speak(errorMsg);
        status.textContent = '';
    }
}

// Microfone - SOLUÇÃO REAL para iOS/iPad
function toggleMic() {
    if (!recognition) {
        alert('⚠️ MICROFONE NÃO DISPONÍVEL!\n\n❌ Chrome no iPad NÃO SUPORTA reconhecimento de voz.\n\n✅ Use SAFARI no iPad!\n\n📱 Certifique-se que a SIRI está ativada em Ajustes.');
        return;
    }
    
    if (isListening) {
        recognition.stop();
        if (recognitionTimeout) {
            clearTimeout(recognitionTimeout);
            recognitionTimeout = null;
        }
        return;
    }
    
    // NO iOS/Safari, NÃO precisa getUserMedia - só iniciar direto
    if (isIOS || isSafari) {
        console.log('📱 iOS/Safari: iniciando reconhecimento direto');
        startRecognition();
    } else {
        // Outros navegadores: pedir permissão primeiro
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    console.log('✅ Permissão concedida!');
                    micPermissionGranted = true;
                    startRecognition();
                })
                .catch((err) => {
                    console.error('❌ Permissão negada:', err);
                    status.textContent = '🎤 PERMITA o microfone!';
                    
                    setTimeout(() => {
                        alert('🔒 PERMISSÃO NEGADA!\n\n1. Clique no ícone de permissões na barra de URL\n2. Permita o Microfone\n3. Recarregue a página\n4. Tente novamente');
                    }, 300);
                });
        } else {
            startRecognition();
        }
    }
}

function startRecognition() {
    try {
        // Limpar estado anterior
        if (recognitionTimeout) {
            clearTimeout(recognitionTimeout);
        }
        
        recognition.start();
        isListening = true;
        micBtn.classList.add('listening');
        status.textContent = '🎤 FALE AGORA!';
        
        // Timeout maior para iOS (15 segundos)
        const timeoutDuration = (isIOS || isSafari) ? 15000 : 10000;
        recognitionTimeout = setTimeout(() => {
            if (isListening) {
                console.log('⏱️ Timeout - parando reconhecimento');
                recognition.stop();
                status.textContent = '⏱️ Tempo esgotado! Clique no 🎤 novamente.';
                setTimeout(() => {
                    status.textContent = '';
                }, 3000);
            }
        }, timeoutDuration);
        
        console.log('✅ Microfone ativado - fale agora!');
    } catch (error) {
        console.error('❌ Erro ao iniciar:', error);
        
        // Tratamento especial para iOS
        if (error.message && error.message.includes('not-allowed')) {
            status.textContent = '🔒 Permissão negada!';
            if (isIOS || isSafari) {
                setTimeout(() => {
                    alert('📱 SIRI DESATIVADA?\n\nPara usar o microfone no Safari:\n\n1. Vá em AJUSTES do iPad\n2. SIRI E BUSCA\n3. ATIVE a Siri\n4. Volte e tente novamente\n\n⚠️ Siri PRECISA estar ativa!');
                }, 500);
            }
        } else {
            status.textContent = '⚠️ Erro! Tente novamente.';
        }
        
        isListening = false;
        micBtn.classList.remove('listening');
    }
}

if (recognition) {
    recognition.onstart = () => {
        console.log('🎤 Reconhecimento iniciado');
        status.textContent = '🎤 Pode falar agora!';
    };
    
    recognition.onresult = (e) => {
        if (recognitionTimeout) {
            clearTimeout(recognitionTimeout);
            recognitionTimeout = null;
        }
        
        // Pegar TODAS as alternativas e escolher a melhor
        let text = '';
        let confidence = 0;
        const alternatives = [];
        
        console.log('📊 Resultados recebidos:', e.results.length);
        
        for (let i = 0; i < e.results.length; i++) {
            const result = e.results[i];
            console.log(`Resultado ${i} - isFinal:`, result.isFinal);
            
            if (result.isFinal || e.results.length === 1) {
                // Pegar todas alternativas
                for (let j = 0; j < result.length; j++) {
                    const alt = result[j];
                    alternatives.push({
                        text: alt.transcript,
                        confidence: alt.confidence
                    });
                    
                    if (alt.confidence > confidence) {
                        text = alt.transcript;
                        confidence = alt.confidence;
                    }
                }
            }
        }
        
        // Fallback: pegar última alternativa se não tiver final
        if (!text && e.results.length > 0) {
            const lastResult = e.results[e.results.length - 1];
            text = lastResult[0].transcript;
            confidence = lastResult[0].confidence;
        }
        
        console.log('✅ Texto escolhido:', text);
        console.log('📈 Confiança:', confidence);
        console.log('🔄 Alternativas:', alternatives);
        
        if (text) {
            // Limpar e mostrar texto
            text = text.trim();
            input.value = text;
            addMsg(text, true);
            send(text);
            status.textContent = '✅ Entendi!';
        } else {
            status.textContent = '❌ Não entendi! Tenta de novo.';
        }
        
        // Parar reconhecimento
        setTimeout(() => {
            if (isListening) {
                recognition.stop();
            }
        }, 100);
    };
    
    recognition.onerror = (e) => {
        console.error('❌ Erro no microfone:', e.error);
        
        if (recognitionTimeout) {
            clearTimeout(recognitionTimeout);
            recognitionTimeout = null;
        }
        
        isListening = false;
        micBtn.classList.remove('listening');
        
        let msg = 'Erro no microfone';
        let showAlert = false;
        
        if (e.error === 'no-speech') {
            msg = '🔇 Não ouvi nada! FALE MAIS ALTO!';
        } else if (e.error === 'not-allowed' || e.error === 'permission-denied') {
            msg = '🔒 Permissão NEGADA!';
            showAlert = true;
            
            setTimeout(() => {
                if (isIOS || isSafari) {
                    alert('📱 SAFARI iPad - SIRI PRECISA ESTAR ATIVA!\n\n✅ SOLUÇÃO:\n\n1. Vá em AJUSTES do iPad\n2. SIRI E BUSCA\n3. ATIVE "Ouvir Ei Siri"\n4. ATIVE "Pressionar botão lateral para Siri"\n5. Volte e clique no "aA" na barra\n6. Permita MICROFONE\n7. Recarregue a página');
                } else {
                    const ua = navigator.userAgent.toLowerCase();
                    const isChrome = ua.includes('chrome') && !ua.includes('edg');
                    
                    if (isChrome) {
                        alert('❌ CHROME iPad NÃO SUPORTA microfone!\n\n✅ Use SAFARI!\n\nChrome no iOS não tem Web Speech API.');
                    } else {
                        alert('🔒 PERMISSÃO NEGADA!\n\n1. Permita microfone nas configurações\n2. Recarregue a página');
                    }
                }
            }, 300);
        } else if (e.error === 'aborted') {
            msg = '🛑 Cancelado';
        } else if (e.error === 'audio-capture') {
            msg = '🎤 Microfone não disponível!';
            showAlert = true;
            setTimeout(() => {
                alert('⚠️ Verifique:\n\n1. Microfone conectado?\n2. Outro app usando microfone?\n3. Permissões do navegador?');
            }, 300);
        } else if (e.error === 'network') {
            msg = '📡 Sem conexão! Verifique internet.';
        }
        
        status.textContent = msg;
        setTimeout(() => {
            if (!status.textContent.includes('🔊')) {
                status.textContent = '';
            }
        }, showAlert ? 6000 : 4000);
    };
    
    recognition.onend = () => {
        if (recognitionTimeout) {
            clearTimeout(recognitionTimeout);
            recognitionTimeout = null;
        }
        
        isListening = false;
        micBtn.classList.remove('listening');
        console.log('🎤 Microfone desligado');
        
        if (!status.textContent.includes('🔊') && !status.textContent.includes('⚠️') && !status.textContent.includes('🤔')) {
            status.textContent = '';
        }
    };
}

// Event listeners
sendBtn.addEventListener('click', () => send());
micBtn.addEventListener('click', toggleMic);

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') send();
});

cards.forEach(card => {
    card.addEventListener('click', () => {
        const q = card.dataset.q;
        addMsg(q, true);
        send(q);
    });
});

// Navegação entre Splash e App
enterAppBtn.addEventListener('click', () => {
    splash.style.display = 'none';
    mainApp.style.display = 'flex';
    
    // Mensagem de boas vindas
    setTimeout(() => {
        speak('Fala, Heitor! Sou o Steve. Manda qualquer pergunta sobre Minecraft aí!');
    }, 500);
});

backToVideoBtn.addEventListener('click', () => {
    mainApp.style.display = 'none';
    splash.style.display = 'flex';
    splashVideo.currentTime = 0;
    splashVideo.play();
});

// Inicialização
window.addEventListener('load', () => {
    console.log('🎮 Steve Bot carregado!');
    console.log('🎤 Voz: ElevenLabs - Steve-nene (Customizada)');
    
    // Detectar Chrome no iOS e mostrar aviso
    const browserWarning = document.getElementById('browserWarning');
    if (browserWarning) {
        const isChromeIOS = /CriOS/.test(navigator.userAgent) || (/Chrome/.test(navigator.userAgent) && isIOS);
        if (isChromeIOS) {
            browserWarning.style.display = 'block';
        }
    }
    
    if (!recognition) {
        status.textContent = '⚠️ Use Safari para microfone funcionar';
    }
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (recognition) recognition.stop();
});
