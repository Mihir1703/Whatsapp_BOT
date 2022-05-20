module.exports = async (client, controller) => {
    await controller.sendMessage(client, { text: 'Haa mai Jinda hu bol kya kaam hai.' }).catch(async (err) => {
        await controller.sendMessage(client, { text: 'Some error occured please try again with valid command' });
    });
}