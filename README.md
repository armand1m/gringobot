# gringobot

Bot with utilities for the Telegram Group [Programando na Gringa](https://go.d1m.dev/png)

This bot offer features that make the management of a large international group easier. We use it to add common questions and features that make the experience of our members more delightful.

All content is managed in markdown and is requested over the network through Github API's, so we don't have to redeploy the bot to have updated content.

The bot allows members to register the country they're located, so when questions about specific places come up, they can just use the bot to ping those folks through a simple command like `!whoisat NL`

## Features

 - [ ] Register member location:
    - [ ] English: `/imat NL`
    - [ ] Portuguese: `/estou Holanda`
 - [ ] Ping folks from a location:
    - [ ] English: `/whoat NL`, `!whoat The Netherlands`
    - [ ] Portuguese: `/quem NL`, `!quem Holanda`
 - [ ] Deregister member location:
    - [ ] English: `/left NL`, `!left The Netherlands`
    - [ ] Portuguese: `/sair NL`, `!sair Holanda`
 - [ ] Help Sections:
    - [ ] English: `/help international transfers`
    - [ ] Portuguese: `/ajuda transferencias`
 - [ ] Ping all admins:
    - [ ] `/pingadmins`

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

Credits go to all the maintainers of the Programando na Gringa group.
