const songlyrics = require('songlyrics').default

module.exports = async (client, controller, args) => {
    if (args === '') {
        await controller.sendMessage(client, { text: "Please enter a song name" });
    } else {
        let alert = await controller.sendMessage(client, { text: "Please wait while I fetch the data..." });
        songlyrics(String(args).toLocaleLowerCase()).then(async lyrics => {
            await controller.sendMessage(client, { text: lyrics.lyrics });
        }).catch(async err => {
            await controller.sendMessage(client, { text: "Song not found!!(┬┬﹏┬┬)" });
        })
        await controller.sendMessage(client, {
            delete: alert.key
        })
    }
}