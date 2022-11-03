const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../util.js');

const helpembed = new EmbedBuilder()
    .setColor(0xf2c6ff)
    .setTitle('🛠️ **Help**')
    .setDescription('**/help**\n\`display commands summary\`\n\n**/bumper**\n\`add / remove the bumper role\`\n\n**/catpic & /capypic**\n\`posts a cat / capybara pic\`\n\n**/mute & /unmute [member]**\n\`un-mute a member\`\n\n**/clear [messages]**\n\`delete given amount of messages\`\n\n**/github**\n\`links to this bots public github repo\`\n\n**/ping**\n\`displays bot & api latency\`\n\n**/rules**\n\`post server rules\`\n\n**/server**\n\`displays server information\`\n\n**/penis**\n\`calculates your pp size\`\n\n**/howgay**\n\`calculates your gayness\`\n\n**/setuproles**\n\`setup self roles channel\`\n᲼')
	.setTimestamp()
	.setFooter({ text: 'developed by max#0135', iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/dd0279b8ee7a992c3c18db6b406d1151.png?size=32' });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('display help summary'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		
		logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} used /help`, interaction.guild);

		await interaction.reply({ embeds: [helpembed] });
	},
};