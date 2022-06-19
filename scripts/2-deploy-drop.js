import { AddressZero } from '@ethersproject/constants'
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from 'fs'

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            name: 'DAOmocracy Membership',
            description: 'A DAO for fun',
            image: readFileSync('scripts/assets/FireAndBlood.jpg'),
            primary_sale_recipient: AddressZero
        })

        const editionDrop = sdk.getEditionDrop(editionDropAddress)
        const metadata = await editionDrop.metadata.get()
        console.log('Succesfully deployed contract, address:',
            editionDropAddress)
        console.log('Metadata: ', metadata)
    } catch (error) {
        console.error('Failed to deploy ', error)
    }
})()
