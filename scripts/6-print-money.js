import sdk from "./1-initialize-sdk.js";

// This is the address of our ERC-20 contract printed out in the step before.
const token = sdk.getToken("0x4E444Eb024eC65f8bFC6858c558C20c57b6D38Fd");

(async () => {
    try {
        // What's the max supply you want to set? 1,000,000 is a nice number!
        const amount = 3;
        // Interact with your deployed ERC-20 contract and mint the tokens!
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();

        console.log(`${totalSupply.displayValue} $PLATO now exist.`);
    } catch (error) {
        console.error("Money Printer NO Brrr", error);
    }
})();
