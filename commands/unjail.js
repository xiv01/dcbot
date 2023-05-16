const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../src/Util.js');
const { mutedRoleName } = require('../config.json');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unjail')
		.setDescription('unjail 1 or multiple users')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to unjail').setRequired(true))
        .addUserOption(option => option.setName('member2').setDescription('name of user you want to unjail'))
        .addUserOption(option => option.setName('member3').setDescription('name of user you want to unjail'))
        .addUserOption(option => option.setName('member4').setDescription('name of user you want to unjail'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
        const members = [];
        interaction.options.data.forEach(option => {
            if (option.type === 6) {
                if(!(typeof option.member === 'undefined')) { 
                    members.push(option.member);
                };
            };
        });

        if(members.length <= 0) {
            await interaction.reply({ embeds: [invalidMember] });
            return;
        };
        const description = `attempting to unjail ${members.map(member => `\`${member.user.tag}\``).join(' ')}`;

        const unmuteEmbed = new EmbedBuilder()
            .setColor(color.defaultLog)
            .setDescription(description)
        await interaction.reply({ embeds: [unmuteEmbed], ephemeral: true });

        let mutedRole = interaction.guild.roles.cache.find(role => role.name === mutedRoleName);

        members.forEach(async member => {
            if(member.roles.cache.has(mutedRole.id)) {
                const dmEmbed = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('**you have been unjailed on cozy community**')
                    .setDescription(`you can talk again :)`)
                    .setTimestamp()
    
                let dmEnabled = true;
                await member.send({ embeds: [dmEmbed] }).catch(() => dmEnabled = false); 
                await member.roles.remove(mutedRole);
                if(!dmEnabled) {
                    logEx(color.success, 'UnJail Command Used', `<@${interaction.user.id}> unjailed <@${member.id}>\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interaction.member);
                } else {
                    logEx(color.success, 'UnJail Command Used', `<@${interaction.user.id}> unjailed <@${member.id}>`, interaction.guild, interaction.member);
                }
                const unmuteEmbed = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('✅ **done**')
                    .setDescription(`successfully unjailed \`${member.user.tag}\``)
                    .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        
                let message = await interaction.channel.send({ embeds: [unmuteEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            } else {
                const unmuteEmbed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **error**')
                    .setDescription(`\`${member.user.tag}\` is not jailed`)
                    .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    
                logEx(color.warning, 'UnJail Command Used', `<@${interaction.user.id}> tried to unjail <@${member.id}>`, interaction.guild, interaction.member);
                let message = await interaction.channel.send({ embeds: [unmuteEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            };
        });
	},
};