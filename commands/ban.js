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
        const members = [] 
        members.push(interaction.options.getMember('member'));
        var description = `attempting to ban \`\`${members[0].user.username}#${members[0].user.discriminator}\`\` `;
        for(var i = 2; i < 5; i++) {
            let member = interaction.options.getMember(`member${i}`)
            if(member != null) {
                members.push(member);
                description += `\`\`${member.user.username}#${member.user.discriminator}\`\` `;
            };
        };
        const banembed = new EmbedBuilder()
            .setColor(color.defaultLog)
            .setDescription(description)
        await interaction.reply({ embeds: [banembed], ephemeral: true });

        const reason = interaction.options.getString('reason') ?? 'No reason provided.';
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);   

        const dmembed = new EmbedBuilder()
            .setColor(color.warning)
            .setTitle('❗ **you have been banned from cozy community**')
            .setDescription(`**Reason:** ${reason}`)
            .setTimestamp()

        members.forEach(async member => {
            if(member.bannable) {
                let dmenabled = true;
                await member.send({ embeds: [dmembed] }).catch(() => dmenabled = false); 
                await member.ban({reason: reason});
                if(!dmenabled) {
                    logEx(color.warning, 'Ban Command Used', `<@${interactionUser.user.id}> banned <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interactionUser);
                } else {
                    logEx(color.warning, 'Ban Command Used', `<@${interactionUser.user.id}> banned <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
                };
                const banembed = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('✅ **done**')
                    .setDescription(`successfully banned \`${member.user.username}#${member.user.discriminator}\``)
                    .setFooter({ text: `${interactionUser.user.username}#${interactionUser.user.discriminator}`, iconURL: interactionUser.displayAvatarURL() })
                    .setTimestamp()
    
                let message = await interaction.channel.send({ embeds: [banembed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            } else {
                logEx(color.warning, 'Ban Command Failed', `<@${interactionUser.user.id}> tried to ban <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
                const banembed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **failed**')
                    .setDescription(`failed to ban \`${member.user.username}#${member.user.discriminator}\``)
                    .setFooter({ text: `${interactionUser.user.username}#${interactionUser.user.discriminator}`, iconURL: interactionUser.displayAvatarURL() })
                    .setTimestamp()
    
                let message = await interaction.channel.send({ embeds: [banembed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            };
        });
	},
};