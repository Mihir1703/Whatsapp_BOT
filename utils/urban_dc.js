const ud = require('urban-dictionary');

function capitalizeFirstLetter(string) {
    return String(string[0]).toUpperCase() + string.slice(1);
}

module.exports = async (client, controller, args) => {
    if (args.length === 0) {
        await controller.sendMessage(client, { text: "Please enter a word" })
    } else {
        try {
            let result = await ud.define(capitalizeFirstLetter(args));
            result = result[0]
            result.definition = String(result.definition).split('[').join('').split(']').join('');
            result.example = String(result.example).split('[').join('').split(']').join('');
            let embed = `*Word :* ${result.word}\n\n*Definition :* ${result.definition} \n\n I hope, that the answer would satisfy the word if not to kar kya lega😉😉(★‿★) \nIsme likhe hue naam ka meaning kewal manoranjan ke liye hai to kripya serious leke kuch ulta sidha mat karlena. \n-------------------------------\n*Example :* ${result.example}\n\n 👍 : ${result.thumbs_up} | 👎 : ${result.thumbs_down}`
            await controller.sendMessage(client, { text: embed })
        } catch (err) {
            await controller.sendMessage(client, { text: "Please enter a valid word" })
        }
    }
}