#!/usr/bin/env node
import { Command } from "commander";
import { Create } from "./commands/create";
import { Generate } from "./commands/generate";
import { List } from "./commands/list";
import { Delete } from "./commands/delete";

const program = new Command();

// command
Create.init(program);
Generate.init(program);
List.init(program);
Delete.init(program);

program.parse(process.argv);
