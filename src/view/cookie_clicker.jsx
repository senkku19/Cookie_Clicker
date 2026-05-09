import { useState } from "react";
import Cookie from "../components/Cookie";
import style from "./style.module.css";

export default function CookieClicker() {
    const [points, setPoints] = useState(0);

    return (
        <div className={style.card}>
            <h1 className={style.title}>🍪Cookie Clicker</h1>
            <p className={style.subtitle}>Click the cookie and earn points</p>

            <div className={style.scoreBox}>
                <p className={style.scoreLabel}>Points</p>
                <p className={style.score}>{points}</p>
            </div>

            <Cookie setPoints={() => setPoints((prev) => prev + 1)} />

        </div>
    );
}