import { Command } from "commander";
import { Logger } from "../utils/logger";
import { Store } from "../utils/store";

export class Delete {
  public static init(program: Command) {
    program
      .command("delete <name>")
      .alias("d")
      .description("Delete a template")
      .action((name) => {
        const deleteStatus = Store.delete(name);
        if (deleteStatus === "ERROR") return;
        if (deleteStatus === "DOESN'T EXIST") {
          Logger.error("Template", name, "doesn't exist!");
          return;
        }

        Logger.success("Template", name, "deleted successfully!");
      });
  }
}
