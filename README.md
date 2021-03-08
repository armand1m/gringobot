# gringobot

Bot with utilities for the Telegram Group [Programando na Gringa](https://go.d1m.dev/png)

This bot offer features that make the management of a large international group easier. We use it to add common questions and features that make the experience of our members more delightful.

All content is managed in markdown and is requested over the network through Github API's, so we don't have to redeploy the bot to have updated content.

The bot allows members to register the country they're located, so when questions about specific places come up, they can just use the bot to ping those folks through a simple command like `!whoisat NL`

## Features

The bot currently replies in Portuguese by default, and parses names of countries in Portuguese only. This will change in the future.

 - [x] Register member location:
    - [x] English: `/register_member_at NL`, `/imat NL`
    - [x] Portuguese: `/estou NL`, `/estou Holanda`
 - [x] Ping folks from a location:
    - [x] English: `/ping_members_at NL`, `/whoisat NL`
    - [x] Portuguese: `/quem NL`, `/quem Holanda`
 - [x] Deregister member location:
    - [x] English: `/leave NL`
    - [x] Portuguese: `/sair NL`, `/sair Holanda`
 - [x] Find member registered locations:
    - [x] English: `/find_member`, `/whereami`
    - [x] Portuguese: `/ondeestou`
 - [ ] Help Sections:
    - [ ] English: `/help <subject> <search>`
    - [ ] Portuguese: `/ajuda <assunto> <search>`
 - [x] Ping all admins:
    - [x] `/ping_admins`, `/admins`, `/eita`

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

### Host

Follow the same configuration step for development, but run the following to start the process:

```sh
yarn build
node ./build/index.js
```

You probably want to use a process manager like `systemd` or PM2.

### Docker

This bot is published publicly as a Docker Image, so you should be able to run it anywhere you can run a Docker Container.

To run it locally, just run the following:

```sh
docker run -e BOT_TOKEN="your-bot-token-here" armand1m/gringobot
```

### Kubernetes

Kubernetes manifests are available at the `./kubernetes` folder.

Create a secret named `gringobot-secret` with the `bot_token`:

```sh
kubectl create secret generic gringobot-secrets \
    --from-literal=bot_token='<token-goes-here>'
```

Then apply the manifest:

```sh
kubectl apply -f ./kubernetes/deployment.yml
```

You might have to adjust the PersistentVolumeClaim if you're not using a CSI driver.

## Credits

Credits goes to all the maintainers of the Programando na Gringa group.
