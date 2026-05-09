import { useState, useRef, useEffect } from "react";
import image from "../assets/cookie_pixel.svg";
import style from "./style.module.css";
import audio from "../assets/crunch.mp3";

export default function CookieClicker({ setPoints }) {
    const [particles, setParticles] = useState([]);
    const crunchSound = useRef(new Audio(audio));
    const imgRef = useRef(null);

    useEffect(() => {
        const el = imgRef.current;
        if (!el) return;
        const prevent = (e) => e.preventDefault();
        el.addEventListener("touchstart", prevent, { passive: false });
        return () => el.removeEventListener("touchstart", prevent);
    }, []);

    const handleClick = (e) => {
        setPoints();
        crunchSound.current.currentTime = 0;
        crunchSound.current.play();

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