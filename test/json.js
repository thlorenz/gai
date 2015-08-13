'use strict';

var test = require('tape')
var path = require('path')
var exec = require('child_process').execSync;

var rootDir     = path.join(__dirname, '..');
var examplesDir = path.join(rootDir, 'examples');

function cleanVolatiles(info) {
  function cleanStep(s) {
    delete s.diff.esp
    delete s.diff.ebp
    delete s.regs.esp
    delete s.regs.ebp
  }
  info.steps.forEach(cleanStep)
  return info
}

test('\nsetup', function (t) {
  exec('make clean', { cwd: examplesDir })
  exec('chmod u+x gai-*', { cwd: rootDir })
  exec('mkdir -p test/results', { cwd: rootDir })
  t.end()
})

function check(executable) {
  exec('make ' + executable, { cwd: examplesDir })

  test('\ngenerating json for ' + executable, function (t) {
    exec('make clean && make ' + executable, { cwd: examplesDir })
    exec('./gai-json examples/' + executable + ' > test/results/' + executable + '.json', { cwd: rootDir })
    var fixture = require('./fixtures/' + executable + '.json')
    var result = require('./results/' + executable + '.json')

    t.deepEqual(cleanVolatiles(result), cleanVolatiles(fixture), 'generates expected json')

    t.end()
  })
}

check('inc')
check('strlen')
check('strncmp')
check('jmp')

test('\nteardown', function (t) {
  exec('make clean', { cwd: examplesDir })
  exec('chmod u-x gai-*', { cwd: rootDir })
  exec('rm -rf test/results', { cwd: rootDir })
  t.end()
})
