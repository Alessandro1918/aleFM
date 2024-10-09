//Returns the next track of the playlist to be played

export function getNextTrack(playlist: string[], currentTrackIndex: number) {

  let index, time

  //Get first track of the playlist
  if (currentTrackIndex < 0) {

    //Dev: get random track between 0 and n-1, with progress = 50%
    //index = Math.floor(Math.random() * playlist.length)
    //time = 0.75

    //Prod: get track between 0 and n-1, and progress, based on the time of the day
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
    index = currentTrackIndex + 1
    if (index === playlist.length) {index = 0}
    time = 0
  }

  //playlist: ["...", "h8278j0vncmdsrp - Airbourne - Its All For Rock N Roll", "..."]
  const [id, artist, title] = playlist[index].split(" - ")

  return {
    id: id, 
    name: artist + " - " + title,
    index: index,
    currentTime: time
  }
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
