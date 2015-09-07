'use strict';


var exec = require('child_process').execSync
if (typeof exec !== 'function') {
  console.error('Sorry need execSync, please use node 0.12 or greater')
  process.exit(1)
}
var offset = parseInt('0x08048000', 16)

function hex(x) {
  var hex =  x.toString(16)
  return hex.length < 2 ? '0' + hex : hex;
}

function chunks(s) {
  var acc = []
  for (var i = 0, len = s.length; i < len; i += 2) {
    acc.push(s[i] + s[i + 1])
  }
  return acc
}

function textSectionLength(file) {
  try {
    var buf = exec(
      'objcopy --only-section=.text -O binary ' + file +
      ' /tmp/gai-hex && xxd -ps /tmp/gai-hex'
    )
    return chunks(buf.toString().split('\n').join('').trim()).length
  } catch(e) {
    console.error(e)
    console.error('Make sure you have "objcopy" and "hexdump" installed.')
  }
}

// currently not working properly in some cases in which it drops part of
// the program code we need. Using textSectionLength instead (adds more but always works)
function maxAddress(results) {
  var max = 0
  for (var i = 0, len = results.length; i < len; i++) {
    var res = results[i]
    // start of instruction needs to be larger than current max of start + opcodes length
    // in order to come after it
    var addr = parseInt(res.address, 16)
    if (addr < max) continue
    var m = res.instruction.match(/^([a-f0-9]{2} )+/);
    if (!m) throw new Error('Couldn\'t find opcode for ' + inst);

    max = addr + m[0].split(/[\n ]/).join('').trim().length;
  }
  return max
}

var go = module.exports = function opcodes(file, results, entryPoint) {
  try {
    var buf = exec(
      'objcopy ' + file +
      ' /tmp/gai-hex && xxd -ps /tmp/gai-hex'
    )
    var exitPoint = maxAddress(results)

    var all = chunks(buf.toString().split('\n').join('').trim())
    var drop = parseInt(entryPoint, 16) - offset;
    // only interested in text section (can't exactly find .gai_e which would be ideal)
    return all.slice(drop, drop + textSectionLength(file))
  } catch(e) {
    console.error(e)
    console.error('Make sure you have "objcopy" and "hexdump" installed.')
  }
}
