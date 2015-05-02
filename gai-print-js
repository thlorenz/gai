#!/usr/bin/env node
'use strict';

var colors = require('ansicolors')
var table = require('text-table')

if (process.argv.length < 3) {
  fromStdin();
} else {
  var steps= require(process.argv[2]).steps
  print(steps);
}

function fromStdin() {
  var data = [];
  function onerror(err) {
    console.error('gai-pring-js ', err)
  }

  process.stdin
    .on('data', ondata)
    .on('end', onend)
    .on('error', onerror)

  function ondata(d) {
    data.push(d);
  }

  function onend() {
    var json = Buffer.concat(data).toString();
    try {
      print(JSON.parse(json).steps);
    } catch(err) {
      console.error(json);
      console.error(err);
    }
  }
}

function tableize(step) {
  var first = true;
  function toString(acc, k) {
    if (k === 'eip') return acc; // instruction pointer always changes and isn't important here
    var d = step.diff[k];
    var s = acc;
    s += first ? ';' : ',';
    s += ' ' + k + ': ' + d.prev.hex + ' -> ' + d.curr.hex;

    if (k === 'eflags') s += ' ' + d.curr.flagsString;
    first = false;
    return s;
  }
  var diffString = step.diff
    ? Object.keys(step.diff).reduce(toString, '')
    : ''

  var m = step.instruction.match(/^([a-f0-9]{2} )+/);
  var opcodes = m[0].trim()
    , inst = step.instruction.replace(opcodes, '').trim();

  return [ colors.brightBlack(step.address), colors.brightBlue(opcodes), colors.green(inst), colors.brightBlack(diffString) ];
}

function print(steps) {
  var tableized = steps.map(tableize);
  console.log(table(tableized));
}

