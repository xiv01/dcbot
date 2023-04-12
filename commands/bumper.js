const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const { bumperRoleName } = require('../config.json');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bumper')
		.setDescription('add / remove the bumper role'),
	async execute(interaction) {
        await interaction.deferReply();
        const member = interaction.member;
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);

        const bumperRole = interaction.guild.roles.cache.find(role => role.name === bumperRoleName, interaction.guild);

        if(member.roles.cache.has(bumperRole.id)) {
            logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> removed the bumper role`, interaction.guild, interactionUser);
            await member.roles.remove(bumperRole);

            const bumperEmbed = new EmbedBuilder()
                .setColor(color.pink)
                .setTitle('✅ **done**')
                .setDescription(`removed the bumper role for you`)
    
            await interaction.editReply({ embeds: [bumperEmbed]});
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 5000);
        } else {
            logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> added the bumper role`, interaction.guild, interactionUser);
            await member.roles.add(bumperRole);

            const bumperEmbed = new EmbedBuilder()
                .setColor(color.pink)
                .setTitle('✅ **done**')
                .setDescription(`added the bumper role for you\nthank you for supporting the server!!`)

            await interaction.editReply({ embeds: [bumperEmbed]});
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 5000);
        };
	},
};