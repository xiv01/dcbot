const { Collection, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { statschannel, welcomechannel, standardRoleName, rulesChannel } = require('./config.json');
const { logEx, drawWelcomeImage } = require('./Util.js');
const color = require('./colors.json');
module.exports = { memberManager };

async function memberManager(client) {
    const invites = new Collection();
    const wait = require("timers/promises").setTimeout;

    await wait(1000);
    client.guilds.cache.forEach(async (guild) => {
      const firstInvites = await guild.invites.fetch();
      invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
      logEx(color.defaultLog, '⚙️ System', `successfully cached invites`, guild);
    });

    client.on("inviteDelete", (invite) => {
      invites.get(invite.guild.id).delete(invite.code);
    });
    
    client.on("inviteCreate", (invite) => {
      invites.get(invite.guild.id).set(invite.code, invite.uses);
    });

    client.on("guildCreate", (guild) => {
        guild.invites.fetch().then(guildInvites => {
          invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
        })
    });

    client.on("guildDelete", (guild) => {
        invites.delete(guild.id);
    });
    
    client.on('guildMemberAdd', async (member) => {
        let standardRole = member.guild.roles.cache.find(role => role.name === standardRoleName);
        await member.roles.add(standardRole);

		const image = new AttachmentBuilder(await drawWelcomeImage(member), { name: 'welcome.png' })
        const welcomeembed = new EmbedBuilder()
            .setColor(color.pink)
            .setTitle(`🎉 **Willkommen ${member.user.username} auf ₊˚✦ cozy community!!**`)
            .setDescription(`Wir freuen uns auf dich und wünschen dir viel Spaß!\nBitte lese zuerst die Regeln in <#${rulesChannel}> :)`)
            .setImage('attachment://welcome.png')
            .setTimestamp()
            .setFooter({
                text: `du bist member #${member.guild.memberCount}`,
        });
        await member.guild.channels.cache.get(welcomechannel).send({embeds: [welcomeembed], files: [image]});
    
        try {
            member.guild.channels.cache.get(statschannel).setName(`₊✦˚・members: ${member.guild.memberCount}`); 
        } catch (error) {
            console.error(error);
        };

        const newInvites = await member.guild.invites.fetch()
        const oldInvites = invites.get(member.guild.id);
        const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
        try {
            const inviter = await client.users.fetch(invite.inviter.id);
            inviter
              ? logEx(color.joinLog, '📥 Member Joined', `<@${member.id}> joined the server\n**invite code:** \`\`${invite.code} (${invite.uses})\`\`\n**inviter**: <@${inviter.id}>`, member.guild)
              : logEx(color.joinLog, '📥 Member Joined', `<@${member.id}> joined the server\n**invite code:** not trackable`, member.guild);
        } catch {
            logEx(color.joinLog, '📥 Member Joined', `<@${member.id}> joined the server\n**invite code:** not trackable`, member.guild);
        }
    });
    
    client.on('guildMemberRemove', (member) => {
        logEx(color.leaveLog, '📤 Member Left', `<@${member.id}> left the server`, member.guild);
    
        try {
            member.guild.channels.cache.get(statschannel).setName(`₊✦˚・members: ${member.guild.memberCount}`);
        } catch (error) {
            console.error(error);
        };
    });
};