export function Play() {
    
    function playAudio() {    
        // V1 - use-sound - react Hook
        //https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/

        // V2 - <audio> tag
        //https://coderrocketfuel.com/article/how-to-play-a-mp3-sound-file-in-react-js
        
        // V3 - Audio Object
        //3.1
        //const url = "https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"
        //const url = "http://streaming.tdiradio.com:8000/house.mp3"
        //let url = "https://www.dropbox.com/s/as2a7f6xw4egv8e/The%20Protomen%20-%20Light%20Up%20The%20Night.mp3"
        //let url = "https://www.dropbox.com/s/2xplsy2dll8pouy/Alice%20In%20Chains%20-%20Man%20In%20The%20Box.mp3"
        //url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        //3.2
        const fileId = "2xplsy2dll8pouy"
        const filename = "Alice In Chains - Man In The Box.mp3".replace(/ /g, "%20")
        const url = `https://dl.dropboxusercontent.com/s/${fileId}/${filename}`

        const audio = new Audio(url)

        audio.play()
        
        console.log(`Playing: ${url}`)
    }

    return(
        <div>
            <button onClick={playAudio}>
                <span>Play Audio</span>
            </button>
        </div>
    )
}