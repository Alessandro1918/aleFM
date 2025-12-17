//Read an audio file from a Dropbox folder, return it's metadata

import * as mm from "music-metadata-browser"

type FileProps = {
  fileId: string,     //wu2vrgh1q7pcpmx 
  fileName: string    //ACDC - Dirty Deeds Done Dirt Cheap
}

export async function getMetadata({ fileId, fileName }: FileProps) {

  const fileNameEncoded = fileName.replace(/ /g, "%20")
  const metadata = await mm.fetchFromUrl(`https://dl.dropboxusercontent.com/s/${fileId}/${fileNameEncoded}`)
  console.log("From metadata:", metadata.common)

  let albumCover = ''
  if ("picture" in metadata.common) {
    const b64 = Buffer.from(metadata.common.picture![0].data).toString("base64")
    const mimeType = metadata.common.picture![0].format // e.g., image/png
    albumCover = `data:${mimeType};base64,${b64}`
  }

  return {
    title: String(metadata.common.album),
    artist: String(metadata.common.artist),
    year: String(metadata.common.year),
    image: albumCover
  }
}
