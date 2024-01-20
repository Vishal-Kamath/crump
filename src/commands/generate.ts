import { Command } from "commander";
import { Store, StoreData } from "../utils/store";
import { Logger } from "../utils/logger";
import fs from "fs";
import path from "path";

export class Generate {
  public static init(program: Command) {
    program
      .command("generate <name>")
      .alias("g")
      .alias("gen")
      .description("")
      .action((name) => {
        const data = Store.read(name);

        if (data === "ERROR") return;
        if (data === "DOESN'T EXIST") {
          Logger.error("Template", name, "doesn't exist!");
          return;
        }

        const directoryPath = process.cwd();
        const genStatus = this.writeDir(directoryPath, data);

        if (genStatus === "SUCCESS") {
          Logger.success(
            "Template",
            name,
            "successfully generated at",
            directoryPath
          );
        }
      });
  }

  private static writeDir(directoryPath: string, data?: StoreData) {
    try {
      if (!data || data.children?.length === 0) return;

      data.children?.forEach((entity) => {
        const entityPath = path.join(directoryPath, entity.name);

        if (entity.type === "Directory") {
          if (!fs.existsSync(entityPath)) {
            fs.mkdirSync(entityPath);
          }
          this.writeDir(entityPath, entity);
        } else {
          if (fs.existsSync(entityPath)) {
            Logger.warn(
              entity.name,
              "already exists at path",
              directoryPath,
              "so no changes have been made"
            );
          }
          fs.writeFileSync(
            entityPath,
            entity.content!,
            entity.type === "File" ? "utf-8" : "base64"
          );
        }
      });
      return "SUCCESS";
    } catch (err) {
      Logger.error("write dir error", err);
      return "ERROR";
    }
  }
}
