import { jest } from "@jest/globals";
import { Recommendation } from "@prisma/client";
import { recommendationRepository } from "../src/repositories/recommendationRepository";
import { recommendationService } from "../src/services/recommendationsService";

describe("UNIT TESTS", () => {
  describe("Insert", () => {
    it("should call create on repository", async () => {
      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValue(null);
      const res = await recommendationService.insert({
        name: "as",
        youtubeLink: "as",
      });
      jest
        .spyOn(recommendationRepository, "create")
        .mockImplementationOnce(async () => {});
      expect(res).resolves;
    });
    it("should throw error gives duplicate recommendation", async () => {
      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValue({} as Recommendation);
      const res = await recommendationService.insert({
        name: "as",
        youtubeLink: "as",
      });
      console.log("salve: ", res);
      expect(res).resolves;
    });
  });
});
