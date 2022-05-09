import supertest from "supertest";
import { seed } from "../../prisma/seed";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import { createSong } from "../factories/recommendationFactory";

describe("GET AND INSERT A RECOMMENDATION", () => {
  it("should return 201 and successfully insert a recommendation", async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    const song = await createSong();

    const res = await supertest(app).post("/recommendations").send(song);
    expect(res.status).toEqual(201);

    const get = await prisma.recommendation.findUnique({
      where: {
        name: song.name,
      },
    });

    expect(get).not.toBeNull();
  });
});

describe("", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations CASCADE`;
    seed();
  });
  describe("GET /recommendations", () => {
    it("should return 200 and get a list of recommendations", async () => {
      const res = await supertest(app).get("/recommendations");
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should return 200 and get a recommendation", async () => {
      const res = await supertest(app).get("/recommendations/random");
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("id");
    });

    it("should return status 200 and an object given id 5", async () => {
      const res = await supertest(app).get("/recommendations/5");
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("name");
      expect(res.body.name).toBe("Hindi Zahra - Beautiful Tango");
    });
  });

  describe("POST /upvote", () => {
    it("should return an orderly list in a decreasing manner according to the 'likes'", async () => {
      const { body } = await supertest(app).get("/recommendations/top/10");
      expect(body).toHaveLength(10);
      const firstRecommendation = body[0];
      await supertest(app).post(
        `/recommendations/${firstRecommendation.id}/upvote`
      );

      const newCandidate = body[4];

      await supertest(app).post(`/recommendations/${newCandidate.id}/upvote`);
      await supertest(app).post(`/recommendations/${newCandidate.id}/upvote`);

      const res = await supertest(app).get("/recommendations/top/10");
      expect(res.body[0].id).toEqual(newCandidate.id);
      expect(res.body[1].id).toEqual(firstRecommendation.id);
    });
  });

  describe("POST /downvote", () => {
    it("should return an orderly list in a decreasing manner according to the 'likes'", async () => {
      const { body } = await supertest(app).get("/recommendations/top/10");
      expect(body).toHaveLength(10);
      const firstRecommendation = body[0];
      await supertest(app).post(
        `/recommendations/${firstRecommendation.id}/upvote`
      );

      const newCandidate = body[4];

      await supertest(app).post(`/recommendations/${newCandidate.id}/upvote`);
      await supertest(app).post(`/recommendations/${newCandidate.id}/upvote`);

      await supertest(app).post(`/recommendations/${newCandidate.id}/downvote`);
      await supertest(app).post(`/recommendations/${newCandidate.id}/downvote`);

      const res = await supertest(app).get("/recommendations/top/10");
      expect(res.body[0].id).toEqual(firstRecommendation.id);
    });
  });
});
