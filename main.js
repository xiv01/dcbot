const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, ActivityType, Partials, EmbedBuilder } = require('discord.js');
const { token, activities, statschannel, welcomechannel, standardRoleName, suggestionchannel, roleschannel, badwords } = require('./config.json');

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
	console.log('[log] online');

    const updateDelay = 5; 
    let currentIndex = 0;
  
    setInterval(() => {
      const activity = activities[currentIndex];
      client.user.setActivity(activity, { type: ActivityType.Watching });
  
      currentIndex = currentIndex >= activities.length - 1 
        ? 0
        : currentIndex + 1;
    }, updateDelay * 1000);
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.on('messageCreate', async message => {
    if(message.author.bot) return;
    content = message.content.toLowerCase();

    for (var i = 0; i < badwords.length; i++) {
        if (content.includes(badwords[i])) {
            await message.delete();
            console.log(`[log] deleted message from ${message.member.user.username}#${message.member.user.discriminator} content: ${content}`)
            const badwordsembed = new EmbedBuilder()
                .setColor(0xfc2332)
                .setTitle('❗ **bad words deleted**')
                .setDescription(`\`${message.member.user.username}#${message.member.user.discriminator}\` said a bad word >:(`)

            let warning = await message.channel.send({ embeds: [badwordsembed] });
            setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 5000);
        }
    }

    if(content.includes("discord.gg/" || "discordapp.com/invite/")) {
        await message.delete();
        console.log(`[log] deleted invite link from ${message.member.user.username}#${message.member.user.discriminator}`)
        const inviteembed = new EmbedBuilder()
            .setColor(0xfc2332)
            .setTitle('❗ **invite link deleted**')
            .setDescription(`\`${message.member.user.username}#${message.member.user.discriminator}\` tried to post and invite link`)

        let warning = await message.channel.send({ embeds: [inviteembed] });
        setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 5000);
    }

    if(content.includes("shrek")) {
        await message.reply('https://cdn140.picsart.com/298141702027211.png');
    }

    if (message.channelId === suggestionchannel) {
        await message.react('✅');
        await message.react('❌');
    }
}) 

client.on('guildMemberAdd', (guildMember) => {
    let standardRole = guildMember.guild.roles.cache.find(role => role.name === standardRoleName);

    guildMember.roles.add(standardRole);
    guildMember.guild.channels.cache.get(welcomechannel).send(`welcome <@${guildMember.user.id}> to the best server`);
    console.log(`[log] ${guildMember.username} joined the server`);

    try {
        guildMember.guild.channels.cache.get(statschannel).setName(`₊✦˚・MEMBERS: ${guildMember.guild.memberCount}`); 
    }
    catch (error) {
        console.error(error);
    }
})

client.on('guildMemberRemove', (guildMember) => {
    console.log(`[log] ${guildMember.user.username} left the server`);
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
        if(reaction.emoji.name === '1️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === '13+'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: 13+`)
        }
        if(reaction.emoji.name === '2️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === '16+'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: 16+`)
        }
        if(reaction.emoji.name === '3️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === '18+'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: 18+`)
        } 

        if(reaction.emoji.name === '💙') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'male'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: male`)
        } 
        if(reaction.emoji.name === '💜') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'female'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: female`)
        }
        if(reaction.emoji.name === '🤍') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'other'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: other`)
        }

        if(reaction.emoji.name === '💫') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'he/him'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: he/him`)
        } 
        if(reaction.emoji.name === '⭐') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'she/her'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: she/her`)
        }
        if(reaction.emoji.name === '🌟') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'they/them'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: they/them`)
        }
        if(reaction.emoji.name === '✨') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'it/it'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: it/it`)
        }

        if(reaction.emoji.name === '💗') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'femboy'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: femboy`)
        } 
        if(reaction.emoji.name === '🖤') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'emo'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: emo`)
        }
        if(reaction.emoji.name === '💪') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'gym bro'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: gym bro`)
        }
        if(reaction.emoji.name === '🎮') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'gamer'));
            console.log(`[log] ${user.username}#${user.discriminator} added self role: gamer`)
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
        if(reaction.emoji.name === '1️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === '13+'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: 13+`)
        }
        if(reaction.emoji.name === '2️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === '16+'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: 16+`)
        }
        if(reaction.emoji.name === '3️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === '18+'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: 18+`)
        } 
        
        if(reaction.emoji.name === '💙') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'male'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: male`)
        } 
        if(reaction.emoji.name === '💜') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'female'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: female`)
        }
        if(reaction.emoji.name === '🤍') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'other'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: other`)
        }

        if(reaction.emoji.name === '💫') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'he/him'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: he/him`)
        } 
        if(reaction.emoji.name === '⭐') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'she/her'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: she/her`)
        }
        if(reaction.emoji.name === '🌟') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'they/them'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: they/them`)
        }
        if(reaction.emoji.name === '✨') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'it/it'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: it/it`)
        }

        if(reaction.emoji.name === '💗') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'femboy'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: femboy`)
        } 
        if(reaction.emoji.name === '🖤') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'emo'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: emo`)
        }
        if(reaction.emoji.name === '💪') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'gym bro'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: gym bro`)
        }
        if(reaction.emoji.name === '🎮') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'gamer'));
            console.log(`[log] ${user.username}#${user.discriminator} removed self role: gamer`)
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