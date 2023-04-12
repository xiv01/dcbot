const { Collection, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { statsChannel, welcomeChannel, standardRoleName, rulesChannel, memberLogsChannel, guildId } = require('./config.json');
const { logEx, drawWelcomeImage } = require('./Util.js');
const color = require('./colors.json');
module.exports = { memberManager };

async function memberManager(client) {
    const firstInvites = await client.guilds.cache.get(guildId).invites.fetch();
    client.inviteUsageCounts = new Collection(firstInvites.map((invite) => [invite.code, invite.uses]));
    logEx(color.defaultLog, '⚙️ System', `successfully cached invites`, client.guilds.cache.get(guildId));
    
    client.on('guildMemberAdd', async (member) => {
        let standardRole = member.guild.roles.cache.find(role => role.name === standardRoleName);
        await member.roles.add(standardRole);

		const image = new AttachmentBuilder(await drawWelcomeImage(member), { name: 'welcome.png' })
        const welcomeEmbed = new EmbedBuilder()
            .setColor(color.pink)
            .setTitle(`🎉 **Willkommen ${member.user.username} auf ₊˚✦ cozy community!!**`)
            .setDescription(`Wir freuen uns auf dich und wünschen dir viel Spaß!\nBitte lese zuerst die Regeln in <#${rulesChannel}> :)`)
            .setImage('attachment://welcome.png')
            .setTimestamp()
            .setFooter({
                text: `du bist member #${member.guild.memberCount}`,
        });
        await member.guild.channels.cache.get(welcomeChannel).send({embeds: [welcomeEmbed], files: [image]});
    
        try {
            member.guild.channels.cache.get(statsChannel).setName(`₊✦˚・members: ${member.guild.memberCount}`); 
        } catch (error) {
            console.error(error);
        };

        const invites = await member.guild.invites.fetch();
        const inviteUsed = invites.find(invite => {
            const inviteUsageBefore = client.inviteUsageCounts.get(invite.code) ?? 0;
            const inviteUsageAfter = invite.uses;
            if (inviteUsageAfter > inviteUsageBefore) {
                client.inviteUsageCounts.set(invite.code, inviteUsageAfter);
                return true;
            }
        });

        try {
            const inviter = await client.users.fetch(inviteUsed.inviter.id);
            logEx(color.joinLog, '📥 Member Joined', `<@${member.id}> joined the server\n**invite code:** \`\`${inviteUsed.code} (${inviteUsed.uses})\`\`\n**inviter**: <@${inviter.id}>`, member.guild, member, memberLogsChannel)
        } catch {
            logEx(color.joinLog, '📥 Member Joined', `<@${member.id}> joined the server\n**invite code:** not trackable`, member.guild, member, memberLogsChannel);
        };
    });
    
    client.on('guildMemberRemove', async (member) => {
        logEx(color.leaveLog, '📤 Member Left', `<@${member.id}> left the server`, member.guild, member, memberLogsChannel)
        try {
            member.guild.channels.cache.get(statsChannel).setName(`₊✦˚・members: ${member.guild.memberCount}`);
        } catch (error) {
            console.error(error);
        };
    });
};