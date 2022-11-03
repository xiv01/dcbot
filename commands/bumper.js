const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../util.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bumper')
		.setDescription('add / remove the bumper role'),
	async execute(interaction) {
        const member = interaction.member;;
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)

        let bumperRole = interaction.guild.roles.cache.find(role => role.name === 'bumper', interaction.guild);

        if(member.roles.cache.has(bumperRole.id)) {
            logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} removed the bumper role`);
            await member.roles.remove(bumperRole);

            const bumperembed = new EmbedBuilder()
                .setColor(0xf2c6ff)
                .setTitle('✅ **done**')
                .setDescription(`removed the bumper role for you`)
    
            await interaction.reply({ embeds: [bumperembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 12000);
        } else {
            logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} added the bumper role`);
            await member.roles.add(bumperRole);

            const bumperembed = new EmbedBuilder()
                .setColor(0xf2c6ff)
                .setTitle('✅ **done**')
                .setThumbnail('https://cdn.discordapp.com/attachments/826876081239752794/1035720297946550272/3x_7.gif')
                .setDescription(`added the bumper role for you\nthank you for supporting the server!!`)

            await interaction.reply({ embeds: [bumperembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 12000);
        }
	},
};