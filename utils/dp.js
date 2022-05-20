// const { MessageType, MessageOptions, Mimetype } = require('@adiwajshing/baileys').default

module.exports = async (client, controller, chat) => {
    try {
        if (chat.message.extendedTextMessage.contextInfo.mentionedJid !== undefined) {
            let dp = await controller.profilePictureUrl(chat.message.extendedTextMessage.contextInfo.mentionedJid[0], 'image');
            await controller.sendMessage(client, { image: { url: dp }, mimetype: 'audio/mp4', caption: "Here is the image you requested!!", });
        } else {
            await controller.sendMessage(client, { text: "Please mention a person" });
        }
    } catch (err) {
        console.log(err)
    }
}