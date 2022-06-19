import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken('0x4E444Eb024eC65f8bFC6858c558C20c57b6D38Fd');

(async () => {
    try {
        const allRoles = await token.roles.getAll();
        console.log('Existing Roles', allRoles)

        await token.roles.setAll({admin: [], minter: []});
        console.log('Total Anarchy', await token.roles.getAll())
    } catch (error) {
        console.error('Error Revoking Roles', error)
    }
})();
