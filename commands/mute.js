const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../util.js');
const { mutedRoleName } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('mutes a user')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to mute').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
    
        logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} muted @${member.user.username}#${member.user.discriminator}`, interaction.guild);

        let mutedRole = interaction.guild.roles.cache.find(role => role.name === mutedRoleName);

        if(member.roles.cache.has(mutedRole.id)) {
            const muteembed = new EmbedBuilder()
                .setColor(0xfc2332)
                .setTitle('❗ **error**')
                .setDescription(`\`${member.user.username}#${member.user.discriminator}\` is already muted`)

            await interaction.reply({ embeds: [muteembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        } else {
            await member.roles.add(mutedRole);
            if (member.voice.channel) {
                await member.voice.setMute(true);
            }
            const muteembed = new EmbedBuilder()
                .setColor(0x6bfa94)
                .setTitle('✅ **done**')
                .setDescription(`successfully muted \`${member.user.username}#${member.user.discriminator}\``)
    
            await interaction.reply({ embeds: [muteembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        }
	},
};