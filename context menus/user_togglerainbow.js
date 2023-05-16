const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

module.exports = {
    data: new ContextMenuCommandBuilder()
    	.setName('toggle rainbow role')
    	.setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const member = interaction.targetMember;
		if(typeof member === 'undefined') { 
            await interaction.reply({ embeds: [invalidMember] });
            return;
        };

		if(client.rainbowRole.includes(member.id)) {
			logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> removed the rainbow role from <@${member.id}>`, interaction.guild, interaction.member);
			client.rainbowRole = client.rainbowRole.filter(e => e !== member.id);
			if(member.roles.highest.name === 'rainbow') {
				await member.roles.remove(member.roles.highest);
			};
			const embed = new EmbedBuilder()
				.setColor(color.success)
				.setTitle('✅ **done**')
				.setDescription(`removed rainbow role from \`${member.displayName}\``)
	
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