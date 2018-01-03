"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const engine_1 = require("@cli-engine/engine");
const child_process_1 = require("child_process");
const cli_ux_1 = require("cli-ux");
const path = require("path");
const fs = require("../../file");
const debug = require('debug')('heroku:completions');
function brew(args, opts = {}) {
    debug('brew %o', args);
    return child_process_1.spawnSync('brew', args, Object.assign({ stdio: 'inherit' }, opts, { encoding: 'utf8' }));
}
class BrewMigrateHook extends engine_1.Hook {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (this.config.platform !== 'darwin')
                    return;
                const brewRoot = path.join(process.env.HOMEBREW_PREFIX || '/usr/local');
                let p;
                try {
                    p = fs.realpathSync(path.join(brewRoot, 'bin/heroku'));
                }
                catch (err) {
                    if (err.code === 'ENOENT')
                        return;
                    throw err;
                }
                if (!p.startsWith(path.join(brewRoot, 'Cellar')))
                    return;
                if (this.taps().includes('heroku/brew'))
                    return;
                debug('migrating from brew');
                // not on private tap, move to it
                cli_ux_1.default.action.start('Upgrading homebrew formula');
                brew(['tap', 'heroku/brew']);
                brew(['upgrade', 'heroku/brew/heroku']);
                cli_ux_1.default.action.stop();
            }
            catch (err) {
                debug(err);
            }
        });
    }
    taps() {
        const { stdout } = brew(['tap'], { stdio: [0, 'pipe', 2] });
        return stdout.split('\n');
    }
}
exports.default = BrewMigrateHook;
