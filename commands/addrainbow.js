const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

const invalidMember= new EmbedBuilder()
    .setColor(color.warning)
    .setTitle(`**❗member is invalid**`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrainbow')
		.setDescription('add rainbow role to user')
        .addUserOption(option => option.setName('member').setDescription('user').setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client) {
		const member = interaction.options.getMember('member');
		if(typeof member === 'undefined') { 
            await interaction.reply({ embeds: [invalidMember] });
            return;
        };

		if(client.rainbowRole.includes(member.id)) {
			logEx(color.commandLog, '📲 Command Used', `<@${interaction.id}> tried to add the rainbow role to <@${member.id}>`, interaction.guild, interaction.member);
			const embed = new EmbedBuilder()
				.setColor(color.warning)
				.setTitle('❗ **error**')
				.setDescription(`\`${member.displayName}\` does already have the rainbow role`)

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} else {
			logEx(color.commandLog, '📲 Command Used', `<@${interaction.id}> added the rainbow role to <@${member.id}>`, interaction.guild, interaction.member);
			client.rainbowRole.push(member.id);
			const embed = new EmbedBuilder()
				.setColor(color.success)
				.setTitle('✅ **done**')
				.setDescription(`added rainbow role to \`${member.displayName}\``)
	
			await interaction.reply({ embeds: [embed], ephemeral: true });
		};
	},
};