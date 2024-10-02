const translation = require('@iamtraction/google-translate');

exports.translate = async (text, language) => {
    const result = await translation(text, { to: language })
    return result.text
}