const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('deletes a given number of messages')
        .addIntegerOption(option => option.setName('messages').setDescription('number of messages to delete').setRequired(true).setMaxValue(100).setMinValue(1))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const num = interaction.options.getInteger('messages');
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
		logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /clear ${num}\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

		clearembed = new EmbedBuilder()
			.setColor(color.success)
			.setTitle('✅ **done**')
			.setDescription(`successfully deleted \`${num}\` messages`)
		try {
			await interaction.channel.bulkDelete(num);
		}
		catch {
			clearembed = new EmbedBuilder()
				.setColor(color.warning)
				.setTitle('❗ **error**')
        		.setDescription(`failed to delete messages`)
			logEx('failed to delete ${')
		};
		await interaction.reply({ embeds: [clearembed] });
        setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
	},
};