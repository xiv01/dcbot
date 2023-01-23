const { roleschannel, selfroles } = require('./config.json');
const { logEx } = require('./Util.js');
const color = require('./colors.json');
module.exports = { selfRoles };

async function selfRoles(client) {
    client.on('messageReactionAdd', async (reaction, member) => {
        addRole(reaction, member, false);
    });
    
    client.on('messageReactionRemove', async (reaction, member) => {
        addRole(reaction, member, true);
    });
};

async function addRole(reaction, member, type) {
    if(member.bot) return;
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(!reaction.message.guild) return;

    if(reaction.message.channelId == roleschannel) {
        for(var i = 0; i < selfroles.length; i++) {
            if(reaction.emoji.name === selfroles[i][0]) {
                if(type) {
                    await reaction.message.guild.members.cache.get(member.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === selfroles[i][1]));
                    logEx(color.selfrolesLog, 'Self Role Removed', `<@${member.id}> removed self role: \`\`${selfroles[i][1]}\`\``, reaction.message.guild, member);
                } else {
                    await reaction.message.guild.members.cache.get(member.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === selfroles[i][1]));
                    logEx(color.selfrolesLog, 'Self Role Added', `<@${member.id}> added self role: \`\`${selfroles[i][1]}\`\``, reaction.message.guild, member);
                };
            };
        };
    };
};