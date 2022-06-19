import {AddressZero} from "@ethersproject/constants";
import sdk from './1-initialize-sdk.js'

(async () => {
    try {
        const tokenAddress = await sdk.deployer.deployToken({
            name: 'DAOmocracy Governance Token',
            symbol: 'PLATO',
            primary_sale_recipient: AddressZero
        })
        console.log('Token Deployed to: ', tokenAddress)
    } catch (error) {
        console.error('Error deploying token ', error)
    }
})()
