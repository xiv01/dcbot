const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removerainbow')
		.setDescription('remove rainbow role from user')
        .addUserOption(option => option.setName('member').setDescription('user').setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
		const member = interaction.options.getMember('member');

		if(!client.rainbowRole.includes(member.id)) {
			logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> tried to remove the rainbow role from <@${member.id}>`, interaction.guild, interactionUser);
			const embed = new EmbedBuilder()
				.setColor(color.warning)
				.setTitle('❗ **error**')
				.setDescription(`\`${member.displayName}\` does not currently have the rainbow role`)

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} else {
			logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> removed the rainbow role from <@${member.id}>`, interaction.guild, interactionUser);
			client.rainbowRole = client.rainbowRole.filter(e => e !== member.id);
			if(member.roles.highest.name === 'rainbow') {
				await member.roles.remove(member.roles.highest);
			};
			const embed = new EmbedBuilder()
				.setColor(color.success)
				.setTitle('✅ **done**')
				.setDescription(`removed rainbow role from \`${member.displayName}\``)
	
			await interaction.reply({ embeds: [embed], ephemeral: true });
		};
	},
};