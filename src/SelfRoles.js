const { rolesChannel, selfroles } = require('../config.json');
const { logEx } = require('./Util.js');
const color = require('../colors.json');
module.exports = { selfRoles };

async function selfRoles(client) {
    client.on('messageReactionAdd', async (reaction, member) => {
        addSelfRole(reaction, member, false);
    });
    
    client.on('messageReactionRemove', async (reaction, member) => {
        addSelfRole(reaction, member, true);
    });
};

async function addSelfRole(reaction, user, type) {
    if(user.bot) return;
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(!reaction.message.guild) return;

    if(reaction.message.channelId == rolesChannel) {
        for(var i = 0; i < selfroles.length; i++) {
            for(j = 0; j < selfroles[i].roles.length; j++) {
                if(selfroles[i].roles[j][0].includes(reaction.emoji.name)) {
                    let roleName = selfroles[i].roles[j][1];
                    if(type) {
                        await reaction.message.guild.members.fetch(user.id).then(async member => {
                            await member.roles.remove(reaction.message.guild.roles.cache.find(role => role.name === selfroles[i].roles[j][1]));
                            logEx(color.selfrolesLog, '👥 Self Role Removed', `<@${user.id}> removed self role: \`${roleName}\``, reaction.message.guild, member);
                        });
                    } else {
                        await reaction.message.guild.members.fetch(user.id).then(async member => {
                            await member.roles.add(reaction.message.guild.roles.cache.find(role => role.name === selfroles[i].roles[j][1]));
                            logEx(color.selfrolesLog, '👥 Self Role Added', `<@${user.id}> added self role: \`${roleName}\``, reaction.message.guild, member);
                        });
                    };
                };
            };
        };
    };
};