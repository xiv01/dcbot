const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ipresolve')
        .addUserOption(option => option.setName('member').setDescription('victim').setRequired(true))
		.setDescription('resolve a users 100% real ip adress'),
	async execute(interaction) {
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
		const user = interaction.options.getUser('member');
		logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /resolveip <@${user.id}>`, interaction.guild, interactionUser);

        let ip = Math.floor((Math.random() * 254) + 1) + '.' + Math.floor((Math.random() * 254) + 1) + '.' + Math.floor((Math.random() * 254) + 1) + '.' + Math.floor((Math.random() * 254) + 1);
		const ipEmbed  = new EmbedBuilder()
			.setColor(color.defaultLog)
			.setTitle('IP Resolver')
			.setDescription(`**${user.tag}'s** IP adress is \`${ip}\``)
		await interaction.reply({ embeds: [ipEmbed] });
	},
};