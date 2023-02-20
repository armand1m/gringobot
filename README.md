# gringobot

Bot with utilities for the Telegram Group [Programando na Gringa](https://go.d1m.dev/png)

This bot offer features that make the management of a large international group easier. We use it to add common questions and features that make the experience of our members more delightful.

All content is managed in markdown and is requested over the network through Github API's, so we don't have to redeploy the bot to have updated content.

The bot allows members to register the country they're located, so when questions about specific places come up, they can just use the bot to find those folks through a simple command like `/whoat NL` and ping them if needed with `/ping NL`

This bot is available in Telegram as [@PNGGringoBot](https://t.me/PNGGringoBot) and it works in multiple groups. Keep in mind that the admins of [Programando na Gringa](https://go.d1m.dev/png) own this instance as a community effort and manage the data accordingly. Feel free to reach out if you have any questions.

## Features

The bot currently replies in Portuguese by default, and parses names of countries in Portuguese only. This will change in the future.

 - [x] Register member location:
    - [x] English: `/register_member_at NL`, `/imat NL`
    - [x] Portuguese: `/estou NL`, `/estou Holanda`
 - [x] Find folks from a location:
    - [x] English: `/find_members_at NL`, `/whoat NL`
    - [x] Portuguese: `/quem NL`, `/quem Holanda`
 - [x] Ping folks from a location:
    - [x] English: `/ping_members_at NL`, `/ping NL`
    - [x] Portuguese: `/alo NL`, `/alo Holanda`
    - **Note on this feature**:
      - Telegram imposes limits on actually pinging more than 5 mentions in the same message. When trying to ping people registered in a location, this bot will randomly select 5 of those folks and mention them. The rest will still be mentioned, but with silent mentions.
 - [x] Deregister member location:
    - [x] English: `/leave NL`
    - [x] Portuguese: `/sair NL`, `/sair Holanda`
 - [x] Find member registered locations:
    - [x] English: `/find_member`, `/whereami`
    - [x] Portuguese: `/ondeestou`
 - [x] List Member count per Country:
    - [x] English: `/list_country_member_count`, `/list`
    - [x] Portuguese: `/quantos`
    - [ ] Include remote members when listing
 - [x] Rank countries by number of members
    - [x] English: `/rank_country_member_count`, `/rank`
    - [x] Portuguese: `/classificacao`
    - [ ] Include remote members when ranking
 - [x] Register as Remote Member:
    - [x] English: `/register_remote_member <from> <to>`
    - [x] Portuguese: `/estou_remoto <from> <to>`
 - [x] Deregister as Remote Member:
    - [x] English: `/deregister_remote_member`
    - [x] Portuguese: `/sair_remoto`
 - [ ] Find remote member working from a location:
    - [x] English: `/find_remote_member_from BR`
    - [x] Portuguese: `/quem_remoto_do BR`
 - [ ] Find remote member working for a location:
    - [x] English: `/find_remote_member_to CA `
    - [x] Portuguese: `/quem_remoto_para CA`
 - [x] Help Sections:
    - [x] English: `/help <subject> <topic>`
    - [x] Portuguese: `/ajuda <assunto> <topico>`
 - [x] Ping all admins:
    - [x] `/ping_admins`, `/admins`, `/eita`
 - [x] Kick user:
    - [x] `/kick`
      - Only works by replying a message from the user to be kicked.
 - [x] Set Group Language:
    - [x] `/set_language en`
    - [x] `/set_language ptbr`
 - [x] Self preservation habilities
    - [x] Handle deleted registered users and deregister those when identified
    - [x] Auto bans accounts with Cyrillic Characters _(huge sorry to all the eastern europeans for this, russians made me do it)_
 - [x] Message Auto Deletion:
    - [x] Configurable through the `MESSAGE_TIMEOUT_IN_MINUTES` environment variable. Default is `2`.
    - [x] Feature can be toggled through the `MESSAGE_TIMEOUT_ENABLED` environment variable. Default is `true`.
    - [x] Deletes both command and reply messages after timeout is reached.
    - [x] Deletes all interactions that were replied with error messages.
    - [x] Deletes messages from the following commands:
      - `/leave`
      - `/find_member`
      - `/register_member_at`
      - `/register_remote_member`
      - `/deregister_remote_member`
      - `/find_members_at` (only if no members are found)
      - `/ping_members_at` (only if no members are found)
      - `/list_country_member_count` (only if no members are registered)
      - `/rank_country_member_count` (only if no members are registered)

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
BOT_TOKEN=your-bot-token-here
DATA_PATH=./data
MESSAGE_TIMEOUT_ENABLED=true
MESSAGE_TIMEOUT_IN_MINUTES=2
HELP_COMMAND_ENABLED=true
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

[Kubernetes manifests were* available at the `./kubernetes` folder.](https://github.com/armand1m/gringobot/blob/d8bd8a2c8c6e9806a9041aa138e6e956cc3ac2b8/kubernetes/deployment.yml)

As of 2023, this application is now deployed on https://fly.io. I've kept it for historical reasons.

[Docs are here](https://github.com/armand1m/gringobot/blob/d8bd8a2c8c6e9806a9041aa138e6e956cc3ac2b8/README.md#kubernetes)

### Fly

This bot is published in https://fly.io 

The CI will take care of publishing the last main branch state into the official bot release.

Publishing it in your instance should be easy:

```sh
fly auth login
fly secrets set BOT_TOKEN=123123123:32132132131312
fly deploy
```

Refer to https://fly.io docs for more details on other commons ops

## Credits

Credits goes to all the maintainers and participants of the Programando na Gringa group.
