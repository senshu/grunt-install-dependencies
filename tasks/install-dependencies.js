'use strict';

module.exports = function (grunt) {
  const exec = require('child_process').exec;

  function execCmd(cmd, options, cb) {
      const cp = exec(cmd, {cwd: options.cwd}, function (err, stdout, stderr) {
        if (err && options.failOnError) {
          grunt.warn(err);
        }
        cb();
      });

      if (options.stdout || grunt.option('verbose')) {
        console.log("Running npm install in: " + options.cwd);
        cp.stdout.pipe(process.stdout);
      }

      if (options.stderr || grunt.option('verbose')) {
        cp.stderr.pipe(process.stderr);
      }
  }

  grunt.registerMultiTask('install-dependencies', 'Installs npm dependencies.', function () {
    const cb = this.async();
    const options = this.options({
      cwd: '',
      stdout: true,
      stderr: true,
      failOnError: true,
      isDevelopment: false
    });

    grunt.verbose.writeflags(options, 'Options');

    let cmd = "npm install";
    if(!options.isDevelopment ) cmd += " -production";
    execCmd(cmd, options, () => {
        execCmd("npm audit fix", options, cb);
    });
  });
};
