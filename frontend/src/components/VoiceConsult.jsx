import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './VoiceConsult.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Moved outside component — stable references, no deps issues
const LANGUAGES = [
    { code: 'hi-IN', display: 'हिंदी', name: 'Hindi', api: 'hi', flag: '🇮🇳' },
    { code: 'mr-IN', display: 'मराठी', name: 'Marathi', api: 'mr', flag: '🌾' },
    { code: 'gu-IN', display: 'ગુજરાતી', name: 'Gujarati', api: 'gu', flag: '🌻' },
    { code: 'ta-IN', display: 'தமிழ்', name: 'Tamil', api: 'ta', flag: '🌴' },
    { code: 'te-IN', display: 'తెలుగు', name: 'Telugu', api: 'te', flag: '🌿' },
    { code: 'bn-IN', display: 'বাংলা', name: 'Bengali', api: 'bn', flag: '🐟' },
    { code: 'kn-IN', display: 'ಕನ್ನಡ', name: 'Kannada', api: 'kn', flag: '🌺' },
    { code: 'ml-IN', display: 'മലയാളം', name: 'Malayalam', api: 'ml', flag: '🥥' },
    { code: 'pa-IN', display: 'ਪੰਜਾਬੀ', name: 'Punjabi', api: 'pa', flag: '🌾' },
    { code: 'en-IN', display: 'English', name: 'English', api: 'en', flag: '🔤' },
];

const CALL_STATE = {
    IDLE: 'idle',
    LISTENING: 'listening',
    PROCESSING: 'processing',
    SPEAKING: 'speaking',
    ERROR: 'error',
};

// getSpeechRecognition is stable — defined once, outside render cycle
const getSpeechRecognition = () => window.SpeechRecognition || window.webkitSpeechRecognition;

