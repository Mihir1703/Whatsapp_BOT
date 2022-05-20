const makeWASocket = require('@adiwajshing/baileys').default
const { DisconnectReason, useSingleFileAuthState } = require('@adiwajshing/baileys')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const handleCommands = require('./utils/commands');

async function connectToWhatsApp() {
    const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })
    sock.ev.on('creds.update', saveState)
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
