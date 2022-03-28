"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const main_1 = require("./main");
const program = new commander_1.Command();
program
    .version('0.0.1')
    .name('fy')
    .usage('<English>')
    .arguments('<English>')
    .action(function (english) {
    (0, main_1.translate)(english);
});
program.parse(process.argv);
