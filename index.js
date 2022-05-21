const makeWASocket = require('@adiwajshing/baileys').default
const { DisconnectReason, useSingleFileAuthState, makeInMemoryStore } = require('@adiwajshing/baileys')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
let arr = require('./exceptions/delete.json');
let deleteM = new Map();

for (let i = 0; i < arr.length; i++) {
    deleteM.set(arr[i].id, true);
}
const handleCommands = require('./utils/commands');

const store = makeInMemoryStore({})
store.readFromFile('./baileys_store.json')
// saves the state to a file every 10s
setInterval(() => {
    store.writeToFile('./baileys_store.json')
}, 10000)

async function connectToWhatsApp() {
    const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })
    sock.ev.on('creds.update', saveState)
    store.bind(sock.ev)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ' + lastDisconnect.error + ', reconnecting ' + shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', async (chat) => {
        try {
            if (chat.messages[0].message.hasOwnProperty('protocolMessage')) {
                if (deleteM.get(chat.messages[0].key.participant.split(':')[0]) || deleteM.get(chat.messages[0].key.participant.split('@')[0]) || deleteM.get(chat.messages[0].key.participant.split('-')[0])) {
                    const datas = await store.loadMessage(chat.messages[0].message.protocolMessage.key.remoteJid, chat.messages[0].message.protocolMessage.key.id);
                    // console.log(datas)
                    await sock.sendMessage(chat.messages[0].message.protocolMessage.key.remoteJid, { text: '' }, { quoted: datas })
                }
            }
        } catch (err) {
            console.log(err)
        }
        try {
            chat = chat.messages[0];
            let message;
            try {
                if (chat.message.conversation != undefined)
                    message = chat.message.conversation;
            } catch (err) { }
            try {
                if (chat.message.extendedTextMessage.contextInfo.quotedMessage !== undefined) {
                    message = chat.message.extendedTextMessage.text;
                }
            } catch (err) { }
            try {
                if (chat.message.imageMessage.caption !== undefined) {
                    message = chat.message.imageMessage.caption;
                }
            } catch (err) { }
            try {
                if (chat.message.videoMessage.caption !== undefined) {
                    message = chat.message.videoMessage.caption;
                }
            } catch (err) { }
            let sender = chat.key.remoteJid;
            await handleCommands(sender, message, sock, chat);
        } catch (error) {
            console.log(error)
        }
    })
}
// run in main file
connectToWhatsApp()
