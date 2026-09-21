#!/usr/bin/env node

import { Command } from "commander";

import {
  newCommand,
} from "./commands/new.js";

import {
  addCommand,
} from "./commands/add.js";

import {
  infoCommand,
} from "./commands/info.js";

import {
  doctorCommand,
} from "./commands/doctor.js";

const program = new Command();

program
  .name("forge")
  .description(
    "Personal project scaffolding CLI"
  )
  .version("0.5.0");

program.addCommand(newCommand);
program.addCommand(addCommand);
program.addCommand(infoCommand);

program.command("doctor")
  .description(
    "Check the current project for Forge configuration issues"
  )
  .action(doctorCommand);

program.parse();