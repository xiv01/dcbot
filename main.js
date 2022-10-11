const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, ActivityType, Partials, EmbedBuilder } = require('discord.js');
const { token, activities, statschannel, welcomechannel, standardRoleName, suggestionchannel, roleschannel, badwords, bumpchannel, rainbowrole } = require('./config.json');
const { setIntervalAsync } = require('set-interval-async');

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

client.once('ready', () => {
    let date = new Date();
	console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] bot online`);

    let currentIndex = 0;
    setInterval(() => {
      const activity = activities[currentIndex];
      client.user.setActivity(activity, { type: ActivityType.Watching });
  
      currentIndex = currentIndex >= activities.length - 1 
        ? 0
        : currentIndex + 1;
    }, 5000);

    const guild = client.guilds.cache.get('1009909291165175860');
    var roles = [guild.roles.cache.find(role => role.id === '1029222292875644978'), 
                 guild.roles.cache.find(role => role.id === '1029230317539700796'), 
                 guild.roles.cache.find(role => role.id === '1029230389945978882'), 
                 guild.roles.cache.find(role => role.id === '1029230218629611540'), 
                 guild.roles.cache.find(role => role.id === '1029230447768653904'), 
                 guild.roles.cache.find(role => role.id === '1029230503359946763')];

    setIntervalAsync(async () => {
        for(var i = 0; i < rainbowrole.length; i++) {
            guild.members.fetch(rainbowrole[i])
                .then(async member => {
                    temp = member.roles.highest
                    currentrole = roles[Math.floor(Math.random() * roles.length)];
                    while(currentrole == temp) {
                        currentrole = roles[Math.floor(Math.random() * roles.length)];
                    }
                    await member.roles.add(currentrole); 
                    await member.roles.remove(temp);
            })
            .catch(console.error)
        }
      }, 10000);
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.on('messageCreate', async message => {
    // TODO: dont break when bot is restarted / check if timer is already running 
    if(message.channelId === bumpchannel) {
        if(message.embeds.length > 0) {
            if(message.embeds[0].description.includes("Bump erfolgreich!") || message.embeds[0].description.includes("Bump done!")) {
                let date = new Date();
                console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] server bumped :D`)
                const pingRole = message.guild.roles.cache.find(role => role.name === 'bumper');
                setTimeout(() => message.channel.send(`${pingRole} bumpt ihr loser`), 7200000);
            };
        }
    }

    if(message.author.bot) return;
    content = message.content.toLowerCase();

    for(var i = 0; i < badwords.length; i++) {
        if(content.includes(badwords[i])) {
            await message.delete();
            let date = new Date();
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] deleted message from ${message.member.user.username}#${message.member.user.discriminator} content: ${content}`)
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
        let date = new Date();
        console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] deleted invite link from ${message.member.user.username}#${message.member.user.discriminator}`)
        const inviteembed = new EmbedBuilder()
            .setColor(0xfc2332)
            .setTitle('❗ **invite link deleted**')
            .setDescription(`\`${message.member.user.username}#${message.member.user.discriminator}\` tried to post an invite link and got muted 🤡`)

        let warning = await message.channel.send({ embeds: [inviteembed] });
        setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
    }

    if(content.includes("shrek")) {
        await message.reply('https://cdn140.picsart.com/298141702027211.png');
    }

    if(message.channelId === suggestionchannel) {
        await message.react('✅');
        await message.react('❌');
    }
}) 

client.on('guildMemberAdd', (guildMember) => {
    let standardRole = guildMember.guild.roles.cache.find(role => role.name === standardRoleName);

    guildMember.roles.add(standardRole);
    guildMember.guild.channels.cache.get(welcomechannel).send(`welcome <@${guildMember.user.id}> to the best server`);
    let date = new Date();
    console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${guildMember.user.username}#${guildMember.user.discriminator} joined the server`);

    try {
        guildMember.guild.channels.cache.get(statschannel).setName(`₊✦˚・MEMBERS: ${guildMember.guild.memberCount}`); 
    }
    catch (error) {
        console.error(error);
    }
})

client.on('guildMemberRemove', (guildMember) => {
    let date = new Date();
    console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${guildMember.user.username}#${guildMember.user.discriminator} left the server`);

    try {
        guildMember.guild.channels.cache.get(statschannel).setName(`₊✦˚・MEMBERS: ${guildMember.guild.memberCount}`);
    }
    catch (error) {
        console.error(error);
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(!reaction.message.guild) return;
    if(user.bot) return;

    if (reaction.message.channelId == roleschannel) {
        let date = new Date();
        if(reaction.emoji.name === '1️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === '13+'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: 13+`)
        }
        if(reaction.emoji.name === '2️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === '16+'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: 16+`)
        }
        if(reaction.emoji.name === '3️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === '18+'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: 18+`)
        } 

        if(reaction.emoji.name === '💙') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'male'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: male`)
        } 
        if(reaction.emoji.name === '💜') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'female'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: female`)
        }
        if(reaction.emoji.name === '🤍') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'other'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: other`)
        }

        if(reaction.emoji.name === '💫') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'he/him'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: he/him`)
        } 
        if(reaction.emoji.name === '⭐') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'she/her'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: she/her`)
        }
        if(reaction.emoji.name === '🌟') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'they/them'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: they/them`)
        }
        if(reaction.emoji.name === '✨') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'it/it'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: it/it`)
        }

        if(reaction.emoji.name === '💗') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'femboy'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: femboy`)
        } 
        if(reaction.emoji.name === '🖤') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'emo'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: emo`)
        }
        if(reaction.emoji.name === '💪') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'gym bro'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: gym bro`)
        }
        if(reaction.emoji.name === '🎮') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'gamer'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} added self role: gamer`)
        }
        
        else {
            return;
        }
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(!reaction.message.guild) return;
    if(user.bot) return;

    if (reaction.message.channelId == roleschannel) {
        let date = new Date();
        if(reaction.emoji.name === '1️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === '13+'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: 13+`)
        }
        if(reaction.emoji.name === '2️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === '16+'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: 16+`)
        }
        if(reaction.emoji.name === '3️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === '18+'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: 18+`)
        } 
        
        if(reaction.emoji.name === '💙') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'male'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: male`)
        } 
        if(reaction.emoji.name === '💜') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'female'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: female`)
        }
        if(reaction.emoji.name === '🤍') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'other'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: other`)
        }

        if(reaction.emoji.name === '💫') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'he/him'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: he/him`)
        } 
        if(reaction.emoji.name === '⭐') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'she/her'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: she/her`)
        }
        if(reaction.emoji.name === '🌟') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'they/them'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: they/them`)
        }
        if(reaction.emoji.name === '✨') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'it/it'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: it/it`)
        }

        if(reaction.emoji.name === '💗') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'femboy'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: femboy`)
        } 
        if(reaction.emoji.name === '🖤') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'emo'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: emo`)
        }
        if(reaction.emoji.name === '💪') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'gym bro'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: gym bro`)
        }
        if(reaction.emoji.name === '🎮') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'gamer'));
            console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${user.username}#${user.discriminator} removed self role: gamer`)
        }
        
        else {
            return;
        }
    }
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'there was an error while executing this command :(', ephemeral: true });
	}
});

client.login(token);