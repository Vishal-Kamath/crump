import { Command } from "commander";
import { Store } from "../utils/store";
import chalk from "chalk";

export class List {
  public static init(program: Command) {
    program
      .command("list")
      .alias("l")
      .description("List all the available templates")
      .action(() => {
        const list = Store.list();

        console.log(chalk.cyan("\nTemplates:"));
        list.map((name) => {
          console.log(`  - ${name}`);
        });
      });
  }
}
