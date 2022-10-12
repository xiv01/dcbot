const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('bans a user')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to ban').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
        
        let date = new Date();
        console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${interactionUser.user.username}#${interactionUser.user.discriminator} banned @${member.user.username}#${member.user.discriminator}`);

        try {
            await member.ban();
            const banembed = new EmbedBuilder()
                .setColor(0x6bfa94)
                .setTitle('✅ **done**')
                .setDescription(`successfully banned \`${member.user.username}#${member.user.discriminator}\``)

            await interaction.reply({ embeds: [banembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        } catch {
            const banembed = new EmbedBuilder()
                .setColor(0xfc2332)
                .setTitle('❗ **error**')
                .setDescription(`unable to ban \`${member.user.username}#${member.user.discriminator}\``)

            await interaction.reply({ embeds: [banembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        }
	},
};