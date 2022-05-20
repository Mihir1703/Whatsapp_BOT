const fs = require('fs')
const yts = require('yt-search');
const ytdl = require("ytdl-core");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = async function (client, controller, args) {
    let num = String(Math.random() * 1e8)
    try {
        if (String(args).length == 0) {
            await controller.sendMessage(client, { text: 'Please enter a valid song name to convert to speech' });
            return
        }
        const downloading = await controller.sendMessage(client, { text: 'Ruk Jaa bhej raha hu' });
        const keyword = await yts(args + 'song');
        let url = keyword.videos[0].url;
        let stream = ytdl(url, {
            quality: "highestaudio",
        });
        ffmpeg(stream)
            .audioBitrate(320)
            .toFormat("ipod")
            .saveToFile(`tmp/${client.slice(0, 5) + num}.mp3`).on('end', async () => {
                const file = `tmp/${client.slice(0, 5) + num}.mp3`;
                await controller.sendMessage(client, { audio: { url: file }, mimetype: 'audio/mp4' });
                fs.unlinkSync(file);
                controller.sendMessage(client, {
                    delete: downloading.key
                })
            });
    } catch (err) {
        try {
            fs.unlinkSync(`tmp/${client.slice(0, 5) + num}.mp3`);
        } catch (err) { }
        await controller.sendMessage(client, { text: 'Please enter a valid song name to convert to speech' });
        throw err
    }

}