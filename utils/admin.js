const fs = require('fs')
module.exports = async (client, controller, chat) => {
    if (!chat.key.fromMe) {
        await controller.sendMessage(client, { text: "Permission denied!!" }, {
            quoted: chat
        });
        return;
    }
    let data = JSON.parse(fs.readFileSync('./exceptions/who_can_tag.json', { encoding: 'utf8' }))
    let data_add = [];
    chat.message.extendedTextMessage.contextInfo.mentionJid.map((e) => {
        data_add.push({
            id: e.split('@')[0]
        })
    })
    data.push(...data_add)
    fs.writeFileSync('./exceptions/who_can_tag.json', JSON.stringify(data));
    await controller.sendMessage(client, { text: "Access Granted!!" });
}