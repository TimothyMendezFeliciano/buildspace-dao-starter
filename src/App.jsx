import {useNetwork, useToken, useAddress, useMetamask, useDisconnect, useEditionDrop, useVote} from "@thirdweb-dev/react";
import {ChainId} from "@thirdweb-dev/react";
import React, {useEffect, useMemo, useState} from "react";
import {shortenAddress} from "./utils";
import {AddressZero} from "@ethersproject/constants";

const App = () => {
    const editionDrop = useEditionDrop('0x889e60AAFb15CF89632Ce9Cf48362D0B9A733144')
    const token = useToken("0x4E444Eb024eC65f8bFC6858c558C20c57b6D38Fd")
    const vote = useVote('0xc7b95374EFf096F53f2973D215f32e063B2bcf6e')
    const address = useAddress()
    const network = useNetwork()
    const connectWithMetaMask = useMetamask()
    const disconnectWithMetaMask = useDisconnect()

    const [hasClaimedNFT, setHasClaimedNFT] = useState(false)
    const [isClaiming, setIsClaiming] = useState(false)

    const [memberTokenAmounts, setMemberTokenAmounts] = useState([])
    const [memberAddresses, setMemberAddresses] = useState([])

    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const mintNft = async () => {
        try {
            setIsClaiming(true)
            await editionDrop.claim("0", 1)
            setHasClaimedNFT(true)
        } catch (error) {
            setHasClaimedNFT(false)
            console.error('Error minting NFT ', error)
        } finally {
            setIsClaiming(false)
        }
    }

    useEffect(() => {
        if (!hasClaimedNFT) return

        const getAllAddresses = async () => {
            try {
                const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
                setMemberAddresses(memberAddresses);
                console.log('All Members: ', memberAddresses)
            } catch (error) {
                console.error('Error fetching member list', error)
            }
        }

        getAllAddresses()
    }, [hasClaimedNFT, editionDrop.history])

    useEffect(() => {
        if (!hasClaimedNFT) return
        const getAllBalances = async () => {
            try {
                const amounts = await token.history.getAllHolderBalances()
                setMemberTokenAmounts(amounts)
            } catch (error) {
                console.error('Error fetching balances', error)
            }
        }

        getAllBalances()
    }, [hasClaimedNFT, token.history])

    const memberList = useMemo(() => {
        return memberAddresses.map((address) => {
            const member = memberTokenAmounts?.find(({holder}) => holder === address);

            return {
                address,
                tokenAmount: member?.balance.displayValue || '0'
            }
        })
    }, [memberAddresses, memberTokenAmounts])

    useEffect(() => {
        if (!address) return

        const checkBalance = async () => {
            try {
                const balance = await editionDrop.balanceOf(address, 0)
                if (balance.gt(0)) {
                    setHasClaimedNFT(true)
                    console.log('Membership Approved')
                } else {
                    setHasClaimedNFT(false)
                    console.log('No Membership')
                }
            } catch (error) {
                setHasClaimedNFT(false)
                console.error('Error fetching NFT ', error)
            }
        }

        checkBalance()
    }, [address, editionDrop])

    useEffect(() => {
        if (!hasClaimedNFT) return

        const getAllproposals = async () => {
            try {
                const proposals = await vote.getAll()
                setProposals(proposals)
                console.log('Proposals: ', proposals)
            } catch (error) {
                console.error('Error fetching Proposals', error)
            }
        }
        getAllproposals()
    }, [hasClaimedNFT, vote])

    useEffect(() => {
        if (!hasClaimedNFT) return;
        if (!proposals.length) return;

        const checkIfUserHasVoted = async () => {
            try {
                const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
                setHasVoted(hasVoted)
            } catch (error) {
                console.error('Error checking if user voted', error)
            }
        }

        checkIfUserHasVoted()
    }, [hasClaimedNFT, proposals, address, vote])

    return (
        <div className="landing">
            {address === undefined ?
                <>
                    <h1>Welcome to DAOmocracy</h1>
                    <button onClick={connectWithMetaMask} className={'btn-hero'}>Connect your wallet</button>
                </>
                :
                <>
                    <p>Wallet Connected: {shortenAddress(address)}</p>
                    <button onClick={disconnectWithMetaMask} className={'btn-hero'}>Disconnect Your Wallet</button>
                    <div className={'mint-nft'}>
                        <h1>Mint your DAOmocracy Token</h1>
                        <button
                            disabled={isClaiming}
                            onClick={mintNft}
                        >
                            {isClaiming ? 'Minting...' : 'Mint your nft!'}
                        </button>
                    </div>
                    {address && network?.[0].data.chain.id !== ChainId.Rinkeby && (
                        <div className={'unsupported-network'}>
                            <h2>Connect to Rinkeby</h2>
                            <p>DAOmocracy only works on Rinkeby Network </p>
                        </div>
                    )}
                    {hasClaimedNFT &&
                        <div className={'member-page'}
                        >
                            <h1>DAO Member Page</h1>
                            <p>Congratulations on being a member</p>
                            <div>
                                <div>
                                    <h2>List of Plato's</h2>
                                    <table className={'card'}>
                                        <thead>
                                        <tr>
                                            <th>Address</th>
                                            <th>Token Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {memberList.map((member) => (
                                            <tr key={member.address}>
                                                <td>{shortenAddress(member.address)}</td>
                                                <td>{member.tokenAmount}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <h2>Active Trials</h2>
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setIsVoting(true);

                                            const votes = proposals.map((proposal) => {
                                                const voteResult = {
                                                    proposalId: proposal.proposalId,
                                                    vote: 2,
                                                };
                                                proposal.votes.forEach((vote) => {
                                                    const elem = document.getElementById(
                                                        `${proposal.proposalId}-${vote.type}`
                                                    );

                                                    if (elem.checked) {
                                                        voteResult.vote = vote.type
                                                        return;
                                                    }
                                                });
                                                return voteResult;
                                            });

                                            try {
                                                const delegation = await token.getDelegationOf(address);
                                                if (delegation === AddressZero) {
                                                    await token.delegateTo(address)
                                                }
                                                try {
                                                    await Promise.all(votes.map(async ({proposalId, vote: _vote}) => {
                                                        const proposal = await vote.get(proposalId);
                                                        if (proposal.state === 1) {
                                                            return vote.vote(proposalId, _vote)
                                                        }
                                                        return;
                                                    }));
                                                    try {
                                                        await Promise.all(votes.map(async ({proposalId}) => {
                                                            const proposal = await vote.get(proposalId);
                                                            if (proposal.state === 4) {
                                                                return vote.execute(proposalId);
                                                            }
                                                        }));
                                                        setHasVoted(true)
                                                        console.log('Voted');
                                                    } catch (e) {
                                                        console.error(e)
                                                    }
                                                } catch (error) {
                                                    console.error(error)
                                                }
                                            } catch (error) {
                                                console.error(error)
                                            } finally {
                                                setIsVoting(false)
                                            }
                                        }}
                                    >
                                        {proposals.map((proposal) => (
                                            <div key={proposal.proposalId} className={'card'}>
                                                <h5>{proposal.description}</h5>
                                                <div>
                                                    {proposal.votes.map(({type, label}) => (
                                                        <div key={type}>
                                                            <input
                                                                type={'radio'}
                                                                id={`${proposal.proposalId}-${type}`}
                                                                name={proposal.proposalId}
                                                                value={type}
                                                                defaultChecked={type === 2}
                                                            />
                                                            <label htmlFor={`${proposal.proposalId}-${type}`}>
                                                                {label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <button disabled={isVoting || hasVoted} type={'submit'}>
                                            {isVoting
                                                ? 'Voting . . '
                                                : hasVoted ?
                                                    'You already voted'
                                                    : 'Submit votes'
                                            }
                                        </button>
                                        {!hasVoted && (
                                            <small>Sign transanctions</small>
                                        )}
                                    </form>
                                </div>
                            </div>
                            <a target={'_blank'}
                               href={`https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`}>
                                <button className={'btn-hero'}>Click to View NFT</button>
                            </a>
                        </div>}
                </>
            }
        </div>
    );
};

export default App;
