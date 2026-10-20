// Run with Node.js: node tests/learning-record.cjs
const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function storageFixture(user) {
  const values = new Map([['eac_user',JSON.stringify(user)]]);
  const context = vm.createContext({console, localStorage: {
    setItem: (k,v) => values.set(k,v), getItem: k => values.get(k) ?? null,
    removeItem: k => values.delete(k)
  }});
  for (const file of ['src/js/core/config.js','src/js/core/storage.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
  return code => vm.runInContext(code,context);
}
test('legacy aggregates survive; new per-question records track latest result and all attempts', () => {
  const run = storageFixture({id:'legacy',progress:{totalQuestionsAttempted:8,correctAnswers:5,byTopic:{}}});
  assert.equal(run("Storage.saveQuestion('polynomial','calculation','medium','test-question',false,{skill:'roots',selectedAnswer:'A'})"),true);
  assert.equal(run('Storage.getUser().progress.totalQuestionsAttempted'),9);
  assert.equal(run('Storage.getUser().progress.correctAnswers'),5);
  assert.equal(run("Storage.getUser().progress.byQuestion['test-question'].lastCorrect"),false);
  run("Storage.saveQuestion('polynomial','calculation','medium','test-question',true,{skill:'roots',selectedAnswer:'B'})");
  assert.equal(run("Storage.getUser().progress.byQuestion['test-question'].lastCorrect"),true);
  assert.equal(run("Storage.getUser().progress.byQuestion['test-question'].attempts"),2);
  assert.equal(run("Storage.getUser().progress.byQuestion['test-question'].correct"),1);
  assert.equal(run("Storage.getUser().progress.byTopic.polynomial.calculation.medium.completed.length"),1);
  assert.equal(run('Storage.getUser().progress.totalQuestionsAttempted'),10);
  assert.equal(run('Storage.getUser().progress.correctAnswers'),6);
  assert.equal(run('Object.keys(Storage.getUser().progress.byQuestion).length'),1);
});
test('correct, wrong, correct attempts update review status independently for each question', () => {
  const run = storageFixture({id:'new',progress:{}});
  run("Storage.saveQuestion('four-centres','conceptual','easy','q1',true)");
  run("Storage.saveQuestion('four-centres','conceptual','easy','q2',false)");
  run("Storage.saveQuestion('four-centres','conceptual','easy','q1',false)");
  assert.equal(run('Object.values(Storage.getUser().progress.byQuestion).filter(q => !q.lastCorrect).length'),2);
  run("Storage.saveQuestion('four-centres','conceptual','easy','q1',true)");
  assert.equal(run('Object.values(Storage.getUser().progress.byQuestion).filter(q => !q.lastCorrect).length'),1);
});
