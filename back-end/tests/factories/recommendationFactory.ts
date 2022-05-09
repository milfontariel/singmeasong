import { list } from "../../prisma/utils/list.js";

export async function createSong() {
  const song = list[Math.floor(Math.random() * list.length)];

  return {
    name: song.title,
    youtubeLink: song.videoUrl,
  };
}
