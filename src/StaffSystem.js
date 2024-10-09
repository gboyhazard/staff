import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StaffSystem.css';

const StaffSystem = () => {
    const [staffMembers, setStaffMembers] = useState([]);
    const [presenter, setPresenter] = useState('');
    const [transcript, setTranscript] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [language, setLanguage] = useState('en'); // State to store selected language

    // Language options for translation
    const languages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Spanish' },
        { code: 'fr', label: 'French' },
        { code: 'de', label: 'German' },
        { code: 'pt', label: 'Portuguese' },
    ];

    // Fetch staff members from the backend
    useEffect(() => {
        axios.get('http://localhost:5000/api/staff-members')
            .then(response => setStaffMembers(response.data.map(s => s.name)))
            .catch(err => console.error(err));
    }, []);

    const selectRandomPresenter = () => {
        const randomIndex = Math.floor(Math.random() * staffMembers.length);
        setPresenter(staffMembers[randomIndex]);
    };

    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech Recognition is not supported in your browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setTranscript(transcript);
            translateText(transcript); // Translate the text after recording
        };

        recognition.start();
    };

    // Function to translate text using a placeholder API or library (example with Google Translate API)
    const translateText = async (text) => {
        try {
            const response = await axios.post('https://translation.googleapis.com/language/translate/v2', {
                q: text,
                target: language,
                key: 'YOUR_GOOGLE_TRANSLATE_API_KEY', // Replace with your API key
            });
            setTranslatedText(response.data.data.translations[0].translatedText);
        } catch (error) {
            console.error("Error translating text:", error);
            setTranslatedText("Translation failed. Try again.");
        }
    };

    return (
        <div className="container">
            <h1>Staff Presentation & Translation System</h1>

            {/* Language Selector Dropdown */}
            <div className="language-selector">
                <label htmlFor="language">Choose Language: </label>
                <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            <button className="btn" onClick={selectRandomPresenter}>Select Presenter</button>
            {presenter && <p className="presenter active">Presenter: {presenter}</p>}

            <button className="btn" onClick={startRecording}>Start Recording</button>
            {transcript && <p className="output">Original: {transcript}</p>}
            {translatedText && <p className="output">Translated: {translatedText}</p>}
        </div>
    );
};

export default StaffSystem;
