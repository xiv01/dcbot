const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../src/Util.js');
const { mutedRoleName, jailVCChannel } = require('../config.json');
const color = require('../colors.json');

const invalidMember= new EmbedBuilder()
    .setColor(color.warning)
    .setTitle(`**❗Members are invalid**`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jail')
		.setDescription('jail 1 or multiple users')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to jail').setRequired(true))
        .addUserOption(option => option.setName('member2').setDescription('name of user you want to jail'))
        .addUserOption(option => option.setName('member3').setDescription('name of user you want to jail'))
        .addUserOption(option => option.setName('member4').setDescription('name of user you want to jail'))
        .addStringOption(option => option.setName('reason').setDescription('provide a reason for the jail').setMaxLength(2000))
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
        const description = `attempting to jail ${members.map(member => `\`${member.user.username}\``).join(' ')}`;

        const muteEmbed = new EmbedBuilder()
            .setColor(color.defaultLog)
            .setDescription(description)
        await interaction.reply({ embeds: [muteEmbed], ephemeral: true });

        let mutedRole = interaction.guild.roles.cache.find(role => role.name === mutedRoleName);
        const reason = interaction.options.getString('reason') ?? 'No reason provided.';

        members.forEach(async member => {
            if(member.roles.cache.has(mutedRole.id)) {
                const muteEmbed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **info**')
                    .setDescription(`\`${member.user.username}\` is already jailed`)
                    .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })

                logEx(color.warning, 'Jail Command Used', `<@${interaction.user.id}> tried to jail <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interaction.member);
                let message = await interaction.channel.send({ embeds: [muteEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            } else {
                const dmEmbed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **you have been jailed on cozy community**')
                    .setDescription(`**Reason:** ${reason}`)
                    .setTimestamp()

                let dmEnabled = true;
                await member.send({ embeds: [dmEmbed] }).catch(() => dmEnabled = false); 
                await member.roles.add(mutedRole);
                if(member.voice.channel) await member.voice.setChannel(member.guild.channels.cache.get(jailVCChannel)); 
                const muteEmbed = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('✅ **done**')
                    .setDescription(`successfully jailed \`${member.user.username}\``)
                    .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        
                if(!dmEnabled) {
                    logEx(color.warning, 'Jail Command Used', `<@${interaction.user.id}> jailed <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interaction.member);
                } else {
                    logEx(color.warning, 'Jail Command Used', `<@${interaction.user.id}> jailed <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interaction.member);
                }
                let message = await interaction.channel.send({ embeds: [muteEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            };
        });
	},
};