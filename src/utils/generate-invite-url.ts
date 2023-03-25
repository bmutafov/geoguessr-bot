export function generateInviteUrl() {
    const permissions = process.env.PERMISSIONS;
    const clientID = process.env.CLIENT_ID;
    const inviteUrl = `https://discordapp.com/oauth2/authorize?client_id=${clientID}&scope=bot&permissions=${permissions}`;

    console.log(`Invite your bot to your server: ${inviteUrl}`);
}