const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(`admin controller test - RESTful API Time:${new Date(Date.now()).toTimeString()}`);
});

function _loadDir(dirpath) {
  return new Promise(((resolve) => {
    const route = path.resolve(process.cwd(), dirpath);
    fs.readdir(route, (_err, items) => resolve(items));
  }));
}
function _loadFile(filePath) {
  return new Promise(((resolve) => {
    const route = path.resolve(process.cwd(), filePath);
    fs.readFile(route, 'utf8', (_err, data) => resolve(data));
  }));
}
function _writeFile(filePath, content) {
  return new Promise(((resolve, reject) => {
    const route = path.resolve(process.cwd(), filePath);
    fs.writeFile(route, content, 'utf8', (err) => {
      if (!err) {
        return resolve();
      }
      return reject(err);
    });
  }));
}
router.get('/logs/all', async (req, res) => {
  const logFiles = await _loadDir('./logs/all');
  const logFilesResp = [];
  for (let i = 0; i < logFiles.length; i++) {
    logFilesResp.push({ file: logFiles[i], url: `/admin/logs/all/${logFiles[i]}` });
  }
  res.json(logFilesResp);
});
router.get('/logs/all/:filename', async (req, res) => {
  const filename = req.params.filename;
  const file = await _loadFile(`./logs/all/${filename}`);
  res.send(file);
});
router.get('/logs/error', async (req, res) => {
  const logFiles = await _loadDir('./logs/error');
  const logFilesResp = [];
  for (let i = 0; i < logFiles.length; i++) {
    logFilesResp.push({ file: logFiles[i], url: `/admin/logs/error/${logFiles[i]}` });
  }
  res.json(logFilesResp);
});
router.get('/logs/error/:filename', async (req, res) => {
  const filename = req.params.filename;
  const file = await _loadFile(`./logs/error/${filename}`);
  res.send(file);
});

// get config
router.get('/config', async (req, res) => {
  const file = await _loadFile('./server/library/recipeSiteIndex.json');
  res.send(file);
});
// update config
router.post('/config', async (req, res) => {
  const body = req.body;
  try {
    await _writeFile('./server/library/recipeSiteIndex.json', JSON.stringify(body));
    res.status(204).send();
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
