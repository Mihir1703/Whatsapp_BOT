const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { downloadContentFromMessage } = require('@adiwajshing/baileys')
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');

module.exports = async function (client, controller, chat) {
    let num = String(Math.random() * 1e8)
    try {
        const downloading = await controller.sendMessage(client, { text: 'Converting given media to sticker' });
        let imageLink = undefined;
        const file = `tmp/${client.slice(0, 5) + num}`;
        try {
            if (chat.message.extendedTextMessage.contextInfo.quotedMessage !== undefined || imageLink == undefined) {
                imageLink = chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
            }
        } catch (error) { }
        const stream = await downloadContentFromMessage(imageLink, 'image');
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
                    await controller.sendMessage(client, { sticker: { url: sticker_path } });
                    try {
                        fs.unlinkSync(file);
                        fs.unlinkSync(sticker_path);
                    } catch (err) {
                        fs.unlinkSync(file);
                        fs.unlinkSync(sticker_path);
                        console.log(err)
                    }
                })
        } catch (err) {

        }
        controller.sendMessage(client, {
            delete: downloading.key
        })
    } catch (error) {
        console.log(error)
        await controller.sendMessage(client, { text: 'Error converting media to sticker' });
    }
}
