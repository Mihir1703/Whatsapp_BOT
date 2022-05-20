const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { downloadContentFromMessage } = require('@adiwajshing/baileys')
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');

module.exports = async function (client, controller, chat) {
    let num = String(Math.random() * 1e8)
    try {
        let imageLink = undefined;
        const file = `tmp/${client.slice(0, 5) + num}`;
        let type = "";
        try {
            if (chat.message.extendedTextMessage.contextInfo.quotedMessage !== undefined || imageLink == undefined) {
                imageLink = chat.message.extendedTextMessage.contextInfo.quotedMessage
                if(imageLink.hasOwnProperty('imageMessage')){
                    imageLink = imageLink.imageMessage;
                    type = "image";
                }else{
                    imageLink = imageLink.videoMessage;
                    type = "video";
                }
            }
        } catch (error) { }
        const downloading = await controller.sendMessage(client, { text: 'Converting given media to sticker' });
        const stream = await downloadContentFromMessage(imageLink,type);
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(file, buffer)
        const sticker_path = `tmp/st-${client.slice(0, 5) + num}.webp`;
        try {
            ffmpeg(file).outputOptions(["-y", "-vcodec libwebp"])
                .videoFilters(
                    "scale=2000:2000:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=2000:2000:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"
                ).size('200x200')
                .save(sticker_path).on('end', async () => {
                    const final_message = await controller.sendMessage(client, { sticker: { url: sticker_path } });
                    const reactionMessage = {
                        react: {
                            text: "😉",
                            key: final_message.key
                        }
                    }
                    await controller.sendMessage(client, reactionMessage)
                    try {
                        fs.unlinkSync(file);
                        fs.unlinkSync(sticker_path);
                    } catch (err) {
                        console.log(err)
                    }
                })
        } catch (err) {

        }
        await controller.sendMessage(client, {
            delete: downloading.key
        })
    } catch (error) {
        console.log(error)
        await controller.sendMessage(client, { text: 'Error converting media to sticker' });
    }
}
