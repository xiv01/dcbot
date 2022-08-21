const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, ActivityType, Partials } = require('discord.js');
const { token, activities, statschannel, welcomechannel, standardRoleName, suggestionchannel, roleschannel } = require('./config.json');

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
	console.log('online');

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

    if(content.includes("shrek")) {
        message.reply('https://cdn140.picsart.com/298141702027211.png');
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

    try {
        guildMember.guild.channels.cache.get(statschannel).setName(`₊✦˚・MEMBERS: ${guildMember.guild.memberCount}`); 
    }
    catch (e) {
        console.log(e);
    }
})

client.on('guildMemberRemove', (guildMember) => {
    try {
        guildMember.guild.channels.cache.get(statschannel).setName(`₊✦˚・MEMBERS: ${guildMember.guild.memberCount}`);
    }
    catch (e) {
        console.log(e);
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
        }
        if(reaction.emoji.name === '2️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === '16+'));
        }
        if(reaction.emoji.name === '3️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === '18+'));
        } 

        if(reaction.emoji.name === '💙') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'male'));
        } 
        if(reaction.emoji.name === '💜') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'female'));
        }
        if(reaction.emoji.name === '🤍') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'other'));
        }

        if(reaction.emoji.name === '💫') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'he/him'));
        } 
        if(reaction.emoji.name === '⭐') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'she/her'));
        }
        if(reaction.emoji.name === '🌟') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'they/them'));
        }
        if(reaction.emoji.name === '✨') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'it/it'));
        }

        if(reaction.emoji.name === '💗') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'femboy'));
        } 
        if(reaction.emoji.name === '🖤') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'emo'));
        }
        if(reaction.emoji.name === '💪') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'gym bro'));
        }
        if(reaction.emoji.name === '🎮') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(reaction.message.guild.roles.cache.find(role => role.name === 'gamer'));
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
        }
        if(reaction.emoji.name === '2️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === '16+'));
        }
        if(reaction.emoji.name === '3️⃣') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === '18+'));
        } 
        
        if(reaction.emoji.name === '💙') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'male'));
        } 
        if(reaction.emoji.name === '💜') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'female'));
        }
        if(reaction.emoji.name === '🤍') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'other'));
        }

        if(reaction.emoji.name === '💫') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'he/him'));
        } 
        if(reaction.emoji.name === '⭐') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'she/her'));
        }
        if(reaction.emoji.name === '🌟') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'they/them'));
        }
        if(reaction.emoji.name === '✨') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'it/it'));
        }

        if(reaction.emoji.name === '💗') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'femboy'));
        } 
        if(reaction.emoji.name === '🖤') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'emo'));
        }
        if(reaction.emoji.name === '💪') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'gym bro'));
        }
        if(reaction.emoji.name === '🎮') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.find(role => role.name === 'gamer'));
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