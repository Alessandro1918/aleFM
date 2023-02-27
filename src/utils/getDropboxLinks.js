// 1. Get a Dropbox API endpoint that returns the url's file with the /s/ param (shared)
// Ex:	https://www.dropbox.com/s/2xplsy2dll8pouy/Alice%20In%20Chains%20-%20Man%20In%20The%20Box.mp3?dl=0
// https://www.dropbox.com/developers/documentation/http/documentation#sharing-create_shared_link_with_settings

// 2. Enable my Dropbox App (MyRadioApp) with this endpoint's scope permission (ex: sharing.read)
// https://www.dropbox.com/developers/apps

// 3. On the Dropbox API Explorer, get a token for this requisition (expiration: 4h?). Copy-paste it to DROPBOX_TOKEN const
// https://dropbox.github.io/dropbox-api-v2-explorer/#sharing_create_shared_link_with_settings

// 4. List every filename from dropbox/music in a files.txt
// cd dropbox/music
// ls *.mp3 > files.txt
// Alice In Chains - Man In The Box.mp3
// ...

// 5: Run the script: $ node ./src/utils/getDropboxLinks.js
// The script will loop for every line of this files.txt, making that Dropbox request, and adding the response "dropboxFileID - filenameWithout.mp3" in a newPlaylist.txt file
// 2xplsy2dll8pouy - Alice In Chains - Man In The Box
// ...

// 6. When finished, update the Dropbox playlist.txt file with the newPlaylist.txt file content (don't let empty lines at the end of the file)



const fs = require('fs')
const axios = require('axios')

const dropboxApi = axios.create({
    baseURL: "https://api.dropboxapi.com/2"
})
const DROPBOX_TOKEN = "..."
const FILES = "./src/utils/files.txt"
const NEW_PLAYLIST = "./src/utils/newPlaylist.txt"


//input: ACDC - Thunderstruck.mp3
//output: 0br63l7o6o3yq8r - ACDC - Thunderstruck
async function getDropboxData(file) {

  let url = ''

  try {
    const result = await dropboxApi.post(
      "/sharing/create_shared_link_with_settings", 
      {
        path: "/Music/" + file
      },
      {
        headers: {
          Authorization: "Bearer " + DROPBOX_TOKEN
        }
      }
    )
    //link newly created:
    url = result.data["url"]
  } catch (error) {
    //link already existed:
    url = error["response"]["data"]["error"]["shared_link_already_exists"]["metadata"]["url"]
  }

  const id = url.split("/")[4]
  return `${id} - ${file.replace('.mp3', '')}`
}


fs
  .readFileSync(FILES)
  .toString()
  .split("\n")
  .forEach(function(line, index, arr) {
    if (index === arr.length - 1 && line === "") { return; }
    // console.log(index + 1 + " " + line)

    setTimeout(() => {
      getDropboxData(line).then(data => {
        console.log(`${index + 1}/${arr.length}: ${data.replace('.mp3', '')}`)  //1/3: 171yejifi1olss5 - 2 Unlimited - Get Ready For This

        fs.appendFile(NEW_PLAYLIST, data + "\n", err => {
          if (err) {
            console.error(err);
          }
        });
      })
    }, index * 1100)  //ms
  })