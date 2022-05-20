var gtts = require('node-gtts')('hi');
const fs = require('fs');
module.exports = async (client, controller, args, chat) => {
    try {
        let num = String(Math.random() * 1e8)
        if (chat.message.extendedTextMessage != undefined) {
            args = chat.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
        }
        if (String(args).length == 0) {
            await controller.sendMessage(client, { text: 'Please enter a text to convert to speech' });
            return
        }
        const file = `./tmp/${client.slice(0, 10) + num}.mp3`
        gtts.save(file, args.replace(/ {2,}/g, ' '), async (err) => {
            if (err) {
                console.log(err);
                return
            }
            await controller.sendMessage(client, { audio: { url: file }, mimetype: 'audio/mp4' });
            fs.unlinkSync(file);
        });
    } catch (err) {
        console.log(err);
    }
};