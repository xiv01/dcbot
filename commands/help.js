const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const path = require('node:path');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('display help summary'),
	async execute(interaction, client) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
		logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /help\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

		let counter = 1;
		let string = '';
		let fields = [];
		client.commands.forEach( command => {
			if(command.data.default_member_permissions === '8' || command.data.default_member_permissions === '2' || command.data.default_member_permissions === '4' || command.data.default_member_permissions === '1099511627776') string += '❗ ';
			string += '**/' + command.data.name + '**\n\`\`\`' + command.data.description + '\`\`\`\n\n';
			if(counter % 3 == 0) {
				fields.push({ name: ' ', value: string, inline: true })
				string = '';
			};
			counter++;
		});
		if(string.length > 0) {
			fields.push({ name: ' ', value: string, inline: true });
		};

		const groups = [];
		for (let i = 0; i < fields.length; i += Math.ceil(fields.length / 3)) {
		    groups.push(fields.slice(i, i + Math.ceil(fields.length / 3)));
		};

		let embeds = [];
		for(var i = 0; i < groups.length; i++) {
			const embed = new EmbedBuilder()
				.setColor(color.pink)
				.setTitle('₊˚✦ **Command Overview**')
				.setDescription('>>> commands marked with ❗ require special permissions\n\n')
				.addFields(groups[i])
				.setFooter({ text: `developed by max#0135 | Page ${i + 1} of ${groups.length}`, iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/4b00003de1780fcf41b50c2b41249811.webp?size=32' });
			embeds.push(embed);
		};

		let prev = new ButtonBuilder()
			.setCustomId('helpPrev')
			.setLabel('⬅️')
			.setStyle(1)
			.setDisabled(true);

		let next = new ButtonBuilder()
			.setCustomId('helpNext')
			.setLabel('➡️')
			.setStyle(1);

		const expiredEmbed = new EmbedBuilder()
			.setColor(color.warning)
			.setTitle('❗ **Menu Expired**')
			.setDescription('run the command again to generate a new one')

		var currentPage = 0;
		const response = await interaction.reply({ embeds: [embeds[currentPage]], components: [new ActionRowBuilder().addComponents(prev, next)] });

		const collector = response.createMessageComponentCollector({ componentType: 2, time: 120_000 });
		collector.on('collect', async i => {
			if(i.user.id !== interaction.user.id) return;
			if (i.customId === 'helpPrev') {
				currentPage--;
				if(currentPage === 0) prev.setDisabled(true);
				else prev.setDisabled(false);
				if(currentPage === embeds.length) next.setDisabled(true);
				else next.setDisabled(false);
				await i.update({ embeds: [embeds[currentPage]], components: [new ActionRowBuilder().addComponents(prev, next)] });
			} else if (i.customId === 'helpNext') {
				currentPage++;
				if(currentPage === 0) prev.setDisabled(true);
				else prev.setDisabled(false);
				if(currentPage === (embeds.length - 1)) next.setDisabled(true);
				else next.setDisabled(false);
				await i.update({ embeds: [embeds[currentPage]], components: [new ActionRowBuilder().addComponents(prev, next)] });
			};
		});
		//collector.on('end', async i => {await interaction.editReply({ embeds: [embeds[currentPage].setDescription('❗ **Menu Expired** run the command again to generate a new one').setColor(color.warning)], components: [] })});
		collector.on('end', async i => {await interaction.editReply({ embeds: [expiredEmbed], components: [] })});
	},
};