const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setuproles')
		.setDescription('setup self roles in current channel'),
	async execute(interaction) {
		const age13role = interaction.guild.roles.cache.find(role => role.name === '13+');
		const age16role = interaction.guild.roles.cache.find(role => role.name === '16+');
		const age18role = interaction.guild.roles.cache.find(role => role.name === '18+');

		const gendermalerole = interaction.guild.roles.cache.find(role => role.name === 'male');
		const genderfemalerole = interaction.guild.roles.cache.find(role => role.name === 'female');
		const genderotherrole = interaction.guild.roles.cache.find(role => role.name === 'other');

		const pronounsrole1 = interaction.guild.roles.cache.find(role => role.name === 'he/him');
		const pronounsrole2 = interaction.guild.roles.cache.find(role => role.name === 'she/her');
		const pronounsrole3 = interaction.guild.roles.cache.find(role => role.name === 'they/them');
		const pronounsrole4 = interaction.guild.roles.cache.find(role => role.name === 'it/it');

		const personality1 = interaction.guild.roles.cache.find(role => role.name === 'femboy');
		const personality2 = interaction.guild.roles.cache.find(role => role.name === 'emo');
		const personality3 = interaction.guild.roles.cache.find(role => role.name === 'gym bro');
		const personality4 = interaction.guild.roles.cache.find(role => role.name === 'gamer');

		const role1embed = new EmbedBuilder()
    		.setColor(0x98b1c8)
    		.setTitle('Age')
    		.setDescription('⚙️ choose your age\n\n1️⃣ ⇢ \`13+\`\n\n2️⃣ ⇢ \`16+\`\n\n3️⃣ ⇢ \`13+\`\n\n')

		const role2embed = new EmbedBuilder()
    		.setColor(0xc8af98)
    		.setTitle('Gender')
    		.setDescription('⚙️ choose your gender\n\n💙 ⇢ \`male\`\n\n💜 ⇢ \`female\`\n\n🤍 ⇢ \`other\`\n\n')

		const role3embed = new EmbedBuilder()
    		.setColor(0x98c8c7)
    		.setTitle('Pronouns')
    		.setDescription('⚙️ choose your pronouns\n\n💫 ⇢ \`he/him\`\n\n⭐ ⇢ \`she/her\`\n\n🌟 ⇢ \`they/them\`\n\n✨ ⇢ \`it/it\`\n\n')

		const role4embed = new EmbedBuilder()
    		.setColor(0xc898b1)
    		.setTitle('Personality')
    		.setDescription('⚙️ choose your personality\n\n💗 ⇢ \`femboy\`\n\n🖤 ⇢ \`emo\`\n\n💪 ⇢ \`gym bro\`\n\n🎮 ⇢ \`gamer\`\n\n')

		interaction.deferReply();
		interaction.deleteReply();
		let messageEmbed = await interaction.channel.send({ embeds: [role1embed]  })
		let messageEmbed2 = await interaction.channel.send({ embeds: [role2embed] })
		let messageEmbed3 = await interaction.channel.send({ embeds: [role3embed] })
		let messageEmbed4 = await interaction.channel.send({ embeds: [role4embed] })

		await messageEmbed.react('1️⃣');
		await messageEmbed.react('2️⃣');
		await messageEmbed.react('3️⃣');

		await messageEmbed2.react('💙');
		await messageEmbed2.react('💜');
		await messageEmbed2.react('🤍');

		await messageEmbed3.react('💫');
		await messageEmbed3.react('⭐');
		await messageEmbed3.react('🌟');
		await messageEmbed3.react('✨');

		await messageEmbed4.react('💗');
		await messageEmbed4.react('🖤');
		await messageEmbed4.react('💪');
		await messageEmbed4.react('🎮');
		
		messageEmbed.client.on('messageReactionAdd', async (reaction, user) => {
			if(reaction.message.partial) await reaction.message.fetch();
			if(reaction.partial) await reaction.fetch();
			if(!reaction.message.guild) return;
			if(user.bot) return;

			if (reaction.message.channel.id == messageEmbed.channel.id) {
				if(reaction.emoji.name === '1️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(age13role);
				}
				if(reaction.emoji.name === '2️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(age16role);
				}
				if(reaction.emoji.name === '3️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(age18role);
				} 

				if(reaction.emoji.name === '💙') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(gendermalerole);
				} 
				if(reaction.emoji.name === '💜') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(genderfemalerole);
				}
				if(reaction.emoji.name === '🤍') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(genderotherrole);
				}

				if(reaction.emoji.name === '💫') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(pronounsrole1);
				} 
				if(reaction.emoji.name === '⭐') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(pronounsrole2);
				}
				if(reaction.emoji.name === '🌟') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(pronounsrole3);
				}
				if(reaction.emoji.name === '✨') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(pronounsrole4);
				}

				if(reaction.emoji.name === '💗') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(personality1);
				} 
				if(reaction.emoji.name === '🖤') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(personality1);
				}
				if(reaction.emoji.name === '💪') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(personality1);
				}
				if(reaction.emoji.name === '🎮') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(personality1);
				}
				
				else {
					return;
				}
			}
		})

		messageEmbed.client.on('messageReactionRemove', async (reaction, user) => {
			if(reaction.message.partial) await reaction.message.fetch();
			if(reaction.partial) await reaction.fetch();
			if(!reaction.message.guild) return;
			if(user.bot) return;

			if (reaction.message.channel.id == messageEmbed.channel.id) {
				if(reaction.emoji.name === '1️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(age13role);
				}
				if(reaction.emoji.name === '2️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(age16role);
				}
				if(reaction.emoji.name === '3️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(age18role);
				} 
				
				if(reaction.emoji.name === '💙') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(gendermalerole);
				} 
				if(reaction.emoji.name === '💜') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(genderfemalerole);
				}
				if(reaction.emoji.name === '🤍') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(genderotherrole);
				}

				if(reaction.emoji.name === '💫') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(pronounsrole1);
				} 
				if(reaction.emoji.name === '⭐') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(pronounsrole2);
				}
				if(reaction.emoji.name === '🌟') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(pronounsrole3);
				}
				if(reaction.emoji.name === '✨') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(pronounsrole4);
				}

				if(reaction.emoji.name === '💗') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(personality1);
				} 
				if(reaction.emoji.name === '🖤') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(personality1);
				}
				if(reaction.emoji.name === '💪') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(personality1);
				}
				if(reaction.emoji.name === '🎮') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(personality1);
				}
				
				else {
					return;
				}
			}
		})
	},
};