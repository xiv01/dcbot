const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const { guildId, token, chatAIToggle, openaikey } = require('./config.json');
const { logEx, drawWelcomeImage, registerCommands } = require('./src/Util.js');
const { advancedLogging } = require('./src/Logging.js');
const { messageFiltering } = require('./src/MessageFiltering.js');
const { routines } = require('./src/Routines.js');
const { selfRoles } = require('./src/SelfRoles.js');
const { memberManager } = require('./src/MemberManager.js');
const { bumpReminder } = require('./src/BumpReminder.js');
const { chatAI } = require('./src/ChatAI.js');
const color = require('./colors.json');

const client = new Client({ 
    intents: 
    [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessageReactions, 
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildVoiceStates
    ],
    partials: 
    [
    Partials.Message, 
    Partials.Channel, 
    Partials.Reaction,
    Partials.GuildMember
    ],
});

const configuration = new Configuration({
    apiKey: openaikey,
});

client.openAI = new OpenAIApi(configuration);

client.once('ready', async () => {
    const guild = client.guilds.cache.get(guildId);
    logEx(color.defaultLog, '⚙️ System', `bot started\n**latest commit** -> ${require('child_process').execSync('git rev-parse --short HEAD').toString().trim()}`, guild);
    
    drawWelcomeImage('testrender', guild); 
    routines(guild, client);
    registerCommands(guild, client);
    advancedLogging(client);
    messageFiltering(client);
    selfRoles(client);
    memberManager(client);
    bumpReminder(client);
    if(chatAIToggle) chatAI(guild, client);
});

client.on('interactionCreate', async interaction => {
	if(!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if(!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'there was an error while executing this command :(', ephemeral: true });
	};
});

client.login(token);