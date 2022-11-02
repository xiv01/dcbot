const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, ActivityType, Partials, EmbedBuilder } = require('discord.js');
const { guildId, token, activities, statschannel, welcomechannel, standardRoleName, suggestionchannel, roleschannel, badwords, bumpchannel, rainbowrole, rainbowroles, selfroles } = require('./config.json');
const { setIntervalAsync } = require('set-interval-async');
const { logEx, newColor, drawWelcomeImage } = require('./util.js');

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
    logEx("bot started");

    let currentIndex = 0;
    setInterval(() => {
      const activity = activities[currentIndex];
      client.user.setActivity(activity, { type: ActivityType.Watching });
  
      currentIndex = currentIndex >= activities.length - 1 
        ? 0
        : currentIndex + 1;
    }, 5000);

    const guild = client.guilds.cache.get(guildId);
    var roles = [];
    
    for(var i = 0; i < rainbowroles.length; i++) {
        roles.push(guild.roles.cache.find(role => role.id === rainbowroles[i]))
    }

    setIntervalAsync(async () => {
        for(var i = 0; i < rainbowrole.length; i++) {
            await newColor(rainbowrole[i], roles, guild)
        }
    }, 10000);
});

client.on('messageCreate', async message => {
    let bumped = false;
    // TODO: dont break when bot is restarted
    if(message.channelId === bumpchannel) {
        if(message.embeds.length > 0) {
            if(message.embeds[0].description != null) {
                if((message.embeds[0].description.includes("Bump erfolgreich!") || message.embeds[0].description.includes("Bump done!")) && !bumped) {
                    bumped = true;
                    logEx('server bumped');
                    const pingRole = message.guild.roles.cache.find(role => role.name === 'bumper');
                    setTimeout(() => { 
                        message.channel.send(`${pingRole} bumpt ihr loser`);
                        bumped = false;
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
            logEx(`deleted message from ${message.member.user.username}#${message.member.user.discriminator} content: ${content}`); 
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
        logEx(`deleted invite link from ${message.member.user.username}#${message.member.user.discriminator}`);
        const inviteembed = new EmbedBuilder()
            .setColor(0xfc2332)
            .setTitle('❗ **invite link deleted**')
            .setDescription(`\`${message.member.user.username}#${message.member.user.discriminator}\` tried to post an invite link and got muted 🤡`)

        let warning = await message.channel.send({ embeds: [inviteembed] });
        setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
    }

    if(content.includes("shrek")) {
        switch(Math.floor(Math.random() * 15) + 1) {
            case 1:
                await message.reply('https://cdn140.picsart.com/298141702027211.png');
                break;
            case 2:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037261342014447637/f2017f595b5c02a5049ea9b30acdd948.jpg');
                break;
            case 3:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037261341834100777/3bd4b1a8e7f1a139e1784c084a045ee4.jpg');
                break;
            case 4:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037261147402944602/5b6cb262e7ac3b01040762e4da468ffb.jpg');
                break;
            case 5:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037261007367712778/399425c53840b8b7d583cc7792e020fb.jpg');
                break;
            case 6:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260867458301995/12d6e1ce98f4fd77e35addab22dcb784.jpg');
                break;
            case 7:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260867231817759/5088dc5a21bd9791e34f557e4d2e3568.jpg');
                break;
            case 8:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260866967580702/601c0ca349b3c229917b8b16612acf6a.jpg');
                break;
            case 9:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260866573303818/177b4459eec137ae4865ba44a1089246.jpg');
                break;
            case 10:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260841340375050/a701b416f376c51673ffe421d2b2d7b0.jpg');
                break;
            case 11:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260841080340520/34fa091225dcc2a5910e0226d82b5fc5.jpg');
                break;
            case 12:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260840816095262/6abbb008e43ba05e4ec6c77dfb97a9c2.jpg');
                break;
            case 13:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260811741179944/09817db493156d8d76d11e29cffc1b33.jpg');
                break;
            case 14:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260811384668201/8d3c48dafd0558bc7eb58addc36d35ec.jpg');
                break;
            case 15:
                await message.reply('https://cdn.discordapp.com/attachments/1037260765809348649/1037260810965221406/9291aaf3e0ef4c21829cf5597cf65771.jpg');
                break;
        }
    }

    if(content.includes(":catvibe:")) {
        await message.reply({ files: ['./images/resources/catvibe.gif']});
    }

    if(message.channelId === suggestionchannel) {
        await message.react('✅');
        await message.react('❌');
        logEx(`${message.member.user.username}#${message.member.user.discriminator} posted suggestion: ${content}`);
    }
}) 

client.on('guildMemberAdd', async (member) => {
    let standardRole = member.guild.roles.cache.find(role => role.name === standardRoleName);

    await member.roles.add(standardRole);
    member.guild.channels.cache.get(welcomechannel).send({ files: [await drawWelcomeImage(member)]});
    logEx(`${member.user.username}#${member.user.discriminator} joined the server`);

    try {
        member.guild.channels.cache.get(statschannel).setName(`₊✦˚・members: ${member.guild.memberCount}`); 
    }
    catch (error) {
        console.error(error);
    }
})

client.on('guildMemberRemove', (member) => {
    logEx(`${member.user.username}#${member.user.discriminator} left the server`);

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
                logEx(`${member.username}#${member.discriminator} added self role: ${selfroles[i][1]}`)
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
                logEx(`${member.username}#${member.discriminator} removed self role: ${selfroles[i][1]}`)
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