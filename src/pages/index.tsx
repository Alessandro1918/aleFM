import { useState, useEffect, useRef } from 'react'
import styles from '@/styles/Home.module.css'
import { radioApi } from '../api/radioApi'

interface Track {
  id: string            //"2xplsy2dll8pouy"
  name: string          //"Alice In Chains - Man In The Box"
  index: number         //0
  currentTime: number   //242.34 (seconds)
}

interface Album {
  title: string         //"The Works"
  artist: string        //"Queen"
  year: string          //"1984"
  image: string         //"https://rovimusic.rovicorp.com/image.jpg?c=YD1cN-_cz484qf9RigYGpphUoDg0hsvx4F4sL4oO-nA=&f=2"
  //url: string         //"the-works-mw0000191494"
}

export default function Home() {

  // **********
  // Constants
  // **********
  
  const playlistUrl = "https://www.dropbox.com/s/ms2oldzgrkuquj4/playlist.txt?dl=0"

  const [ playlist, setPlaylist] = useState<string[]>([])
  
  const [ track, setTrack ] = useState<Track>({
    id: '',
    name: '',
    index: -1,
    currentTime: 0
  })

  const [ album, setAlbum ] = useState<Album>({
    title: '',
    artist: '',
    year: '',
    image: ''
  })

  //const [ isLoading, setIsLoading ] = useState(true)
  
  //V1 - Audio Object
  //let audio = new Audio() object
  //const [ audio ] = useState(new Audio())
  //V2 - reference to html audio element
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
    
    //Add function "Listener1" to event "canplaythrough":
    audioRef.current!.addEventListener('canplaythrough', function L1() {

      audioRef.current!.removeEventListener('canplaythrough', L1) //remove to re-attach later and get the updated useState vars
      
      //setIsLoading(false)

      //V1 - Audio obj
      //audio.currentTime = audio.duration - 5    //dev: set track 'n' secs before finish
      //audio.play()

      //V2 - audioRef
      //audioRef.current!.currentTime = audioRef.current!.duration - 5                //dev: set track 'n' secs before finish
      audioRef.current!.currentTime = audioRef.current!.duration * track.currentTime  //prod
      audioRef.current?.play()
    })

    //Add function "Listener2" to event "ended":
    audioRef.current!.addEventListener('ended', function L2() {
      
      audioRef.current!.removeEventListener('ended', L2)        //remove to re-attach later and get the updated useState vars
      
      //setIsLoading(true)
      
      findNextTrack()
    })

    load()

    getAlbumData()

  }, [track])



  // **********
  // Functions
  // **********
  
  async function getPlaylist() {
    let url = playlistUrl
    url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')   //make the link a direct download link
    const response = await fetch(url)
    const lines = await response.text()
    let files = lines.split('\n')		//txt to array
    console.log(`Loaded playlist with ${files.length} tracks`)

    //Shuffles the list once a day, using 'day' as seed
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

  //06:00 AM -> 25% of the day passed
  //06:00 PM -> 75% of the day passed
  function getTimeOfDayInPercentage(h: number, m: number, s:number) {
    const currentTime = h * 0.01 + m * 100/60 * 0.0001 + s * 100/60 * 0.000001    //18:00:30 -> 0.180050
    const maxTime = 23 * 0.01 + 59 * 100/60 * 0.0001 + 59 * 100/60 * 0.000001     //23:59:59 -> 0.239999 -> the "100/60" normalizes the 60 min / hour into a 1.00 hour
    console.log(`TODAY: ${currentTime} / ${maxTime} = ${100 * currentTime / maxTime}%`)
                //TODAY: 0.180050 / 0.239999 = 75.02%
    return currentTime / maxTime          // 0.7502
  }

  function findNextTrack(){

    if (playlist.length > 0) {

      let index, time

      //Get first track of the playlist
      if (track.index < 0) {

        //Dev: get random track between 0 and n-1, passed it's half time
        //index = Math.floor(Math.random() * playlist.length)
        //time = 0.75

        //Prod: Based on the time of the day
        const NOW = new Date()
        const h = NOW.getHours()
        const m = NOW.getMinutes()
        const s = NOW.getSeconds()
        const timeOfDayInPercentage = getTimeOfDayInPercentage(h, m, s)   //06:00 AM -> 0.25
        const progress = playlist.length * timeOfDayInPercentage          //25% of a 7 tracks list = 1.75
        index = Math.floor(progress)    //1
        time = progress % 1             //0.75

        console.log(`NOW: ${progress}/${playlist.length} - Track: ${index}/${playlist.length} at ${Math.floor(time * 100)}%`)
        //NOW: 1.75 / 7 - Track: 1/7 at 75%
      }

      //Get next track of the playlist
      else {
        index = track.index + 1
        if (index === playlist.length) {index = 0}
        time = 0
      }

      //playlist: "h8278j0vncmdsrp - Airbourne - Its All For Rock N Roll", "..."
      //const [id, name] = playlist[15].split('/')
      const [id, artist, title] = playlist[index].split(' - ')
      const newTrack = {
        id: id, 
        name: artist + " - " + title,
        index: index,
        currentTime: time
      }
      setTrack(newTrack)
    }
  }

  function load() {

    if (track.name) {

      //V1 - dev
      //let url = "https://www.dropbox.com/s/h8278j0vncmdsrp/Airbourne%20-%20Its%20All%20For%20Rock%20N%20Roll.mp3"
      //url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      //audio.src = url
      //V1 - prod
      //const url = `https://dl.dropboxusercontent.com/s/${track?.id}/${track?.name.replace(/ /g, "%20")}`
      //audio.src = url

      //V2
      audioRef.current?.load()

      console.log(`Loading track ${track.index}: ${track.name}`)
    }
  }

  //Query API for album data
  async function getAlbumData() {
    setAlbum({title: '', artist: '', year: '', image: ''})
    if (track.name) {
      const [ artist, title ] = track.name.split(' - ')
      let { data } = await radioApi.get(
        'getAlbums', {
          params: {
            artist: artist, 
            trackTitle: title.replace('\r', '')   // \r: "carriage return"
          }
        }
      )
      console.log(data[0]) 
      if (data[0]) {
        setAlbum({
          artist: data[0].artist,
          image: data[0].image,
          title: data[0].title,
          year: data[0].year
        })
      }
    }
  }


  
  // **********
  // HTML
  // **********
  
  return (
    <div className={styles.main}>

      <p>
        Você está ouvindo a&nbsp;
        <a className={styles.link} href="https://github.com/Alessandro1918/aleFM" target="_blank">Ale FM</a>
        , a melhor!
      </p>

      {album.image == '' || album.image.includes('no_image')
        ? <img src='/logo.svg' className={styles.defaultAlbumArt} alt="logo" />
        : <img src={album.image} className={styles.albumArt} alt="album-art" />  
      }

      {track.name
        ? <p>{track.name}</p>
        : <p>Carregando...</p>
      }

      {album.title && album.year
        && <p>{`do álbum: ${album.title} (${album.year})`}</p>
      }

      {/** V1 - No graphic elements */}
      {/** V2 */}
      <p>(Clique em ▶ para iniciar a reprodução)</p>
      
      <audio ref={audioRef} controls>
        <source 
          src={`https://dl.dropboxusercontent.com/s/${track.id}/${track.name.replace(/ /g, "%20")}`}
          type="audio/mp3"
        />
      </audio>

    </div>
  );
}
