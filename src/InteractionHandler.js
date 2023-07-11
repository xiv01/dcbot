const { EmbedBuilder } = require('discord.js');
const { logEx } = require('./Util.js');
const color = require('../colors.json');
module.exports = { interactionHandler };

async function interactionHandler(client) {
    client.on('interactionCreate', async interaction => {
        if(interaction.isModalSubmit()) {
            if(interaction.customId.startsWith('banModal')) {
                handleBanModal(interaction);
            };
        };
        if(interaction.isModalSubmit()) {
            if(interaction.customId.startsWith('kickModal')) {
                handleKickModal(interaction);
            };
        };

        if(interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) {
            const command = client.contextmenus.get(interaction.commandName);
            if(!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'there was an error while executing this command :(', ephemeral: true });
            };
        };
        if(interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return;
        
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'there was an error while executing this command :(', ephemeral: true });
            };
        };
    });
};

const invalidMember= new EmbedBuilder()
    .setColor(color.warning)
    .setTitle(`**❗member is invalid**`)

async function handleBanModal(interaction) {
    try {
        var member = await interaction.guild.members.fetch(interaction.customId.substring(8));
    } catch {
        await interaction.reply({ embeds: [invalidMember], ephemeral: true });
        return;
    };
    let reason = interaction.fields.getTextInputValue('banReasonInput');
    const dmEmbed = new EmbedBuilder()
        .setColor(color.warning)
        .setTitle('❗ **you have been banned from cozy community**')
        .setDescription(`**Reason:** ${reason}`)
        .setTimestamp()

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
            .setTimestamp()

        await interaction.reply({ embeds: [banEmbed], ephemeral: true });
    } else {
        logEx(color.warning, 'Ban Command Failed', `<@${interaction.user.id}> tried to ban <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interaction.member);
        const banEmbed = new EmbedBuilder()
            .setColor(color.warning)
            .setTitle('❗ **failed**')
            .setDescription(`failed to ban \`${member.user.username}\``)
            .setTimestamp()

        await interaction.reply({ embeds: [banEmbed], ephemeral: true });
    };
};

async function handleKickModal(interaction) {
    try {
        var member = await interaction.guild.members.fetch(interaction.customId.substring(9));
    } catch {
        await interaction.reply({ embeds: [invalidMember], ephemeral: true });
        return;
    };
    let reason = interaction.fields.getTextInputValue('kickReasonInput');
    const dmEmbed = new EmbedBuilder()
        .setColor(color.warning)
        .setTitle('❗ **you have been kicked from cozy community**')
        .setDescription(`**Reason:** ${reason}`)
        .setTimestamp()

    if(member.kickable) {
        let dmEnabled = true;
        await member.send({ embeds: [dmEmbed] }).catch(() => dmEnabled = false); 
        await member.kick();
        if(!dmEnabled) {
            logEx(color.warning, 'Kick Command Used', `<@${interaction.user.id}> kicked <@${member.id}>\n **reason**: ${reason}\n\n❗ unable to send DM due to users privacy settings`, interaction.guild, interaction.member);
        } else {
            logEx(color.warning, 'Kick Command Used', `<@${interaction.user.id}> kicked <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interaction.member);
        };
        const kickEmbed = new EmbedBuilder()
            .setColor(color.success)
            .setTitle('✅ **done**')
            .setDescription(`successfully kicked \`${member.user.username}\``)
            .setTimestamp()
    
        await interaction.reply({ embeds: [kickEmbed], ephemeral: true });
        return;
    } else {
        logEx(color.warning, 'Kick Command Failed', `<@${interaction.user.id}> tried to kick <@${member.id}>\n **reason**: ${reason}`, interaction.guild, interaction.member);
        const kickEmbed = new EmbedBuilder()
            .setColor(color.warning)
            .setTitle('❗ **failed**')
            .setDescription(`failed to kick \`${member.user.username}\``)
            .setTimestamp()
    
        await interaction.reply({ embeds: [kickEmbed], ephemeral: true });
        return;
    };
};