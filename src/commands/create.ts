import { Command } from "commander";
import fs from "fs";
import path from "path";
import { Logger } from "../utils/logger";
import { Store, StoreData } from "../utils/store";

export class Create {
  public static init(program: Command) {
    program
      .command("create <name>")
      .alias("c")
      .option("-p, --path <pathname>", "Path to the directory")
      .description("Create a new boilerplate")
      .action(async (name: string, args: { path?: string }) => {
        if (name.includes(" ")) {
          Logger.warn("Template name shouldn't consist spaces");
        }
        const existStatus = Store.check(name);
        if (existStatus === "ERROR") return;
        if (existStatus === "EXISTS") {
          Logger.info("Template", name, "already exists");
          return;
        }

        const directoryPath = args?.path || process.cwd();

        if (!fs.existsSync(directoryPath)) {
          Logger.error("Directory", directoryPath, "doesn't exist!");
          return;
        }

        const dirMetaData = this.mapDirectory(directoryPath, name);
        if (dirMetaData === "Error") return;

        const writeStatus = Store.write(`${name}.json`, dirMetaData);
        if (writeStatus === "Success") {
          Logger.success("Template", name, "generated successfully!!");
        }
      });
  }

  private static mapDirectory(directoryPath: string, name: string) {
    try {
      const entities = fs.readdirSync(directoryPath);

      // map through each entity to check if its a file or directory
      const children: any[] = entities.map((entity) => {
        const entityPath = path.join(directoryPath, entity);
        const stats = fs.statSync(entityPath);

        const entityType = stats.isFile()
          ? "File"
          : stats.isDirectory()
          ? "Directory"
          : "Other";

        if (entityType === "Directory") {
          return this.mapDirectory(entityPath, entity);
        } else {
          return this.parseFile(directoryPath, entity, entityType);
        }
      });

      const dirMetaData: StoreData = {
        name,
        type: "Directory",
        children,
      };

      return dirMetaData;
    } catch (err) {
      Logger.error("Error reading directory:", err);
      return "Error";
    }
  }

  private static parseFile(
    directoryPath: string,
    file: string,
    type: "File" | "Other"
  ) {
    const content = fs.readFileSync(
      path.join(directoryPath, file),
      type === "File" ? "utf-8" : "base64"
    );
    const fileMetaData: StoreData = {
      name: file,
      type,
      content,
    };

    return fileMetaData;
  }
}
