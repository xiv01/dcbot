const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kicks 1 or multiple users')
        .addUserOption(option => option.setName('member').setDescription('name of user you want to kick').setRequired(true))
        .addUserOption(option => option.setName('member2').setDescription('name of user you want to kick'))
        .addUserOption(option => option.setName('member3').setDescription('name of user you want to kick'))
        .addUserOption(option => option.setName('member4').setDescription('name of user you want to kick'))
        .addStringOption(option => option.setName('reason').setDescription('provide a reason for the kick').setMaxLength(2000))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
        const members = [];
        interaction.options.data.forEach(option => {
            if (option.type === 6) {
                members.push(option.member);
            };
        });
        const description = `attempting to kick ${members.map(member => `\`\`${member.user.username}#${member.user.discriminator}\`\``).join(' ')}`;
        
        const kickEmbed = new EmbedBuilder()
            .setColor(color.defaultLog)
            .setDescription(description)
        await interaction.reply({ embeds: [kickEmbed], ephemeral: true });

        const reason = interaction.options.getString('reason') ?? 'No reason provided.';
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);   

        const dmEmbed = new EmbedBuilder()
            .setColor(color.warning)
            .setTitle('❗ **you have been kicked from cozy community**')
            .setDescription(`**Reason:** ${reason}`)
            .setTimestamp()

        members.forEach(async member => {
            if(member.kickable) {
                let dmEnabled = true;
                await member.send({ embeds: [dmEmbed] }).catch(() => dmEnabled = false); 
                await member.kick();
                if(!dmEnabled) {
                    logEx(color.warning, 'Kick Command Used', `<@${interactionUser.user.id}> kicked <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interactionUser);
                } else {
                    logEx(color.warning, 'Kick Command Used', `<@${interactionUser.user.id}> kicked <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
                };
                const kickEmbed = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('✅ **done**')
                    .setDescription(`successfully kicked \`${member.user.username}#${member.user.discriminator}\``)
                    .setFooter({ text: `${interactionUser.user.username}#${interactionUser.user.discriminator}`, iconURL: interactionUser.displayAvatarURL() })
                    .setTimestamp()
    
                let message = await interaction.channel.send({ embeds: [kickEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            } else {
                logEx(color.warning, 'Kick Command Failed', `<@${interactionUser.user.id}> tried to kick <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
                const kickEmbed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **failed**')
                    .setDescription(`failed to kick \`${member.user.username}#${member.user.discriminator}\``)
                    .setFooter({ text: `${interactionUser.user.username}#${interactionUser.user.discriminator}`, iconURL: interactionUser.displayAvatarURL() })
                    .setTimestamp()
    
                let message = await interaction.channel.send({ embeds: [kickEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            };
        });
	},
};