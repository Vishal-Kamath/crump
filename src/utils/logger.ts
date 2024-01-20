import chalk from "chalk";

export class Logger {
  static error(...msg: any[]) {
    console.log(
      `${chalk.red("ERROR")} ${msg.map((val) => String(val)).join(" ")}`
    );
  }
  static warn(...msg: any[]) {
    console.log(
      `${chalk.yellow("WARN")} ${msg.map((val) => String(val)).join(" ")}`
    );
  }
  static info(...msg: any[]) {
    console.log(
      `${chalk.cyan("INFO")} ${msg.map((val) => String(val)).join(" ")}`
    );
  }
  static success(...msg: any[]) {
    console.log(
      `${chalk.green("SUCCESS")} ${msg.map((val) => String(val)).join(" ")}`
    );
  }
}
