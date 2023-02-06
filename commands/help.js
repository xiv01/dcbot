const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

const helpembed = new EmbedBuilder()
    .setColor(color.pink)
    .setTitle('🛠️ **Help**')
    .setDescription('**/help**\n\`\`display commands summary\`\`\n\n**/bumper**\n\`\`add / remove the bumper role\`\`\n\n**/catpic & /capypic**\n\`\`posts a cat / capybara pic\`\`\n\n**/avatar [member]**\n\`\`display a members avatar\`\`\n\n**/banner [member]**\n\`\`display a members banner\`\`\n\n**/jail & /unjailed [member]**\n\`\`un-jail a member\`\`\n\n**/clear [messages]**\n\`\`delete given amount of messages\`\`\n\n**/github**\n\`\`links to this bots public github repo\`\`\n\n**/ping**\n\`\`displays bot & api latency\`\`\n\n**/rules**\n\`\`post server rules\`\`\n\n**/server**\n\`\`displays server information\`\`\n\n**/penis**\n\`\`calculates your pp size\`\`\n\n**/howgay**\n\`\`calculates your gayness\`\`\n\n**/setuproles**\n\`\`setup self roles channel\`\`\n᲼')
	.setTimestamp()
	.setFooter({ text: 'developed by max#0135', iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/4b00003de1780fcf41b50c2b41249811.webp?size=32' });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('display help summary'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
		logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /help\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);
		
		await interaction.reply({ embeds: [helpembed] });
	},
};