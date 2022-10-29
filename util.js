const Canvas = require("canvas");
const { registerFont } = require('canvas')
module.exports = { logEx, drawWelcomeImage, newColor, getUnixTime };

function logEx(message) {
    let date = new Date();
    console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${message}`);
}

function getUnixTime() {
    return Math.floor(new Date().getTime() / 1000);
}

async function newColor(userID, roles, guild) {
    await guild.members.fetch(userID).then(async member => {
        var highest = member.roles.highest
        if(highest.name != "rainbow") {
            await member.roles.add(roles[Math.floor(Math.random() * roles.length)]); 
            return;
        }
        currentrole = roles[Math.floor(Math.random() * roles.length)];
        while(currentrole === member.roles.highest) {
            currentrole = roles[Math.floor(Math.random() * roles.length)];
        }
        await member.roles.add(currentrole);
        if(highest.name != "rainbow") { // kys 
            return;
        }
        await member.roles.remove(highest);
    }).catch(console.error)
}

async function drawWelcomeImage(member) {
    const canvas = Canvas.createCanvas(400, 165);

    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(`./images/resources/welcomeImage.png`);
    registerFont('ARLRDBD.TTF', { family: 'ArialR' })

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    var username = `${member.user.username}#${member.user.discriminator}`;
    ctx.fillStyle = '#f2f2f2';
    if(/[^\u0000-\u00ff]/.test(username)) {
        ctx.font = `19px "ArialR"`;
        username = "welcome to the server <3";
        ctx.fillText(username, canvas.width / 2 - 45, canvas.height / 2 + 25);
    } else {
        var size = 27;
        var offset = 45;
        for(var i = username.length - 1; i > 0; i--) {
            if(size > 12) {
                size = size - 0.45;
            }
            if(offset > -45) {
                offset = offset - 5;
            }
        }
        ctx.font = `${size}px "ArialR"`;
        ctx.fillText(username, canvas.width / 2 + offset, canvas.height / 2 + 25);
    }

    let membercount = member.guild.memberCount
    var string = `you are member #${membercount}`;
    ctx.fillStyle = '#8155fa';
    ctx.font = '20px "ArialR"';
    if(membercount > 100 && membercount < 1000) {
        ctx.fillText(string, canvas.width / 2 - 40, canvas.height / 2 + 60);
    } else if(membercount > 1000) {
        ctx.fillText(string, canvas.width / 2 - 45, canvas.height / 2 + 60);
    } else {
        ctx.fillText(string, canvas.width / 2 - 30, canvas.height / 2 + 60);
    }

    ctx.beginPath();
    ctx.arc(74.5, canvas.height / 2 - 3, 57, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
    ctx.drawImage(avatar, 15, 15, 125, 125);

    return canvas.toBuffer();
}