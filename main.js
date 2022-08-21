const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { token } = require('./token.json');

// ------- edit these -------
const activities = ['max = boss', 'ur mom', 'ok', ':heart:'];
const statschannel = '1010733066408431666';
const welcomechannel = '1010681847837110422';
const standardRoleName = 'normal';
// --------------------------

const client = new Client({ 
    intents: 
    [GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildBans, 
    GatewayIntentBits.GuildMessageReactions,  
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildVoiceStates
]});

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

client.on('messageCreate', message => {
    if(message.author.bot) return;
    content = message.content.toLowerCase();

    if(content.includes("shrek")) {
        message.reply('https://cdn140.picsart.com/298141702027211.png');
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