const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('bans 1 or multiple users')
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
                members.push(option.member);
            };
        });
        const description = `attempting to ban ${members.map(member => `\`\`${member.user.username}#${member.user.discriminator}\`\``).join(' ')}`;

        const banembed = new EmbedBuilder()
            .setColor(color.defaultLog)
            .setDescription(description)
        await interaction.reply({ embeds: [banembed], ephemeral: true });

        const reason = interaction.options.getString('reason') ?? 'No reason provided.';
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);   

        const dmEmbed = new EmbedBuilder()
            .setColor(color.warning)
            .setTitle('❗ **you have been banned from cozy community**')
            .setDescription(`**Reason:** ${reason}`)
            .setTimestamp()

        members.forEach(async member => {
            if(member.bannable) {
                let dmEnabled = true;
                await member.send({ embeds: [dmEmbed] }).catch(() => dmEnabled = false); 
                await member.ban({reason: reason});
                if(!dmEnabled) {
                    logEx(color.warning, 'Ban Command Used', `<@${interactionUser.user.id}> banned <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interactionUser);
                } else {
                    logEx(color.warning, 'Ban Command Used', `<@${interactionUser.user.id}> banned <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
                };
                const banEmbed = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('✅ **done**')
                    .setDescription(`successfully banned \`${member.user.username}#${member.user.discriminator}\``)
                    .setFooter({ text: `${interactionUser.user.username}#${interactionUser.user.discriminator}`, iconURL: interactionUser.displayAvatarURL() })
                    .setTimestamp()
    
                let message = await interaction.channel.send({ embeds: [banEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            } else {
                logEx(color.warning, 'Ban Command Failed', `<@${interactionUser.user.id}> tried to ban <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
                const banEmbed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **failed**')
                    .setDescription(`failed to ban \`${member.user.username}#${member.user.discriminator}\``)
                    .setFooter({ text: `${interactionUser.user.username}#${interactionUser.user.discriminator}`, iconURL: interactionUser.displayAvatarURL() })
                    .setTimestamp()
    
                let message = await interaction.channel.send({ embeds: [banEmbed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            };
        });
	},
};