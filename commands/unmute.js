const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const { mutedRoleName } = require('../config.json');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('unmutes a user')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to unmute').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const member = interaction.options.getMember('member');
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);

        let mutedRole = interaction.guild.roles.cache.find(role => role.name === mutedRoleName);

        if(member.roles.cache.has(mutedRole.id)) {
            const dmembed = new EmbedBuilder()
                .setColor(color.success)
                .setTitle('✅ **you have been unmuted on cozy community**')
                .setDescription(`u can talk again :)`)
                .setTimestamp()

            let dmenabled = false;
            await member.send({ embeds: [dmembed] }).catch(() => dmenabled = false); 
            await member.roles.remove(mutedRole);
            if(!dmenabled) {
                logEx(color.success, 'Mute Command Used', `<@${interactionUser.id}> unmuted <@${member.id}>\n\n❗ unable to send DM due to users privacy settings`, interaction.guild);
            } else {
                logEx(color.success, 'Mute Command Used', `<@${interactionUser.id}> unmuted <@${member.id}>`, interaction.guild);
            }
            const unmuteembed = new EmbedBuilder()
                .setColor(color.success)
                .setTitle('✅ **done**')
                .setDescription(`successfully unmuted \`${member.user.username}#${member.user.discriminator}\``)
    
            await interaction.reply({ embeds: [unmuteembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        } else {
            const unmuteembed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle('❗ **error**')
                .setDescription(`\`${member.user.username}#${member.user.discriminator}\` is not muted`)

            logEx(color.warning, 'Mute Command Used', `<@${interactionUser.id}> tried to mute <@${member.id}>`, interaction.guild);
            await interaction.reply({ embeds: [unmuteembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        };
	},
};