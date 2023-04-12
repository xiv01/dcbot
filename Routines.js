const { ActivityType } = require('discord.js');
const { rainbowRoles, activities } = require('./config.json');
const { setIntervalAsync } = require('set-interval-async');
module.exports = { routines };

async function routines(guild, client) {
    client.rainbowRole = [];
    var roles = [];

    for(var i = 0; i < rainbowRoles.length; i++) {
        roles.push(guild.roles.cache.find(role => role.id === rainbowRoles[i]));
    };

    let currentIndex = 0;
    setIntervalAsync(async () => {
        for(var i = 0; i < client.rainbowRole.length; i++) {
            await guild.members.fetch(client.rainbowRole[i]).then(async member => {
                let highest = member.roles.highest
                if(highest.name != "rainbow") {
                    await member.roles.add(roles[0]); 
                    return;
                };
                await member.roles.add(roles[currentIndex]);
                await member.roles.remove(highest);
            }).catch(console.error)
        };
        currentIndex = currentIndex >= roles.length - 1 
            ? 0
            : currentIndex + 1;
    }, 11000);

    let currentIndex2 = 0;
    setInterval(() => {
        client.user.setActivity(activities[currentIndex2], { type: ActivityType.Watching });
        currentIndex2 = currentIndex2 >= activities.length - 1 
            ? 0
            : currentIndex2 + 1;
    }, 5000);
};