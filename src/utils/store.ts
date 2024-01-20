import path from "path";
import fs from "fs";
import { Logger } from "./logger";

export interface StoreData {
  name: string;
  type: "File" | "Directory" | "Other";
  content?: string;
  children?: StoreData[];
}

export class Store {
  private static storePath = path.join(__dirname, "..", "..", "store");

  public static check(name: string) {
    try {
      const templates = this.list();
      if (templates.includes(name)) {
        return "EXISTS";
      } else {
        return "OK";
      }
    } catch (err) {
      Logger.error("something went wrong", err);
      return "ERROR";
    }
  }

  public static list() {
    const templates = fs
      .readdirSync(this.storePath)
      .map((nameWithExtension) => {
        const namesArray = nameWithExtension.split(".");
        namesArray.pop();
        return namesArray.join(".");
      });

    return templates;
  }

  public static write(name: string, data: StoreData) {
    try {
      if (!fs.existsSync(this.storePath)) {
        fs.mkdirSync(this.storePath);
      }

      fs.writeFileSync(
        path.join(this.storePath, name),
        JSON.stringify(data),
        "utf-8"
      );
      return "Success";
    } catch (err) {
      Logger.error("store write error", err);
      return "ERROR";
    }
  }

  public static read(name: string) {
    try {
      const checkIfExists = fs.existsSync(
        path.join(this.storePath, `${name}.json`)
      );
      if (!checkIfExists) {
        return "DOESN'T EXIST";
      }

      const data = fs.readFileSync(
        path.join(this.storePath, `${name}.json`),
        "utf-8"
      );
      return JSON.parse(data) as StoreData;
    } catch (err) {
      Logger.error("store read error", err);
      return "ERROR";
    }
  }

  public static delete(name: string) {
    try {
      const checkIfExists = fs.existsSync(
        path.join(this.storePath, `${name}.json`)
      );
      if (!checkIfExists) {
        return "DOESN'T EXIST";
      }

      fs.unlinkSync(path.join(this.storePath, `${name}.json`));
      return "SUCCESS";
    } catch (err) {
      Logger.error("store delete error", err);
      return "ERROR";
    }
  }
}
