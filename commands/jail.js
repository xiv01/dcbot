const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const { mutedRoleName } = require('../config.json');
const color = require('../colors.json');

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
        const members = [] 
        members.push(interaction.options.getMember('member'));
        var description = `attempting to jail \`\`${members[0].user.username}#${members[0].user.discriminator}\`\` `;
        for(var i = 2; i < 5; i++) {
            let member = interaction.options.getMember(`member${i}`)
            if(member != null) {
                members.push(member);
                description += `\`\`${member.user.username}#${member.user.discriminator}\`\` `;
            };
        };
        const muteembed = new EmbedBuilder()
            .setColor(color.defaultLog)
            .setDescription(description)
        await interaction.reply({ embeds: [muteembed], ephemeral: true });

        let mutedRole = interaction.guild.roles.cache.find(role => role.name === mutedRoleName);
        const reason = interaction.options.getString('reason') ?? 'No reason provided.';
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);   

        members.forEach(async member => {
            if(member.roles.cache.has(mutedRole.id)) {
                const muteembed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **error**')
                    .setDescription(`\`${member.user.username}#${member.user.discriminator}\` is already jailed`)

                logEx(color.warning, 'Jail Command Used', `<@${interactionUser.id}> tried to jail <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
                let message = await interaction.channel.send({ embeds: [muteembed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            } else {
                const dmembed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **you have been jailed on cozy community**')
                    .setDescription(`**Reason:** ${reason}`)
                    .setTimestamp()

                let dmenabled = true;
                await member.send({ embeds: [dmembed] }).catch(() => dmenabled = false); 
                await member.roles.add(mutedRole);
                if (member.voice.channel) await member.voice.disconnect();
                const muteembed = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('✅ **done**')
                    .setDescription(`successfully jailed \`${member.user.username}#${member.user.discriminator}\``)
        
                if(!dmenabled) {
                    logEx(color.warning, 'Jail Command Used', `<@${interactionUser.id}> jailed <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interactionUser);
                } else {
                    logEx(color.warning, 'Jail Command Used', `<@${interactionUser.id}> jailed <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interactionUser);
                }
                let message = await interaction.channel.send({ embeds: [muteembed] });
                setTimeout(() => message.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            };
        });
	},
};