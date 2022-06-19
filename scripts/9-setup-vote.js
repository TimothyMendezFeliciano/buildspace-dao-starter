import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0xc7b95374EFf096F53f2973D215f32e063B2bcf6e");
const token = sdk.getToken("0x4E444Eb024eC65f8bFC6858c558C20c57b6D38Fd");

(async () => {
    try {
        await token.roles.grant('minter', vote.getAddress());
    } catch (error) {
        console.error('Error setting up vote', error);
        process.exit(1);
    }

    try {
        const ownedTokenBalance = await token.balanceOf(
            process.env.WALLET_ADDRESS
        );
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;

        await token.transfer(
            vote.getAddress(),
            percent90
        );
        console.log(`Transferred ${percent90} tokens to voting contract`);
    } catch (error) {
        console.error('Error transfering tokens to voting contract', error);
    }
})();
