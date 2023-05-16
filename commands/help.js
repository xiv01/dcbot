const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('display help summary'),
	async execute(interaction, client) {
		logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> used /help\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interaction.member);

		let counter = 1;
		let string = '';
		let fields = [];
		client.commands.forEach(command => {
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

		let group = [];
		let embeds = [];
		let lastIndex
		for(let i = 1; i < fields.length; i++) {
			group.push(fields[i - 1]);
			if(i % 3 == 0) {
				embeds.push(createPage(group));
				lastIndex = i;
				group = [];
			};
		};
		if(lastIndex < fields.length) {
			group = [];
			for(let i = lastIndex; i < fields.length; i++) {
				group.push(fields[i]);
			};
			embeds.push(createPage(group));
		};
		for(let i = 0; i < embeds.length; i++) {
			embeds[i].setFooter({ text: `developed by max#0135 | Page ${i + 1} of ${embeds.length}`, iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/4b00003de1780fcf41b50c2b41249811.webp?size=32' });
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
			if(i.user.id !== interaction.user.id) {
				const noPermissionEmbed = new EmbedBuilder()
					.setColor(color.warning)
					.setTitle('❗No Permission')
					.setDescription(`only **${interaction.user.tag}** can control this menu`)
				i.reply({ embeds: [noPermissionEmbed], ephemeral: true });
				return;
			};
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
		collector.on('end', async() => { 
			try {
				await interaction.editReply({ embeds: [expiredEmbed], components: [] })
			} catch { return };
		});
	},
};

function createPage(group) {
	return embed = new EmbedBuilder()
		.setColor(color.pink)
		.setTitle('₊˚✦ **Command Overview**')
		.setDescription('>>> commands marked with ❗ require special permissions\n\n')
		.addFields(group)
};