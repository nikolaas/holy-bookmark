# HolyBookmark Telegram Bot

The bot is part of the "HolyBookmark" system designed to transfer links from Telegram to the browser on the computer.

## Scripts

Application has thee npm commands:
1. `npm run dev` - run application in development mode (hot reload)
1. `npm run build` - build application for production
1. `npm start` - run application in production mode

## Configuration

Commands `npm run dev` and `npm start` require specify environment variable `EXTERNAL_CONFIG`.
`EXTERNAL_CONFIG` have to specify configuration file (js or json) contains telegram bot token 
at property `telegram.bot.token`. For example:

// in external-config.js
```
export default {
    telegram: {
        bot: {
            token: 'your telegram bot token'
        }
    }
}
```
