const openai = require('openai');

module.exports = {
    openaiClient: new openai({ apiKey: process.env.OPENAI_API_KEY }),
}
