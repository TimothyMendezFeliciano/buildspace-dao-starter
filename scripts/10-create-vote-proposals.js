import sdk from "./1-initialize-sdk.js";
import {ethers} from 'ethers';

const vote = sdk.getVote("0xc7b95374EFf096F53f2973D215f32e063B2bcf6e");
const token = sdk.getToken("0x4E444Eb024eC65f8bFC6858c558C20c57b6D38Fd");

(async ()=>{
    try {
        const amount = 12_333;
        const description = `Adding ${amount} of tokens to the treasury`;
        const executions = [
            {
                toAddress: token.getAddress(),
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    'mintTo',
                    [
                     vote.getAddress(),
                     ethers.utils.parseUnits(amount.toString(), 18)
                    ]
                )
            }
        ]

        await vote.propose(description, executions);
        console.log('Mint Proposal Created!')
    } catch (error) {
        console.error('Error creating vote proposal', error);
        process.exit(1);
    }

    try {
        const amount = 9_999;
        const description = `Money Printer Go Brrrr ${amount}`
        const executions = [
            {
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    'transfer',
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18)
                    ]
                ),
                toAddress: token.getAddress()
            }
        ];

        await vote.propose(description, executions);
        console.log('Cash Rules Everything Around Me')

        try {
            const amount = 1;
            const description = `Do you know that you know nothing?`
            const executions = [
                {
                    nativeTokenValue: 0,
                    transactionData: token.encoder.encode(
                        'transfer',
                        [
                            process.env.WALLET_ADDRESS,
                            ethers.utils.parseUnits(amount.toString(), 18)
                        ]
                    ),
                    toAddress: token.getAddress()
                }
            ];

            await vote.propose(description, executions);
            console.log('Socrates Trial has begun!')
        } catch (error) {
            console.error('You know everything', error)
        }
    } catch (error) {
        console.error('No coins for you', error)
    }
})();
