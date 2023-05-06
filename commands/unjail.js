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
                members.push(option.member);
            };
        });
        const description = `attempting to unjail ${members.map(member => `\`${member.user.username}#${member.user.discriminator}\``).join(' ')}`;

        const unmuteEmbed = new EmbedBuilder()
            .setColor(color.defaultLog)
            .setDescription(description)
        await interaction.reply({ embeds: [unmuteEmbed], ephemeral: true });

        let mutedRole = interaction.guild.roles.cache.find(role => role.name === mutedRoleName);
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);   

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
                    logEx(color.success, 'UnJail Command Used', `<@${interactionUser.id}> unjailed <@${member.id}>\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interactionUser);
                } else {
                    logEx(color.success, 'UnJail Command Used', `<@${interactionUser.id}> unjailed <@${member.id}>`, interaction.guild, interactionUser);
                }
                const unmuteEmbed = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('✅ **done**')
                    .setDescription(`successfully unjailed \`${member.user.username}#${member.user.discriminator}\``)
        
                let message = await interaction.channel.send({ embeds: [unmuteEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            } else {
                const unmuteEmbed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **error**')
                    .setDescription(`\`${member.user.username}#${member.user.discriminator}\` is not jailed`)
    
                logEx(color.warning, 'UnJail Command Used', `<@${interactionUser.id}> tried to unjail <@${member.id}>`, interaction.guild, interactionUser);
                let message = await interaction.channel.send({ embeds: [unmuteEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            };
        });
	},
};