import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x889e60AAFb15CF89632Ce9Cf48362D0B9A733144");

(async () => {
    try {
        const claimConditions = [{
            startTime: new Date(),
            maxQuantity: 10_000,
            price: 0,
            quantityLimitPerTransaction: 1,
            waitInSeconds: MaxUint256,
        }]

        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("Claim Condition Set!");
    } catch (error) {
        console.error("Error setting conditions ", error);
    }
})();
