const { default: axios } = require("axios")
let cf_api = "https://codeforces.com/api/user.info?handles="

module.exports = async (client, controller, args) => {
    let alert = await controller.sendMessage(client, { text: "Please wait while I fetch the data..." });
    let query = cf_api + String(args).split(" ").join("").toLocaleLowerCase();
    let response = await axios.get(query);
    response = response.data;
    if (response.status == "OK") {
        response = response.result[0]
        let message = `*Username* : ${response.firstName + ' ' + response.lastName} \n\n*Current Rating : ${response.rating}(${response['rank']})* \nHighest Ranking : ${response['maxRating']}(${response['maxRank']})`;
        const final_message = await controller.sendMessage(client, { text: message });
        const reactionMessage = {
            react: {
                text: "😉",
                key: final_message.key
            }
        }
        await controller.sendMessage(client, reactionMessage)
    } else {
        const final_message = await controller.sendMessage(client, { text: "User not found!!(┬┬﹏┬┬)" });
        const reactionMessage = {
            react: {
                text: "😒",
                key: final_message.key
            }
        }
        await controller.sendMessage(client, reactionMessage)
    }
    await controller.sendMessage(client, {
        delete: alert.key
    })
}