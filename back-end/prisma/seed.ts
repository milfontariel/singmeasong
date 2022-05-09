import { prisma } from "../src/database.js";
import { list } from "./utils/list.js";

type VideoObject = {
  name: string;
  videoUrl: string;
};

export async function seed() {
  await prisma.recommendation.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      name: "Hindi Zahra - Beautiful Tango",
      youtubeLink: "https://www.youtube.com/watch?v=2-8n6rTH6Ns",
    },
  });
  list.map(async (video) => {
    await prisma.recommendation.upsert({
      where: { name: video.title },
      update: {},
      create: {
        name: video.title,
        youtubeLink: video.videoUrl,
      },
    });
  });
}

seed()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
