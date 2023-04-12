const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrainbow')
		.setDescription('add rainbow role for user')
        .addUserOption(option => option.setName('member').setDescription('user').setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
		const member = interaction.options.getMember('member');

		if(client.rainbowRole.includes(member.id)) {
			logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> tried to add the rainbow role to <@${member.id}>`, interaction.guild, interactionUser);
			const embed = new EmbedBuilder()
				.setColor(color.warning)
				.setTitle('❗ **error**')
				.setDescription(`\`${member.displayName}\` does already have the rainbow role`)

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} else {
			logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> added the rainbow role to <@${member.id}>`, interaction.guild, interactionUser);
			client.rainbowRole.push(member.id);
			const embed = new EmbedBuilder()
				.setColor(color.success)
				.setTitle('✅ **done**')
				.setDescription(`added rainbow role to \`${member.displayName}\``)
	
			await interaction.reply({ embeds: [embed], ephemeral: true });
		};
	},
};