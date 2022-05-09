import { jest } from "@jest/globals";
import { Recommendation } from "@prisma/client";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";

describe("UNIT TESTS", () => {
  describe("Insert", () => {
    it("should throw error gives duplicate recommendation", async () => {
      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValueOnce({} as Recommendation);

      expect(async () => {
        await recommendationService.insert({} as Recommendation);
      }).rejects.toEqual({
        message: "Recommendations names must be unique",
        type: "conflict",
      });
    });
  });
  describe("Downvote", () => {
    it("should remove recommendation downvote", async () => {
      const recommendation = {
        id: 5,
        name: "Hindi Zahra - Beautiful Tango",
        youtubeLink: "https://www.youtube.com/watch?v=2-8n6rTH6Ns",
        score: -6,
      };

      jest
        .spyOn(recommendationRepository, "find")
        .mockResolvedValue(recommendation);
      jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValue(recommendation);

      const remove = jest
        .spyOn(recommendationRepository, "remove")
        .mockResolvedValue(null);

      await recommendationService.downvote(recommendation.id);

      expect(recommendationRepository.updateScore).toBeCalledWith(
        recommendation.id,
        "decrement"
      );
      expect(recommendationRepository.remove).toBeCalledWith(recommendation.id);
      expect(remove).toHaveBeenCalledTimes(1);
    });
  });
});
