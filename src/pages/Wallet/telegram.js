const TelegramBot = require('node-telegram-bot-api');
const jsonfile = require('jsonfile');
const path = require('path');
const _ = require('lodash');

const token = ''; // ninja_orgbot
const bot = new TelegramBot(token, { polling: true });

async function start() {

}

const userFile = 'users.txt';

let users = readFile(userFile);
if (users == null) users = [];

if (users.length > 0) {
  // alert users when reset bot
  // for (let u of users) {
  // 	bot.sendMessage(u.chatId, 'Reset bot!');
  // }
}

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  // console.log(msg);
  bot.sendMessage(chatId, `Hey Ninja ${msg.chat.username}! Welcome to the dojo.`);
  bot.sendMessage(chatId, 'Join the Ninja telegram group to unlock access to the Shuriken (SRK) Airdrop. ' +
    'Complete the mission instructions to receive 80 shurikens. ' +
    'Your unique referral link will then be sent to you. Invite your friends and get 20 Shurikens for each new ninja!');
  bot.sendMessage(chatId, '<a href="https://t.me/ninja_org">Be a Ninja</a>', { parse_mode: 'HTML' });
  // defaultKeyboard(chatId);


  if (!users) { users = []; }

  console.log(1);
  if (!_.find(users, msg.chat)) {
    console.log(2);
    users.push(msg.chat);
    saveFile(userFile, users);
  }
});

function saveFile(fileName, data) {
  const filePath = path.resolve(__dirname, fileName);
  jsonfile.writeFile(filePath, data, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function readFile(fileName) {
  const filePath = path.resolve(__dirname, fileName);
  return jsonfile.readFileSync(filePath);
}
