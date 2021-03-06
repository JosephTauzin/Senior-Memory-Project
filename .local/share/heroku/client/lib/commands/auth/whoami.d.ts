import { Command } from '@heroku-cli/command';
export default class Whoami extends Command {
    static topic: string;
    static command: string;
    static description: string;
    static aliases: string[];
    run(): Promise<void>;
    notloggedin(): void;
}
