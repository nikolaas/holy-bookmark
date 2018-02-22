# Holy Bookmark

Holy Bookmark is application for transferring article's links from telegram to chrome's bookmarks.

## Getting Started

```sh
# clone it
git clone https://github.com/nikolaas/holy-bookmark.git

# move to project directory
cd holy-bookmark
```

Starting backend:

```sh
# move to backend directory
cd holy-bookmark-backend

# Install dependencies
npm install

# Start backend in development live-reload mode:
PORT=8080 npm run dev

# Start backend in production mode:
PORT=8080 npm start
```

Starting telegram bot:

```sh
# move to telegram bot directory
cd holy-bookmark-telegram-bot

# Install dependencies
npm install

# Start telegram bot in development live-reload mode:
npm run dev

# Start telegram bot in production mode:
npm start
```

Installing chrome extension:

1. Open Chrome Extension Manager at [chrome://extensions]()
1. Click at "Download unpacked extension..." button
1. Choose holy-bookmark/holy-bookmark-chrome-extension directory

## TODO

1. Access token and refresh token
1. Authentication for telegram bot users
1. Main page on backend
1. Sign up page on backend
1. Profile page on backend

## License

MIT
