import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
           name: 'Hemlock',
            voting_token_address: "0x4E444Eb024eC65f8bFC6858c558C20c57b6D38Fd",
            voting_delay_in_blocks: 0,
            voting_period_in_blocks: 6570,
            voting_quorum_fraction:0,
            proposal_token_threshold: 0 // No tokens required
        });
        console.log('Deployed Voting Contract to: ', voteContractAddress)
    } catch( error) {
        console.error('Error deploying vote contract', error)
    }
})();