// Animated sound wave bars
const Waveform = ({ active, speaking }) => (
    <div className={`waveform ${active ? 'active' : ''} ${speaking ? 'speaking' : ''}`}>
        {[...Array(9)].map((_, i) => (
            <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
    </div>
);

export default function VoiceConsult() {
    const [isOpen, setIsOpen] = useState(false);
    const [callState, setCallState] = useState(CALL_STATE.IDLE);
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const [callDuration, setCallDuration] = useState(0);
    const [conversationHistory, setConversationHistory] = useState([]);

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const timerRef = useRef(null);
    const callStartRef = useRef(null);
    // Stable refs for things used inside callbacks to avoid stale closures
    const selectedLangRef = useRef(selectedLang);
    const sendToGeminiRef = useRef(null);

    useEffect(() => { selectedLangRef.current = selectedLang; }, [selectedLang]);

    // Call duration timer
    useEffect(() => {
        if (
            callState === CALL_STATE.LISTENING ||
            callState === CALL_STATE.PROCESSING ||
            callState === CALL_STATE.SPEAKING
        ) {
            if (!callStartRef.current) callStartRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setCallDuration(Math.floor((Date.now() - callStartRef.current) / 1000));
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            if (callState === CALL_STATE.IDLE) {
                callStartRef.current = null;
                setCallDuration(0);
            }
        }
        return () => clearInterval(timerRef.current);
    }, [callState]);

    const conversationRef = useRef(null);

    // Auto-scroll to bottom of conversation
    useEffect(() => {
        if (conversationRef.current) {
            conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
        }
    }, [conversationHistory, transcript]);

    const formatDuration = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const speakResponse = useCallback((text, langCode) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = langCode;
        utter.rate = 0.92;
        utter.pitch = 1.05;
        const voices = synthRef.current.getVoices();
        const match = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
        if (match) utter.voice = match;
        utter.onstart = () => setCallState(CALL_STATE.SPEAKING);
        utter.onend = () => setCallState(CALL_STATE.IDLE);
        utter.onerror = () => setCallState(CALL_STATE.IDLE);
        setCallState(CALL_STATE.SPEAKING);
        synthRef.current.speak(utter);
    }, []);

    const sendToGemini = useCallback(async (query) => {
        setCallState(CALL_STATE.PROCESSING);
        setTranscript(query);

        const storedLocation = localStorage.getItem('ks_location');
        const loc = storedLocation ? JSON.parse(storedLocation) : null;
        const context = loc ? {
            location: `${loc.district || ''}, ${loc.state || ''}`,
            season: new Date().getMonth() >= 4 && new Date().getMonth() <= 9 ? 'Kharif' : 'Rabi'
        } : null;

        const lang = selectedLangRef.current;
        try {
            const res = await axios.post(`${API_BASE}/api/voice-consult`, {
                query,
                language: lang.api,
                context
            });
            const response = res.data.response;
            setConversationHistory(prev => [
                ...prev,
                { role: 'farmer', text: query },
                { role: 'ai', text: response }
            ]);
            speakResponse(response, lang.code);
        } catch (err) {
            const errMsg = err.response?.data?.detail || 'Connection failed. Please check your internet.';
            setError(errMsg);
            setCallState(CALL_STATE.IDLE);
        }
    }, [speakResponse]);

    useEffect(() => { sendToGeminiRef.current = sendToGemini; }, [sendToGemini]);

    const startListening = useCallback(() => {
        const SpeechRecognition = getSpeechRecognition();
        if (!SpeechRecognition) {
            setError('Voice recognition not supported in this browser.');
            return;
        }
        setError('');
        setTranscript('');
        setCallState(CALL_STATE.LISTENING);

        const recognition = new SpeechRecognition();
        recognition.lang = selectedLangRef.current.code;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        let lastFinalTranscript = '';

        recognition.onresult = (e) => {
            let interim = '';
            let final = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) final += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            if (final) lastFinalTranscript = final;
            setTranscript(final || interim);
        };

        recognition.onspeechend = () => recognition.stop();

        recognition.onend = async () => {
            const query = lastFinalTranscript.trim();
            if (!query) {
                setCallState(CALL_STATE.IDLE);
                return;
            }
            await sendToGeminiRef.current(query);
        };

        recognition.onerror = (e) => {
            if (e.error !== 'no-speech') {
                setError(`Microphone error: ${e.error}`);
            }
            setCallState(CALL_STATE.IDLE);
        };

        recognition.start();
    }, []);

    const stopAll = useCallback(() => {
        recognitionRef.current?.stop();
        synthRef.current?.cancel();
        setCallState(CALL_STATE.IDLE);
    }, []);

    const handleEndCall = useCallback(() => {
        recognitionRef.current?.stop();
        synthRef.current?.cancel();
        setCallState(CALL_STATE.IDLE);
        setIsOpen(false);
        setConversationHistory([]);
        setTranscript('');
        setError('');
    }, []);

    const handleManualSubmit = useCallback((e) => {
        e.preventDefault();
        const txt = e.target.elements.manualQuery?.value?.trim();
        if (txt) {
            e.target.reset();
            sendToGeminiRef.current(txt);
        }
    }, []);

    const callStateLabel = {
        [CALL_STATE.IDLE]: 'Tap mic to speak',
        [CALL_STATE.LISTENING]: 'Listening to you...',
        [CALL_STATE.PROCESSING]: 'Analyzing your request...',
        [CALL_STATE.SPEAKING]: 'KrishiMitra is speaking...',
        [CALL_STATE.ERROR]: 'Connection Issue',
    };

    return (
        <>
            <button
                className={`voice-fab ${isOpen ? 'fab-open' : ''}`}
                onClick={() => setIsOpen(o => !o)}
            >
                <div className="fab-icon">{isOpen ? '✕' : '📞'}</div>
                {!isOpen && <div className="fab-pulse" />}
                {!isOpen && <div className="fab-label">Call AI</div>}
            </button>

            {isOpen && (
                <div className="voice-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleEndCall()}>
                    <div className="voice-modal">
                        {/* Compact Header */}
                        <div className="vm-header">
                            <div className="avatar-ring">🌿</div>
                            <div className="vm-identity">
                                <h3 className="vm-name">KrishiSense AI</h3>
                                <p className="vm-subtitle">Personal Farming Advisor</p>
                            </div>
                            <div className="vm-status-badge">Live</div>
                        </div>

                        {/* Integrated Status Bar */}
                        <div className="vm-status-bar">
                            <div className="vm-duration">
                                {callDuration > 0 ? formatDuration(callDuration) : '00:00'}
                            </div>
                            <select
                                className="lang-dropdown"
                                value={selectedLang.code}
                                onChange={(e) => {
                                    const lang = LANGUAGES.find(l => l.code === e.target.value);
                                    if (lang) setSelectedLang(lang);
                                }}
                            >
                                {LANGUAGES.map(lang => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.flag} {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Central Conversation Window */}
                        <div className="vm-conversation" ref={conversationRef}>
                            {conversationHistory.length === 0 && !transcript && (
                                <div className="vm-welcome">
                                    <p>Welcome! Speak naturally or type below for farming advice.</p>
                                </div>
                            )}
                            {conversationHistory.map((msg, i) => (
                                <div key={i} className={`chat-bubble ${msg.role}`}>
                                    <div className="bubble-text">{msg.text}</div>
                                </div>
                            ))}
                            {transcript && callState === CALL_STATE.LISTENING && (
                                <div className="chat-bubble farmer">
                                    <div className="bubble-text">{transcript}|</div>
                                </div>
                            )}
                            {callState === CALL_STATE.PROCESSING && (
                                <div className="chat-bubble ai typing">
                                    <div className="typing-dots"><span /><span /><span /></div>
                                </div>
                            )}
                        </div>

                        {/* Action Center (Text Input + Controls) */}
                        <div className="vm-action-center">
                            <div className="vm-waveform-area">
                                <Waveform
                                    active={callState === CALL_STATE.LISTENING}
                                    speaking={callState === CALL_STATE.SPEAKING}
                                />
                                <div className={`vm-state-label state-${callState}`}>
                                    {callStateLabel[callState]}
                                </div>
                            </div>

                            <form className="vm-text-input" onSubmit={handleManualSubmit}>
                                <input
                                    name="manualQuery"
                                    type="text"
                                    placeholder={`Type in ${selectedLang.name}...`}
                                    disabled={callState === CALL_STATE.PROCESSING || callState === CALL_STATE.SPEAKING}
                                />
                                <button type="submit" disabled={callState === CALL_STATE.PROCESSING}>➤</button>
                            </form>

                            <div className="vm-controls">
                                <button
                                    className={`ctrl-btn mike-btn ${callState === CALL_STATE.LISTENING ? 'recording' : ''}`}
                                    onClick={callState === CALL_STATE.IDLE ? startListening : stopAll}
                                    disabled={callState === CALL_STATE.PROCESSING}
                                >
                                    {callState === CALL_STATE.LISTENING ? '⏹' : '🎙️'}
                                </button>
                                <button className="ctrl-btn end-btn" onClick={handleEndCall}>📵</button>
                            </div>
                        </div>

                        <div className="vm-footer">Powered by Gemini AI</div>
                    </div>
                </div>
            )}
        </>
    );
}
