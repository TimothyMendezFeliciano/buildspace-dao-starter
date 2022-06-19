import sdk from './1-initialize-sdk.js';

const editionDrop = sdk.getEditionDrop('0x889e60AAFb15CF89632Ce9Cf48362D0B9A733144');
const token = sdk.getToken('0x4E444Eb024eC65f8bFC6858c558C20c57b6D38Fd');

(async () => {
    try {
        const walletAddress = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddress.length === 0) {
            console.log('No NFTs claimed. Get some users to sign up bro');
            process.exit(0)
        }

        const airdropTargets = walletAddress.map((address) => {
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log(`Airdropping ${randomAmount} tokens to ${address}`)

            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            }

            return airdropTarget;
        })

        console.log('Airdrop Begin')
        await token.transferBatch(airdropTargets)
        console.log('Tokens Away')
    } catch (error) {
        console.log('Error Dropping Token ', error)
    }
})()
