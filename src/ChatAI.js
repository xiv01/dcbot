const { chatAIToggle, badwords } = require('../config.json');
const { encode } = require('gpt-3-encoder')
const { logEx } = require('./Util.js');
const color = require('../colors.json');
module.exports = { chatAI, addAIMessage, generateAIResponse };

function addAIMessage(client, role, input) {
    if(chatAIToggle) {
        let tokens = 0;
        client.conversation.push({ role: role, content: input });
        client.conversation.forEach( entry => {
            tokens += encode(JSON.stringify(entry)).length
        });
        while(tokens > 4000) {
            tokens -= encode(JSON.stringify(client.conversation[0])).length;
            client.conversation.shift();
        };
    };
};

async function generateAIResponse(client, message, prompt) {
    return new Promise(async function (resolve) {
        await message.channel.sendTyping();
        const typing = setInterval(() => { message.channel.sendTyping() }, 5000);
        addAIMessage(client, "user", prompt);
        await client.openAI.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: client.conversation,
        }).then(completion => {
            logEx(color.defaultLog, '🤖 AI Chat', `<@${message.author.id}>: ${message.content} \n**reply cost**: \`${completion.data.usage.total_tokens}\` tokens`, message.guild, message.member);
            let reply = completion.data.choices[0].message.content;
            addAIMessage(client, "assistant", reply);
            reply = reply.replaceAll('@', '@ ');
            for(var i = 0; i < badwords.length; i++) {
                if(reply.includes(badwords[i])) {
                    let censor = '';
                    for(var j = 0; j < badwords[i].length; j++) censor += '\\*';
                    reply = reply.replaceAll(badwords[i], censor);
                };
            };
            clearInterval(typing);
            resolve(reply);
        }).catch(err => {
            clearInterval(typing);
            console.log(err);
            if(err.response.status === 429) resolve('you are sending messages too fast please try again in a few seconds :(');
            logEx(color.warning, '🤖 AI Error', `**last prompt**: <@${message.author.id}>: ${message.content}`, message.guild, message.member);
            console.log(err.response);
            resolve('an error occured while I was trying to answer. :(');
        });
    });
};

function censor(input) {
    output = input.replaceAll('@', '@ ');
    for(var i = 0; i < badwords.length; i++) {
        if(output.includes(badwords[i])) {
            let censor = '';
            for(var j = 0; j < badwords[i].length; j++) censor += '\\*';
            reply = reply.replaceAll(badwords[i], censor);
        };
    };
    return output
}

async function chatAI(guild, client) {
    logEx(color.defaultLog, '⚙️ System', '🤖 AI Chat is enabled', guild);
    client.conversation = [];

    client.on('messageCreate', async message => {
        if(message.author.bot) return;
        var content = message.content.toLowerCase();
        if(content === null) return;
        if(content.includes("discord.gg/") || content.includes("discordapp.com/invite/") || content.includes("discord.com/invite/") || content.includes("@everyone") || content.includes("@here")) return;
        for(var i = 0; i < badwords.length; i++) if(content.includes(badwords[i])) return;
        
        if(!message.mentions.has(client.user)) { 
            addAIMessage(client, "user", message.member.displayName + " said: " + message.content);
        };

        if (message.mentions.has(client.user)) {
            let prompt = content.replace(/<@\d+>/g, '');
            if(prompt.length > 1) {
                let reply = await generateAIResponse(client, message, message.member.displayName + " said to you: " + prompt)
                if(reply.length > 2000) {
                    try {
                        await message.reply(reply.substr(0, 2000));
                    } catch {
                        await message.channel.send(reply.substr(0, 2000));
                    };
                    for(i = 1; i < reply.length / 2000; i++) {
                        await message.channel.send(reply.substr(i * 2000, 2000 + (i * 2000)));
                    };
                } else {
                    try {
                        await message.reply(reply);
                    } catch {
                        await message.channel.send(reply);
                    };
                };
            };
        };
    });
};