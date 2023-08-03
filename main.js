const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const { guildId, token, openaikey } = require('./config.json');
const { logEx, drawWelcomeImage, registerCommands } = require('./src/Util.js');
const { advancedLogging } = require('./src/Logging.js');
const { messageFiltering } = require('./src/MessageFiltering.js');
const { routines } = require('./src/Routines.js');
const { selfRoles } = require('./src/SelfRoles.js');
const { memberManager } = require('./src/MemberManager.js');
const { bumpReminder } = require('./src/BumpReminder.js');
const { chatAI } = require('./src/ChatAI.js');
const { polls } = require('./src/Polls.js');
const { interactionHandler } = require('./src/InteractionHandler.js');
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
    logEx(color.defaultLog, '⚙️ System', `bot started`, guild);
    registerCommands(guild, client);
    interactionHandler(client);
    drawWelcomeImage('testrender', guild); 
    routines(guild, client);
    advancedLogging(client);
    messageFiltering(client);
    selfRoles(client);
    memberManager(guild, client);
    bumpReminder(guild, client);
    polls(client);
    chatAI(guild, client);
});

client.login(token);