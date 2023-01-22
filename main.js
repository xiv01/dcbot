const { Client, GatewayIntentBits, ActivityType, Partials } = require('discord.js');
const { guildId, token, activities, rainbowrole, rainbowroles } = require('./config.json');
const { setIntervalAsync } = require('set-interval-async');
const { logEx, drawWelcomeImage, registerCommands } = require('./Util.js');
const { advancedLogging } = require('./Logging.js');
const { messageFiltering } = require('./MessageFiltering.js');
const { selfRoles } = require('./SelfRoles.js');
const { memberManager } = require('./MemberManager.js');
const { bumpReminder } = require('./BumpReminder.js');
const color = require('./colors.json');

const client = new Client({ 
    intents: 
    [GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildBans, 
    GatewayIntentBits.GuildMessageReactions,  
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildVoiceStates
    ],
    partials: 
    [
    Partials.Message, 
    Partials.Channel, 
    Partials.Reaction
    ],
});

client.once('ready', async () => {
    const guild = client.guilds.cache.get(guildId);
    logEx(color.defaultLog, '⚙️ System', `bot started\n**latest commit** -> ${require('child_process').execSync('git rev-parse --short HEAD').toString().trim()}`, guild);
    drawWelcomeImage('testrender', guild); // ghetto fix 
    registerCommands(guild, client);

    advancedLogging(client);
    messageFiltering(client);
    selfRoles(client);
    memberManager(client);
    bumpReminder(client);

    var roles = [];
    for(var i = 0; i < rainbowroles.length; i++) {
        roles.push(guild.roles.cache.find(role => role.id === rainbowroles[i]));
    };

    let currentIndex = 0;
    setInterval(() => {
        client.user.setActivity(activities[currentIndex], { type: ActivityType.Watching });
        currentIndex = currentIndex >= activities.length - 1 
            ? 0
            : currentIndex + 1;
    }, 5000);

    let currentIndex2 = 0;
    setIntervalAsync(async () => {
        for(var i = 0; i < rainbowrole.length; i++) {
            await guild.members.fetch(rainbowrole[i]).then(async member => {
                let highest = member.roles.highest
                if(highest.name != "rainbow") {
                    await member.roles.add(roles[Math.floor(Math.random() * roles.length)]); 
                    return;
                }
                await member.roles.add(roles[currentIndex2]);
                await member.roles.remove(highest);
            }).catch(console.error)
        };
        currentIndex2 = currentIndex2 >= roles.length - 1 
            ? 0
            : currentIndex2 + 1;
    }, 11000);
});

client.on('interactionCreate', async interaction => {
	if(!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if(!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'there was an error while executing this command :(', ephemeral: true });
	};
});

client.login(token);