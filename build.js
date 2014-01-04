'use strict';

var assert = require('assert');
var fs = require('fs');

var step = require('testit');
var gethub = require('gethub');
var mkdirp = require('mkdirp').sync;
var rimraf = require('rimraf').sync;


step('cleanup', function () {
  rimraf(__dirname + '/bootstrap');
});

step('download', function () {
  return gethub('twbs', 'bootstrap', 'v3.0.3', __dirname + '/bootstrap');
}, '60 seconds');


step('copy less files', function () {
  rimraf(__dirname + '/less');
  mkdirp(__dirname + '/less');
  var files = fs.readdirSync(__dirname + '/bootstrap/less');
  for (var i = 0; i < files.length; i++) {
    if (/\.less$/.test(files[i])) {
      var src = fs.readFileSync(__dirname + '/bootstrap/less/' + files[i], 'utf8');
      fs.writeFileSync(__dirname + '/less/' + files[i], src);
    }
  }
});

step('copy js files', function () {
  rimraf(__dirname + '/lib');
  mkdirp(__dirname + '/lib');
  var prefix = 'var jQuery = require("jquery");\nmodule.exports = jQuery;\n';
  var files = fs.readdirSync(__dirname + '/bootstrap/js');
  for (var i = 0; i < files.length; i++) {
    if (/\.js$/.test(files[i])) {
      var src = fs.readFileSync(__dirname + '/bootstrap/js/' + files[i], 'utf8');
      src = prefix + src;
      fs.writeFileSync(__dirname + '/lib/' + files[i], src);
    }
  }
});

step('copy js fonts', function () {
  rimraf(__dirname + '/fonts');
  mkdirp(__dirname + '/fonts');
  var files = fs.readdirSync(__dirname + '/bootstrap/fonts');
  for (var i = 0; i < files.length; i++) {
    var src = fs.readFileSync(__dirname + '/bootstrap/fonts/' + files[i]);
    fs.writeFileSync(__dirname + '/fonts/' + files[i], src);
  }
});

step('create index.js', function () {
  var buf = [];
  buf.push('"use strict";');
  buf.push('');
  buf.push('var jQuery = require("jquery");');
  buf.push('');
  buf.push('module.exports = jQuery');
  buf.push('');
  var files = fs.readdirSync(__dirname + '/bootstrap/js');
  for (var i = 0; i < files.length; i++) {
    if (/\.js$/.test(files[i])) {
      buf.push('require("./lib/' + files[i] + '");');
    }
  }
  buf.push('');
  fs.writeFileSync(__dirname + '/index.js', buf.join('\n'));
});

step('copy LICENSE', function () {
  var src = fs.readFileSync(__dirname + '/bootstrap/LICENSE-MIT', 'utf8');
  fs.writeFileSync(__dirname + '/BOOTSTRAP-LICENSE', src);
});

step('cleanup', function () {
  rimraf(__dirname + '/bootstrap');
});