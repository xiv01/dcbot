const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('bans a user')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('provide a reason for the ban').setMaxLength(2000))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided.';
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);   

        try {
            const dmembed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle('❗ **you have been banned from cozy community**')
                .setDescription(`**Reason:** ${reason}`)
                .setTimestamp()

            var dmenabled = true;
            await member.send({ embeds: [dmembed] }).catch(() => dmenabled = false); 
            await member.ban({reason: reason});
            if(!dmenabled) {
                logEx(color.warning, 'Ban Command Used', `<@${interactionUser.user.id}> banned <@${member.id}>\n**reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild);
            } else {
                logEx(color.warning, 'Ban Command Used', `<@${interactionUser.user.id}> banned <@${member.id}>\n**reason**: ${reason}`, interaction.guild);
            }
            const banembed = new EmbedBuilder()
                .setColor(color.success)
                .setTitle('✅ **done**')
                .setDescription(`successfully banned \`${member.user.username}#${member.user.discriminator}\``)

            await interaction.reply({ embeds: [banembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        } catch {
            const banembed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle('❗ **error**')
                .setDescription(`unable to ban \`${member.user.username}#${member.user.discriminator}\``)

            if(!dmenabled) {
                logEx(color.warning, 'Ban Command Failed', `<@${interactionUser.user.id}> tried to ban <@${member.id}>\n**reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild);
            } else {
                logEx(color.warning, 'Ban Command Failed', `<@${interactionUser.user.id}> tried to ban <@${member.id}>\n**reason**: ${reason}`, interaction.guild);
            }
            await interaction.reply({ embeds: [banembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        }
	},
};