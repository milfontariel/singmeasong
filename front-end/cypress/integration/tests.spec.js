/// <reference types="Cypress" />
import { list } from "../utils/list";

function createVideo(pos) {
    if (pos < list.length && pos >= 0) {
        return list[pos]
    }
    const video = list[Math.floor(Math.random() * list.length)];
    return video;
}


describe("Creating a recommendation", () => {

    beforeEach(() => {
        cy.request('DELETE', 'http://localhost:5000/reset').as('resetReco');
    })

    it("should create a recommendation", () => {
        cy.visit("http://localhost:3000");

        const video = createVideo();

        cy.get("div.sc-hKMtZM").children("input").first().type(video.title);
        cy.get("div.sc-hKMtZM").children("input").last().type(video.videoUrl);

        cy.intercept("POST", "/recommendations").as("postVideo");
        cy.get("button").click();
        cy.wait("@postVideo");

        cy.contains(video.title);
    })

    it("should erase the video inserted by lowering it 6 times", () => {
        cy.visit("http://localhost:3000");

        const video = createVideo();

        cy.get("div.sc-hKMtZM").children("input").first().type(video.title);
        cy.get("div.sc-hKMtZM").children("input").last().type(video.videoUrl);

        cy.intercept("POST", "/recommendations").as("postVideo");
        cy.get("button").click();
        cy.wait("@postVideo");


        cy.contains("0");

        for (let i = 0; i < 6; i++) {

            cy.intercept("GET", "/recommendations").as("downVote");
            cy.get("div.sc-iBkjds").children("svg").last().click();
            cy.wait("@downVote");
            if (i === 0) {
                cy.contains("-1");
            }
        }

        cy.contains(video.title).should("not.exist");
    })

    it("should correctly ranked according to the number of votes", () => {
        cy.visit("http://localhost:3000");

        const video = createVideo(1);
        const anotherVideo = createVideo(3);

        cy.get("div.sc-hKMtZM").children("input").first().type(video.title);
        cy.get("div.sc-hKMtZM").children("input").last().type(video.videoUrl);

        cy.intercept("POST", "/recommendations").as("postVideo");
        cy.get("button").click();
        cy.wait("@postVideo");

        cy.get("div.sc-hKMtZM").children("input").first().type(anotherVideo.title);
        cy.get("div.sc-hKMtZM").children("input").last().type(anotherVideo.videoUrl);

        cy.intercept("POST", "/recommendations").as("postVideo");
        cy.get("button").click();
        cy.wait("@postVideo");

        cy.visit("http://localhost:3000/top");


        cy.get('#root > :nth-child(3) > :nth-child(1)').should("contain.text", video.title)
        cy.get(".sc-eCYdqJ").contains(anotherVideo.title).next().next().children(":nth-child(1)").click();
        cy.get('#root > :nth-child(3) > :nth-child(1)').should("contain.text", anotherVideo.title)

        cy.contains(video.title);
        cy.contains(anotherVideo.title);
    })

    it("should show a recommendation", () => {
        cy.visit("http://localhost:3000");

        const video = createVideo();

        cy.get("div.sc-hKMtZM").children("input").first().type(video.title);
        cy.get("div.sc-hKMtZM").children("input").last().type(video.videoUrl);

        cy.intercept("POST", "/recommendations").as("postVideo");
        cy.get("button").click();
        cy.wait("@postVideo");

        cy.visit("http://localhost:3000/random");

        cy.contains(video.title);
    })
})