# gringobot

Bot with utilities for the Telegram Group [Programando na Gringa](https://go.d1m.dev/png)

This bot offer features that make the management of a large international group easier. We use it to add common questions and features that make the experience of our members more delightful.

All content is managed in markdown and is requested over the network through Github API's, so we don't have to redeploy the bot to have updated content.

The bot allows members to register the country they're located, so when questions about specific places come up, they can just use the bot to ping those folks through a simple command like `!whoisat NL`

## Features

 - [x] Register member location:
    - [x] English: `/registerMemberAt NL`, `/imat NL`
    - [x] Portuguese: `/estou NL`
 - [x] Ping folks from a location:
    - [x] English: `/pingMembersAt NL`, `/whoisat NL`
    - [x] Portuguese: `/quem NL`
 - [ ] Deregister member location:
    - [x] English: `/leave NL`
    - [x] Portuguese: `/sair NL`
 - [ ] Help Sections:
    - [ ] English: `/help international transfers`
    - [ ] Portuguese: `/ajuda transferencias`
 - [x] Ping all admins:
    - [x] `/pingAdmins`, `/admins`, `/eita`

## Developing

Make sure you have Git, Node and Yarn available in your local environment.

```sh
# clone repository
git clone https://github.com/armand1m/gringobot.git

# cd into it
cd ./gringobot

# install dependencies
yarn
```

You must have a Telegram Bot Token created by the Bot Father. Once you have that, run the following command with your bot token:

```sh
cat > ./.env <<EOL
NODE_ENV=development
BOT_TOKEN="your-bot-token-here"
DATA_PATH=./data
LOCALES_PATH=./locales
EOL
```

Now run `yarn dev` and your bot should be working. Changes will restart the process.

## Deploying

This bot is published publicly as a Docker Image, so you should be able to run it anywhere you can run a Docker Container.

To run it locally, just run the following:

```sh
docker run -e BOT_TOKEN="your-bot-token-here" armand1m/gringobot
```

Kubernetes manifests are available at the `./kubernetes` folder.

## Credits

Credits goes to all the maintainers of the Programando na Gringa group.
