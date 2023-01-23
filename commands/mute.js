const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const { mutedRoleName } = require('../config.json');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('mutes a user')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to mute').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('provide a reason for the mute').setMaxLength(2000))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'No reason provided.';
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);

        let mutedRole = interaction.guild.roles.cache.find(role => role.name === mutedRoleName);

        if(member.roles.cache.has(mutedRole.id)) {
            const muteembed = new EmbedBuilder()
                .setColor(color.success)
                .setTitle('❗ **error**')
                .setDescription(`\`${member.user.username}#${member.user.discriminator}\` is already muted`)

            logEx(color.warning, 'Mute Command Used', `<@${interactionUser.id}> tried to mute <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
            await interaction.reply({ embeds: [muteembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        } else {
            const dmembed = new EmbedBuilder()
                .setColor(color.success)
                .setTitle('❗ **you have been muted on cozy community**')
                .setDescription(`**Reason:** ${reason} \n\ndm a staff member to get unmuted.`)
                .setTimestamp()

            let dmenabled = true;
            await member.send({ embeds: [dmembed] }).catch(() => dmenabled = false); 
            await member.roles.add(mutedRole);
            if (member.voice.channel) {
                await member.voice.disconnect();
            };
            const muteembed = new EmbedBuilder()
                .setColor(color.success)
                .setTitle('✅ **done**')
                .setDescription(`successfully muted \`${member.user.username}#${member.user.discriminator}\``)
    
            if(!dmenabled) {
                logEx(color.warning, 'Mute Command Used', `<@${interactionUser.id}> muted <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interactionUser);
            } else {
                logEx(color.warning, 'Mute Command Used', `<@${interactionUser.id}> muted <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
            }
            await interaction.reply({ embeds: [muteembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        };
	},
};