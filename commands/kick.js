const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kicks a user')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('provide a reason for the kick').setMaxLength(2000))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided.';
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);

        try {
            const dmembed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle('❗ **you have been kicked from cozy community**')
                .setDescription(`**Reason:** ${reason}`)
                .setTimestamp()

            var dmenabled = true;
            await member.send({ embeds: [dmembed] }).catch(() => dmenabled = false); 
            await member.kick();
            if(!dmenabled) {
                logEx(color.warning, 'Kick Command Used', `<@${interactionUser.user.id}> kicked <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interactionUser);
            } else {
                logEx(color.warning, 'Kick Command Used', `<@${interactionUser.user.id}> kicked <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
            }
            const kickembed = new EmbedBuilder()
                .setColor(color.success)
                .setTitle('✅ **done**')
                .setDescription(`successfully kicked \`${member.user.username}#${member.user.discriminator}\``)

            logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} kicked ${member.user.username}#${member.user.discriminator}`, interaction.guild);
            await interaction.reply({ embeds: [kickembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        } catch {
            const kickembed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle('❗ **error**')
                .setDescription(`unable to kick \`${member.user.username}#${member.user.discriminator}\``)

                if(!dmenabled) {
                    logEx(color.warning, 'Kick Command Failed', `<@${interactionUser.user.id}> tried to kick <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interactionUser);
                } else {
                    logEx(color.warning, 'Kick Command Failed', `<@${interactionUser.user.id}> tried to kick <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
                }
            await interaction.reply({ embeds: [kickembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        };
	},
};