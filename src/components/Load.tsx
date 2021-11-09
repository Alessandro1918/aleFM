import styles from '../styles/components/Load.module.css'
import { useState, useEffect, useRef } from 'react'

import data from '../data.json'

interface Music {
    artist: string;
    title: string;
    storageID: string;
    albumCover: string;
}

export function Load() {

    const [music, setMusic] = useState<Music>()

    const baseURL = "https://drive.google.com/uc?export=view&id="

    const audioRef = useRef<HTMLAudioElement>(null)


    function loadNewMusic() {
        //const storageID = "https://drive.google.com/uc?export=view&id=1TqzRk4iALhBcozLRZG32KF2tsIhJWdB8"
        //const albumCover = "https://drive.google.com/uc?export=view&id=1BZvv8PYS-TF1sCY79WIUGX1-LaLt6Hs6"
        const randomIndex = Math.floor(Math.random() * data.length)
        const file = data[randomIndex]
        console.log('file:', file)
        //console.log('albumCover:', `${baseURL}${file.albumCover}`)
        setMusic(file)
    }

    //const handleLoadButton = async () => {
    function handleLoadButton() {
        loadNewMusic()
    }

    useEffect(() => {
        //useState already replaced audio src when new music is loaded.
        //Now, we need to tell <audio> that.
        audioRef.current?.load()
        audioRef.current?.click()
    }, [music])    /* Do this code every time these vars change */

    return (
        <div>
            <button onClick={handleLoadButton}>
                <span>Load file</span>
            </button>
            {music && (
                <div>
                    <img className={styles.albumCover} src={`${baseURL}${music.albumCover}`} alt="album cover"/>
                    <p>{music.artist} - {music.title}</p>
                    <audio ref={audioRef}  controls>
                        <source 
                            src={`${baseURL}${music.storageID}`}
                            type="audio/mp3"
                        />
                    </audio>
                </div>
            )}
        </div>
    )
}