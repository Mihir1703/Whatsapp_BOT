const alive = require('./alive');
const tts = require('./tts');
const song = require('./song');
const everyone = require('./everyone');
const sticker = require('./sticker');
const cf = require('./cf');
const github = require('./github');
const lyrics = require('./lyrics');
const ud = require('./urban_dc');
const dp = require('./dp');
const allow = require('./admin')
const gfg = require('./gfg');
const commands = (message, match) => {
    let command = String(message).split(' ')[0].toLocaleLowerCase();
    let args = String(message).split(' ').slice(1).join(' ');
    if (command === match) {
        return {
            status: true,
            args: args
        };
    } else {
        return {
            status: false,
        }
    }
}

module.exports = async (client, message, controller, chat) => {
    try {
        if (commands(message, '.dp').status) {
            await dp(client, controller, chat);
        }
        else if (commands(message, '.approve').status) {
            console.log(message)
            await allow(client, controller,chat);
        }
        else if (commands(message, '.alive').status) {
            await alive(client, controller,chat);
        }
        else if (commands(message, '.help').status) {
            await controller.sendMessage(client, { text: "Hello I am a Sasta Bot made by Mihir Waykole😉😉😉 \n\nCommands: \n.alive - Check if bot is alive \n.tts - Text to speech \n.song - Play a song \n.everyone - Send a message to everyone  \n.sticker - Send a converted sticker \n.cf <user_name> - Get Codeforces profile \n.github <user_name> - Get user profile on Github \n.lyrics <song_name> - Get song lyrics \n.ud <word> - Get meaning of word on urban dictionary \n .dp - Get dp of a user tagged in message(eg .dp @Someone) " });
        }
        else if (commands(message, '.tts').status) {
            await tts(client, controller, commands(message, '.tts').args, chat);
        }
        else if (commands(message, '.song').status) {
            await song(client, controller, commands(message, '.song').args);
        }
        else if (commands(message, '.everyone').status) {
            await everyone(client, controller, commands(message, '.everyone').args, chat);
        }
        else if (commands(message, '.sticker').status) {
            try {

                await sticker(client, controller, chat);

            } catch (err) {
                console.log(err)
            }
        }
        else if (commands(message, '.ud').status) {
            try {

                await ud(client, controller, commands(message, '.ud').args);

            } catch (err) {
                console.log(err)
            }
        }
        else if (commands(message, '.gfg').status) {
            try {

                await gfg(client, controller, commands(message, '.gfg').args);

            } catch (err) {
                console.log(err)
            }
        }
        else if (commands(message, '.cf').status) {
            try {

                await cf(client, controller, commands(message, '.cf').args);

            } catch (err) {
                console.log(err)
            }
        }
        else if (commands(message, '.github').status) {
            try {

                await github(client, controller, commands(message, '.github').args);

            } catch (err) {
                console.log(err)
            }
        }
        else if (commands(message, '.lyrics').status) {
            try {

                await lyrics(client, controller, commands(message, '.lyrics').args);

            } catch (err) {
                console.log(err)
            }
        }
        else if (message[0] == '.' && String(message).length > 1 && message[1].toLocaleLowerCase() <= 'z' && message[1].toLocaleLowerCase() >= 'a') {
            await controller.sendMessage(client, { text: '' });
        }
    } catch (err) {
        console.log(err)
    }
    await controller.sendPresenceUpdate('unavailable')
}