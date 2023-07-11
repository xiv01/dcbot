const { ActivityType } = require('discord.js');
const { rainbowRolesName, activities } = require('../config.json');
const { setIntervalAsync } = require('set-interval-async');
module.exports = { routines };

async function routines(guild, client) {
    client.rainbowRole = [];
    var roles = [];
    guild.roles.fetch()
        .then(roleList => roleList.forEach(role => {
            if(role.name === rainbowRolesName) roles.push(role);
        }));

    let currentIndex = 0;
    setIntervalAsync(async () => {
        let members = [];
        for(var i = 0; i < client.rainbowRole.length; i++) {
            await guild.members.fetch(client.rainbowRole[i]).then(async member => {
                if(member.roles.highest.name !== rainbowRolesName) {
                    await member.roles.add(roles[currentIndex]);
                } else {
                    members.push({member: member, highest: member.roles.highest});
                };
            }).catch(console.error);
        };
        members.forEach(async entry => {
            await entry.member.roles.add(roles[currentIndex]);
        });
        members.forEach(async entry => {
            await entry.member.roles.remove(entry.highest);
        });
        currentIndex = currentIndex >= roles.length - 1 
            ? 0
            : currentIndex + 1;
    }, 10000);

    let currentIndex2 = 0;
    setInterval(() => {
        client.user.setActivity(activities[currentIndex2], { type: ActivityType.Watching });
        currentIndex2 = currentIndex2 >= activities.length - 1 
            ? 0
            : currentIndex2 + 1;
    }, 5000);
};