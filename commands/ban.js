const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

const invalidMember= new EmbedBuilder()
    .setColor(color.warning)
    .setTitle(`**❗1 or more members are invalid**`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ban 1 or multiple users')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to ban').setRequired(true))
        .addUserOption(option => option.setName('member2').setDescription('name of user you want to ban'))
        .addUserOption(option => option.setName('member3').setDescription('name of user you want to ban'))
        .addUserOption(option => option.setName('member4').setDescription('name of user you want to ban'))
        .addStringOption(option => option.setName('reason').setDescription('provide a reason for the ban').setMaxLength(2000))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
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
        const description = `attempting to ban ${members.map(member => `\`${member.user.username}\``).join(' ')}`;

        const banembed = new EmbedBuilder()
            .setColor(color.defaultLog)
            .setDescription(description)
        await interaction.reply({ embeds: [banembed], ephemeral: true });

        const reason = interaction.options.getString('reason') ?? 'No reason provided.';

        const dmEmbed = new EmbedBuilder()
            .setColor(color.warning)
            .setTitle('❗ **you have been banned from cozy community**')
            .setDescription(`**Reason:** ${reason}`)
            .setTimestamp()

        members.forEach(async member => {
            if(member.bannable) {
                let dmEnabled = true;
                await member.send({ embeds: [dmEmbed] }).catch(() => dmEnabled = false); 
                await member.ban({ deleteMessageSeconds: 3600, reason: reason});
                if(!dmEnabled) {
                    logEx(color.warning, 'Ban Command Used', `<@${interaction.user.id}> banned <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interaction.member);
                } else {
                    logEx(color.warning, 'Ban Command Used', `<@${interaction.user.id}> banned <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interaction.member);
                };
                const banEmbed = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('✅ **done**')
                    .setDescription(`successfully banned \`${member.user.username}\``)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp()
    
                let message = await interaction.channel.send({ embeds: [banEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            } else {
                logEx(color.warning, 'Ban Command Failed', `<@${interaction.user.id}> tried to ban <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interaction.member);
                const banEmbed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **failed**')
                    .setDescription(`failed to ban \`${member.user.username}\``)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp()
    
                let message = await interaction.channel.send({ embeds: [banEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            };
        });
	},
};