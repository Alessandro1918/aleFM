//Returns a list of music files
//Ex:
//wu2vrgh1q7pcpmx - ACDC - Dirty Deeds Done Dirt Cheap
//...
//j9evsn81mt5edic - ZZ Top - Sharp Dressed Man

export async function getPlaylist() {
  const playlistUrl = process.env.NEXT_PUBLIC_PLAYLIST_URL!
  const url = playlistUrl.replace("www.dropbox.com", "dl.dropboxusercontent.com")   //make the link a direct download link
  const response = await fetch(url)
  const lines = await response.text()
  let files = lines.split('\n')		//txt to array
  console.log(`Loaded playlist with ${files.length} tracks`)

  //Shuffles the list once a day, using 'day' as seed
  const day = new Date().getDate()  //yes, it's 'getDate', not 'getDay'
  files = shuffle(files, day)
  //console.log(files)
  return files
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
