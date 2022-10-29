const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../util.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kicks a user')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to kick').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)

        try {
            await member.kick();
            const kickembed = new EmbedBuilder()
                .setColor(0x6bfa94)
                .setTitle('✅ **done**')
                .setDescription(`successfully kicked \`${member.user.username}#${member.user.discriminator}\``)

            logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} kicked @${member.user.username}#${member.user.discriminator}`);
            await interaction.reply({ embeds: [kickembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        } catch {
            const kickembed = new EmbedBuilder()
                .setColor(0xfc2332)
                .setTitle('❗ **error**')
                .setDescription(`unable to kick \`${member.user.username}#${member.user.discriminator}\``)

            logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} tried to kick @${member.user.username}#${member.user.discriminator}`);
            await interaction.reply({ embeds: [kickembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        }
	},
};