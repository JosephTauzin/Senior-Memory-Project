import { Hook } from '@cli-engine/engine';
export default class BrewMigrateHook extends Hook<'update'> {
    run(): Promise<void>;
    taps(): string[];
}
