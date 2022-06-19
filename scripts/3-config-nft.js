import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x889e60AAFb15CF89632Ce9Cf48362D0B9A733144");

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "Fire and Blood Cover",
                description: "With this you can vote on DAOmocracy",
                image: readFileSync("scripts/assets/FireAndBlood.jpg"),
            },
        ]);
        console.log("Successfully created batch NFT");
    } catch (error) {
        console.error("Error creating NFT", error);
    }
})();
