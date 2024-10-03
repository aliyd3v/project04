const { bot } = require("../bot");
const { userModel } = require("../models/userModel");
const { profile } = require("./profile");
const { sendDataToSheetDB } = require("./send_to_sheetdb");

exports.request_contact = async msg => {
    const chatId = msg.chat.id
    let user = await userModel.findOne({ chatId }).lean()

    if (msg.contact) {
        if (msg.contact.phone_number) {
            user.phone = msg.contact.phone_number
            user.admin = msg.contact.phone_number === '+998995005508'
            await userModel.findByIdAndUpdate(user._id, { ...user, action: 'menu' }, { new: true })

            const userData = await userModel.findById(user._id).lean()
            const data = {
                "id": userData.chatId.toString(),
                "name": userData.name,
                "username": userData.username,
                "phone": userData.phone,
                "language": userData.language,
                "createdAt": userData.createdAt
            }
            await sendDataToSheetDB(data)


            bot.sendMessage('@Botcha_database', `👤 id: ${msg.from.id}\n
✍️ Name: ${user.name}\n
🌐 Language: ${user.language}\n
📞 Phone number: ${user.phone}\n
👤 Username: @${user.username}\n
🕔 Joined date & time: ${user.createdAt.toLocaleString()}`)
                .then(() => { console.log('User added to channel') })
                .catch((error) => { console.log(error) })
            return profile(msg)
        }
    } else {
        return profile(msg)
    }
}