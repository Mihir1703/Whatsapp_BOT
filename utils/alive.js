const fs = require('fs')
module.exports = async (client, controller, chat) => {
    try {
        const final_message = await controller.sendMessage(client, { video: fs.readFileSync('tmp/alive.mp4'), caption: 'Hello, Batao Kis liye yaad kiya😉', gifPlayback: true }, { quoted: chat })
        const reactionMessage = {
            react: {
                text: "😉",
                key: final_message.key
            }
        }
        await controller.sendMessage(client, reactionMessage)
    } catch (err) {
        console.log(err)
    }
}