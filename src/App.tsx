import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react';

interface Track {
  id: string;           //"2xplsy2dll8pouy"
  name: string;         //"Alice In Chains - Man In The Box.mp3"
  index: number;        //0
  currentTime: number;  //242.34 (seconds)
}

function App() {

  // **********
  // Constants
  // **********
  
  const [ playlist, setPlaylist] = useState<string[]>([])
  
  const [ track, setTrack ] = useState<Track>({
    id: '',
    name: '',
    index: -1,
    currentTime: 0
  })
  
  //V1
  //let audio = new Audio()
  //const [ audio ] = useState(new Audio())
  //V2
  const audioRef = useRef<HTMLAudioElement>(null)


  // **********
  // useEffects
  // **********
  
  useEffect(() => {
    if (playlist.length === 0) {
      getPlaylist()
    }
  }, [])

  // I can't use addEventListeners here,
  // they call console.log a billion times
  //audio.addEventListener('canplaythrough', () => {...}

  useEffect(() => {

    // I can't use addEventListeners here,
    // they save an instance of the useState vars
    // and don't update those values
    //audio.addEventListener('canplaythrough', () => {...}

    findNextTrack()

  }, [playlist])

  useEffect(() => {
    
    //L1 - 'loadeddata' / 'canplaythrough'
    audioRef.current!.addEventListener('canplaythrough', function L1() {

      audioRef.current!.removeEventListener('canplaythrough', L1) //remove to re-attach later and get the updated useState vars
      
      //V1 - audio
      //audio.currentTime = audio.duration - 5   //n secs before finish
      //audio.play()

      //V2 - audioRef
      //audioRef.current!.currentTime = audioRef.current!.duration - 5   //n secs before finish
      audioRef.current!.currentTime = audioRef.current!.duration * track.currentTime  //proper value
      audioRef.current?.play()
    })

    //L2 - 'ended'
    audioRef.current!.addEventListener('ended', function L2() {
      audioRef.current!.removeEventListener('ended', L2)        //remove to re-attach later and get the updated useState vars
      findNextTrack()
    })

    load()

  }, [track])


  // **********
  // Functions
  // **********
  
  async function getPlaylist() {
    let url = "https://www.dropbox.com/s/ms2oldzgrkuquj4/playlist.txt?dl=0"
    url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
    const response = await fetch(url)
    const lines = await response.text()
    let files = lines.split('\n')		//txt to array
    console.log(`Loaded playlist with ${files.length} tracks`)

    //Shuffles the list once a day
    const day = new Date().getDate()  //yes, it's 'getDate', not 'getDay'
    files = shuffle(files, day)
    //console.log(files)
    setPlaylist(files)
  }

  //Shuffles an array always the same way, if given the same seed
  //https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed
  function shuffle(array:string[], seed:number) {

    function random(seed: number) {
      var x = Math.sin(seed++) * 10000; 
      return x - Math.floor(x);
    }

    let m = array.length
    let t
    let i
    
    // While remains elements to shuffle
    while (m) {

      // Pick a remaining element
      i = Math.floor(random(seed) * m--)

      // And swap it with the current element
      t = array[m]
      array[m] = array[i]
      array[i] = t
      ++seed
    }
    return array
  }

  function getTimeOfDayInPercentage(h: number, m: number, s:number) {
    const currentTime = h * 0.01 + m * 0.0001 + s * 0.000001        //18:00:32 -> 0.180032
    const absoluteTime = 23 * 0.01 + 59 * 0.0001 + 59 * 0.000001    //23:59:59 -> 0.235959
    console.log(`TODAY: ${currentTime} / ${absoluteTime} = ${100 * currentTime / absoluteTime}%`)
                //TODAY: 0.180032 / 0.235959 = 76.29%
    return currentTime / absoluteTime       // 0.7629
  }

  function findNextTrack(){
    //Hardcoded
    //const fileId = "h8278j0vncmdsrp"
    //const filename = "Airbourne - Its All For Rock N Roll.mp3"

    //Programatically
    if (playlist.length > 0) {

      let index, time

      //Get first tack of the playlist
      if (track.index < 0) {

        //Random
        //index = Math.floor(Math.random() * playlist.length)
        //time = 0.75

        //Based on the time of the day
        const NOW = new Date()
        const h = NOW.getHours()
        const m = NOW.getMinutes()
        const s = NOW.getSeconds()
        const timeOfDayInPercentage = getTimeOfDayInPercentage(h, m, s)   //06:00 AM -> 0.25
        const progress = playlist.length * timeOfDayInPercentage          //25% of a 7 tracks list = 1.75
        index = Math.floor(progress)    //1
        time = progress % 1             //0.75

        console.log(`NOW: ${progress}/${playlist.length} - Track: ${index}/${playlist.length} at ${Math.floor(time * 100)}%`)
        //NOW: 1.75/200 - Track: 1/200 at 75%
      }

      //Get next track of the playlist
      else {
        index = track.index + 1
        if (index === playlist.length) {index = 0}
        time = 0
      }

      const [id, name] = playlist[index].split('/')
      const newTrack = {
        id: id, 
        name: name, 
        index: index,
        currentTime: time
      }
      setTrack(newTrack)
    }
  }

  function load() {
    //V1 - audio
    //let url = "https://www.dropbox.com/s/h8278j0vncmdsrp/Airbourne%20-%20Its%20All%20For%20Rock%20N%20Roll.mp3"
    //url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
    //const url = `https://dl.dropboxusercontent.com/s/${track?.id}/${track?.name.replace(/ /g, "%20")}`
    //audio.src = url

    //V2 - audioRef
    audioRef.current?.load()

    console.log(`Playing track ${track.index}: ${track.name}`)
  }


  // **********
  // HTML
  // **********
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Você está ouvindo a &nbsp;
          <a className="App-link" href="https://github.com/Alessandro1918/aleFM" target="_blank">Ale FM</a>
          , a melhor!
        </p>
        
        {/*<Play/>*/}

        {/*<button onClick={findNextTrack(false)}>
          <span>Play!</span>
        </button>*/}

        {/** V1 - No graphic elements */}

        {/** V2 */}
        <audio ref={audioRef} controls>
          <source 
            src={`https://dl.dropboxusercontent.com/s/${track.id}/${track.name.replace(/ /g, "%20")}`}
            type="audio/mp3"
          />
        </audio>

        <div>
          {/*<img 
            className={styles.albumCover} 
            src={`${baseURL}${music.albumCover}`} 
            alt="album cover"
          />*/}
          <p>{track.name}</p>
        </div>

      </header>
    </div>
  );
}

export default App;