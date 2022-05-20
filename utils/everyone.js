let arr = require('../exceptions/who_can_tag.json');
let who_can_tag = new Map();

for (let i = 0; i < arr.length; i++) {
    who_can_tag.set(arr[i].id, true);
}

module.exports = async (client, controller, args, chat) => {
    try {
        console.log(args)
        if (client.endsWith("@g.us")) {
            data = await controller.groupMetadata(client)
        } else {
            await controller.sendMessage(client, { text: "Group me use kar tabhi chalega" });
            return
        }
        let sender = chat.key.participant.split('@')[0];
        let members = []
        let allow = who_can_tag.get(sender) === true ? true : false;
        data = Array.from(data.participants);
        data.map((element) => {
            members.push(element.id);
        })
        if (allow == false && chat.key.fromMe == false) {
            await controller.sendMessage(client, { text: "Pehli Phursat me nikal yaha se" });
            return
        }
        let sending_text = `${args == "" ? "Hello Everyone!!" : "Hello Everyone!!\n\n"}` + args;
        try {
            const final_message = await controller.sendMessage(client, { text: sending_text, mentions: members }, { quoted: chat });
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
    } catch (err) {
        
    }
}   
