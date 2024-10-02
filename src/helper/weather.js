const { default: axios } = require("axios");
const { bot } = require("../bot");
const { userModel } = require("../models/userModel");

exports.weather = async msg => {
    const chatId = msg.chat.id
    try {
        const lat = msg.location.latitude
        const lon = msg.location.longitude

        let user = await userModel.findOne({ chatId }).lean()
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bf16c12397cb279a3a1727ed77dc5ca2&units=metric
`)
        const temp = `${result.data.main.temp}°C`
        const feels_like = `${result.data.main.feels_like}°C`
        const temp_min = result.data.main.temp_min
        const temp_max = result.data.main.temp_max
        const pressure = result.data.main.pressure
        const humidity = result.data.main.humidity
        const sea_level = result.data.main.sea_level
        const grnd_level = result.data.main.grnd_level
        const city = result.data.name
        const country = result.data.sys.country
        const wind = `${result.data.wind.speed} m/s`
        let weather
        switch (result.data.weather[0].main) {
            case 'Clear':
                if (user.language === 'uz') {
                    weather = '☀️ Ochiq havo'
                } else if (user.language === 'ru') {
                    weather = '☀️ Ясное небо'
                } else if (user.language === 'en') {
                    weather = '☀️ Clear sky'
                }
                break
            case 'Clouds':
                if (user.language === 'uz') {
                    weather = '☁️ Bulut'
                } else if (user.language === 'ru') {
                    weather = '☁️ Облака'
                } else if (user.language === 'en') {
                    weather = '☁️ Clouds'
                }
                break
            case 'Rain':
                if (user.language === 'uz') {
                    weather = '🌧 Yomg\'ir'
                } else if (user.language === 'ru') {
                    weather = '🌧 Дождь'
                } else if (user.language === 'en') {
                    weather = '🌧 Rain'
                }
                break
            case 'Drizzle':
                if (user.language === 'uz') {
                    weather = '🌧 Mayda yomg\'ir'
                } else if (user.language === 'ru') {
                    weather = '🌧 Морось'
                } else if (user.language === 'en') {
                    weather = '🌧 Drizzle'
                }
                break
            case 'Thunderstorm':
                if (user.language === 'uz') {
                    weather = '⛈ Momaqaldiroqli yomg\'ir'
                } else if (user.language === 'ru') {
                    weather = '⛈ Гроза'
                } else if (user.language === 'en') {
                    weather = '⛈ Thunderstorm'
                }
                break
            case 'Snow':
                if (user.language === 'uz') {
                    weather = '🌨 Qor'
                } else if (user.language === 'ru') {
                    weather = '🌨 Снег'
                } else if (user.language === 'en') {
                    weather = '🌨 Snow'
                }
                break
            case 'Mist':
                if (user.language === 'uz') {
                    weather = 'Tuman'
                } else if (user.language === 'ru') {
                    weather = 'Туман'
                } else if (user.language === 'en') {
                    weather = 'Mist'
                }
                break
            case 'Fog':
                if (user.language === 'uz') {
                    weather = 'Tuman'
                } else if (user.language === 'ru') {
                    weather = 'Туман'
                } else if (user.language === 'en') {
                    weather = 'Fog'
                }
                break
            case 'Haze':
                if (user.language === 'uz') {
                    weather = 'Tuman'
                } else if (user.language === 'ru') {
                    weather = 'Туман'
                } else if (user.language === 'en') {
                    weather = 'Haze'
                }
                break
            case 'Dust':
                if (user.language === 'uz') {
                    weather = '🌪 Chang'
                } else if (user.language === 'ru') {
                    weather = '🌪 Пыль'
                } else if (user.language === 'en') {
                    weather = '🌪 Dust'
                }
                break
            case 'Smoke':
                if (user.language === 'uz') {
                    weather = 'Tutun'
                } else if (user.language === 'ru') {
                    weather = 'Дым'
                } else if (user.language === 'en') {
                    weather = 'Smoke'
                }
                break
            case 'Sand':
                if (user.language === 'uz') {
                    weather = '🌪 Qum'
                } else if (user.language === 'ru') {
                    weather = '🌪 Песок'
                } else if (user.language === 'en') {
                    weather = '🌪 Sand'
                }
                break
            case 'Ash':
                if (user.language === 'uz') {
                    weather = 'Ash'
                } else if (user.language === 'ru') {
                    weather = 'Пепел'
                } else if (user.language === 'en') {
                    weather = 'Ash'
                }
                break
            case 'Squall':
                if (user.language === 'uz') {
                    weather = '🌪 Squall'
                } else if (user.language === 'ru') {
                    weather = '🌪 Шквал'
                } else if (user.language === 'en') {
                    weather = '🌪 Squall'
                }
                break
            case 'Tornado':
                if (user.language === 'uz') {
                    weather = '🌪 Tornado'
                } else if (user.language === 'ru') {
                    weather = '🌪 Торнадо'
                } else if (user.language === 'en') {
                    weather = '🌪 Tornado'
                }
                break
        }

        if (user.language === 'uz') {
            bot.sendMessage(chatId, `🌤 Obi-havo ${city} ${new Date().toLocaleString()}\n
${weather}
${temp >= 0 ? `${temp}` : `+${temp}`}
Tuyilishi: ${feels_like >= 0 ? `${feels_like}` : `+${feels_like}`}
💨 Shamol tezligi: ${wind}
💧 Namlik: ${humidity}%
📥 Havo bosimi: ${pressure} mm`, {
                reply_markup: {
                    remove_keyboard: true,
                    inline_keyboard: [
                        [
                            {
                                text: `⬅️ Menyuga qaytish`,
                                callback_data: 'menu'
                            }
                        ]
                    ]
                }
            })
        } else if (user.language === 'ru') {
            bot.sendMessage(chatId, `🌤 Погода ${city} ${new Date().toLocaleString()}\n
${weather}
${temp >= 0 ? `${temp}` : `+${temp}`}
По ощущениям: ${feels_like >= 0 ? `${feels_like}` : `+${feels_like}`}
💨 Скорость ветра: ${wind}
💧 Влажность: ${humidity}%
📥 Давление: ${pressure} mm`, {
                reply_markup: {
                    remove_keyboard: true,
                    inline_keyboard: [
                        [
                            {
                                text: `⬅️ Вернуться в меню`,
                                callback_data: 'menu'
                            }
                        ]
                    ]
                }
            })
        } else if (user.language === 'en') {
            bot.sendMessage(chatId, `🌤 Weather ${city} ${new Date().toLocaleString()}\n
${weather}
${temp >= 0 ? `${temp}` : `+${temp}`}
Feels like: ${feels_like >= 0 ? `${feels_like}` : `+${feels_like}`}
💨 Wind speed: ${wind}
💧 Humidity: ${humidity}%
📥 Pressure: ${pressure} mm`, {
                reply_markup: {
                    remove_keyboard: true,
                    inline_keyboard: [
                        [
                            {
                                text: `⬅️ Back to menu`,
                                callback_data: 'menu'
                            }
                        ]
                    ]
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}