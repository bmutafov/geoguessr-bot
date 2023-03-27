# GeoGuessr Discord Bot

A bot which enables you to create and send challenges to your discord server fast and easily. You can set it up with your accound for now as GeoGuessr does not have an external public API.

<p align="center">
  <img src="https://user-images.githubusercontent.com/14894196/227941795-d05006cc-452d-48c4-961a-45e271054208.png" />
</p>

## Features

#### - Create challenges and send them to a channel

![image](https://user-images.githubusercontent.com/14894196/227942257-70720295-2275-4870-99d3-6c48441b7134.png)

#### - Track results challenges

![image](https://user-images.githubusercontent.com/14894196/227942240-2816ac04-d3cc-4e40-92ab-b2c687d2940b.png)

## How to use

### Creating new challenge

To create a new challenge use slash command `/challenge`. It has the following arguments:

- mapid - map id of the map you want to use. Default: A diverse world
- time - time limit per round. Default: 30 seconds
- move - is moving allowed. Default: True
- pan - is panning allowed. Default: True
- zoom - is zooming allowed. Default: True

### Redo last challenge

You can use the slash command `/next` to create a new challenge with the same options as the last created challenge.

### Clone challenge

You can use the "Clone" button on a challenge to create a new challenge with the same options as the selected challenge

### Refresh results

By default the bot checks for new results for a few minutes after the invitation has been sent. If you want to update the results for a given challenge you can use the "Refresh" button.

## Setting it up

Currently the bot is not hosted anywhere as you need to provide your own GeoGuessr cookie for it to function correctly. To set it up, create a new bot from the discord developer portal, and clone this repository.

You need to setup a .env file:

```
NODE_ENV=development
PERMISSIONS=68672
CLIENT_ID=<client ID>
BOT_TOKEN=<bot token>
GUILD_ID=<id of your server>
COOKIE=<your cookie extracted from the header request cookie to any geoguessr /api call>
```

Install the dependencies:

```
npm install
```

To start the bot run:

```
npm run build
npm run start
```

If you want to run the development version with Typescript watchers:

- install nodemon globally: `npm i -g nodemon`
- run the dev command

```
npm run dev
```
