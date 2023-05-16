const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('deletes a given number of messages')
        .addIntegerOption(option => option.setName('messages').setDescription('number of messages to delete').setRequired(true).setMaxValue(100).setMinValue(1))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const num = interaction.options.getInteger('messages');
		logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> used /clear ${num}\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interaction.member);

		const clearEmbed = new EmbedBuilder()
			.setColor(color.success)
			.setTitle('✅ **done**')
			.setDescription(`successfully deleted \`${num}\` messages`)
		try {
			await interaction.channel.bulkDelete(num);
			await interaction.reply({ embeds: [clearEmbed] });
			setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
		} catch {
			const clearEmbed = new EmbedBuilder()
				.setColor(color.warning)
				.setTitle('❗ **error**')
        		.setDescription(`failed to delete messages`)
			await interaction.reply({ embeds: [clearEmbed] });
			setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
		};
	},
};