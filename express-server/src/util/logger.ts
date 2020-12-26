import colors from 'colors';

export class Logger {
  constructor(private fileName: string) { }

  private formatMessage(message: string): string {
    return `[${this.fileName}] ${message}`;
  }

  public success(message: string): void {
    console.log(colors.green(this.formatMessage(message)));
  }

  public info(message: string): void {
    console.log(colors.cyan(this.formatMessage(message)));
  }

  public warn(message: string): void {
    console.log(colors.yellow(this.formatMessage(message)));
  }

  public error(message: string, error?: any): void {
    console.log(
      colors.red(this.formatMessage(message)),
      JSON.stringify(error)
    );
  }
}