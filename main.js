const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, ActivityType, Partials, EmbedBuilder } = require('discord.js');
const { guildId, token, activities, statschannel, welcomechannel, logschannel, standardRoleName, suggestionchannel, roleschannel, badwords, bumpchannel, rainbowrole, rainbowroles, selfroles, shrekpics, lastbump } = require('./config.json');
const { setIntervalAsync } = require('set-interval-async');
const { logEx, newColor, drawWelcomeImage, getUnixTime, registerCommands } = require('./util.js');

const client = new Client({ 
    intents: 
    [GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildBans, 
    GatewayIntentBits.GuildMessageReactions,  
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildVoiceStates],
    partials: 
    [Partials.Message, 
    Partials.Channel, 
    Partials.Reaction
],});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    const guild = client.guilds.cache.get(guildId);
    logEx("bot started", guild);
    drawWelcomeImage('testrender', guild); // ghetto fix 
    registerCommands(guild);

    let currentIndex = 0;
    setInterval(() => {
      const activity = activities[currentIndex];
      client.user.setActivity(activity, { type: ActivityType.Watching });
  
      currentIndex = currentIndex >= activities.length - 1 
        ? 0
        : currentIndex + 1;
    }, 5000);

    var roles = [];
    for(var i = 0; i < rainbowroles.length; i++) {
        roles.push(guild.roles.cache.find(role => role.id === rainbowroles[i]))
    }

    var pingRole = guild.roles.cache.find(role => role.name === 'bumper');
    logEx(`last bump was ${getUnixTime() - lastbump} seconds ago`, guild);
    if((lastbump + 7200) < getUnixTime()) {
        guild.channels.cache.get(bumpchannel).send(`${pingRole} bumpt ihr loser`);
        logEx(`sending bump reminder message`, guild);
    } else {
        logEx(`starting bump remind timer | time left: ${Math.round(((lastbump + 7200 - getUnixTime()) / 60) * 100) / 100} minutes`, guild);
        setTimeout(() => { 
            guild.channels.cache.get(bumpchannel).send(`${pingRole} bumpt ihr loser`);
            bumped = false;
        }, ((lastbump + 7200) - getUnixTime()) * 1000);
    }

    setIntervalAsync(async () => {
        for(var i = 0; i < rainbowrole.length; i++) {
            await newColor(rainbowrole[i], roles, guild)
        }
    }, 10500);
});

client.on('messageCreate', async message => {
    if((message.channelId === logschannel) && !message.author.bot) {
        await message.delete(); 
        return;
    }

    if(message.channelId === bumpchannel) {
        if(message.embeds.length > 0) {
            if(message.embeds[0].description != null) {
                if((message.embeds[0].description.includes("Bump erfolgreich!") || message.embeds[0].description.includes("Bump done!"))) {
                    logEx(`server bumped | timestamp: ${getUnixTime()}`, message.guild);
                    let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
                    config.lastbump = getUnixTime();
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
                    const pingRole = message.guild.roles.cache.find(role => role.name === 'bumper');
                    setTimeout(() => { 
                        message.channel.send(`${pingRole} bumpt ihr loser`);
                    }, 7200000);
                };
            }
        }
    }

    if(message.author.bot) return;
    var content = message.content.toLowerCase();
    if(content == null) return;

    for(var i = 0; i < badwords.length; i++) {
        if(content.includes(badwords[i])) {
            await message.delete();
            logEx(`deleted message from ${message.member.user.username}#${message.member.user.discriminator} content: ${content}`, message.guild); 
            const badwordsembed = new EmbedBuilder()
                .setColor(0xfc2332)
                .setTitle('❗ **bad words deleted**')
                .setDescription(`\`${message.member.user.username}#${message.member.user.discriminator}\` said a bad word >:(`)

            let warning = await message.channel.send({ embeds: [badwordsembed] });
            setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        }
    }

    if(content.includes("discord.gg/" || "discordapp.com/invite/")) {
        await message.delete();
        message.guild.members.cache.get(message.author.id).roles.add(message.guild.roles.cache.find(role => role.name === 'muted'));
        logEx(`deleted invite link from ${message.member.user.username}#${message.member.user.discriminator}`, message.guild);
        const inviteembed = new EmbedBuilder()
            .setColor(0xfc2332)
            .setTitle('❗ **invite link deleted**')
            .setDescription(`\`${message.member.user.username}#${message.member.user.discriminator}\` tried to post an invite link and got muted 🤡`)

        let warning = await message.channel.send({ embeds: [inviteembed] });
        setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
    }

    if(content.includes("shrek")) {
        await message.reply(shrekpics[Math.floor(Math.random() * shrekpics.length) + 1])
    }

    if(content.includes(":catvibe:")) {
        await message.reply({ files: ['./images/resources/catvibe.gif']});
    }

    if(message.channelId === suggestionchannel) {
        await message.react('✅');
        await message.react('❌');
        logEx(`${message.member.user.username}#${message.member.user.discriminator} posted suggestion: ${content}`, message.guild);
    }
}) 

client.on('guildMemberAdd', async (member) => {
    let standardRole = member.guild.roles.cache.find(role => role.name === standardRoleName);

    await member.roles.add(standardRole);
    member.guild.channels.cache.get(welcomechannel).send({ files: [await drawWelcomeImage(member)]});
    logEx(`${member.user.username}#${member.user.discriminator} joined the server`, member.guild);

    try {
        member.guild.channels.cache.get(statschannel).setName(`₊✦˚・members: ${member.guild.memberCount}`); 
    }
    catch (error) {
        console.error(error);
    }
})

client.on('guildMemberRemove', (member) => {
    logEx(`${member.user.username}#${member.user.discriminator} left the server`, member.guild);

    try {
        member.guild.channels.cache.get(statschannel).setName(`₊✦˚・members: ${member.guild.memberCount}`);
    }
    catch (error) {
        console.error(error);
    }
})

client.on('messageReactionAdd', async (reaction, member) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(!reaction.message.guild) return;
    if(member.bot) return;

    if(reaction.message.channelId == roleschannel) {
        for(var i = 0; i < selfroles.length; i++) {
            if(reaction.emoji.name === selfroles[i][0]) {
                await reaction.message.guild.members.cache.get(member.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === selfroles[i][1]));
                logEx(`${member.username}#${member.discriminator} added self role: ${selfroles[i][1]}`, reaction.message.guild)
            }
        }
    }
})

client.on('messageReactionRemove', async (reaction, member) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(!reaction.message.guild) return;
    if(member.bot) return;

    if(reaction.message.channelId == roleschannel) {
        for(var i = 0; i < selfroles.length; i++) {
            if(reaction.emoji.name === selfroles[i][0]) {
                await reaction.message.guild.members.cache.get(member.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === selfroles[i][1]));
                logEx(`${member.username}#${member.discriminator} removed self role: ${selfroles[i][1]}`, reaction.message.guild)
            }
        }
    }
})

client.on('interactionCreate', async interaction => {
	if(!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if(!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'there was an error while executing this command :(', ephemeral: true });
	}
});

client.login(token);