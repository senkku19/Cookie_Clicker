import { useState, useRef, useEffect } from "react";
import image from "../assets/cookie_pixel.svg";
import style from "./style.module.css";
import audio from "../assets/crunch.mp3";

export default function CookieClicker({ setPoints }) {
    const [particles, setParticles] = useState([]);
    const imgRef = useRef(null);

    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);

    useEffect(() => {
        const initAudio = async () => {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            const context = new AudioContextClass();
            audioContextRef.current = context;

            const response = await fetch(audio);
            const arrayBuffer = await response.arrayBuffer();

            audioBufferRef.current =
                await context.decodeAudioData(arrayBuffer);
        };

        initAudio();
    }, []);

    const playCrunch = () => {
        if (!audioContextRef.current || !audioBufferRef.current) return;

        if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
        }

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;

        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = 0.4;

        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        source.start(0);
    };

        useEffect(() => {
            const el = imgRef.current;
            if(!el) return;
            const prevent = (e) => e.preventDefault();
            el.addEventListener("touchstart", prevent, { passive: false });
            return () => el.removeEventListener("touchstart", prevent);
        }, [])

        const handleClick = (e) => {
            setPoints();
            playCrunch();

            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now();

            setParticles((prev) => [...prev, { id, x, y }]);

            setTimeout(() => {
                setParticles((prev) => prev.filter((p) => p.id !== id));
            }, 800);
        };

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <img
                ref={imgRef}
                src={image}
                role="button"
                alt="Cookie"
                draggable="false"
                className={style.cookie}
                onPointerDown={handleClick}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
            />
            {particles.map((p) => (
                <span
                    key={p.id}
                    className={style.plusOne}
                    style={{ left: p.x, top: p.y }}
                >
                    +1
                </span>
            ))}
        </div>
    );
}