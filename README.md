# resume pick app

[![Total alerts](https://img.shields.io/lgtm/alerts/g/guissy/resume-pick-app.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/guissy/resume-pick-app/alerts/)

## base electron

## fix

node_modules/textract/lib/extract.js:82

```js
extractors = fs.readdirSync(extractorPath).map(function (item) {
  var fullExtractorPath = path.join(extractorPath, item);
  // get the extractor
  // eslint-disable-next-line global-require
  return require(fullExtractorPath);
});
```

replace with

```js
extractors = [
  require('./extractors/doc'),
  require('./extractors/docx'),
  require('./extractors/doc-osx'),
  require('./extractors/text'),
];
```

### features:

- [ ] boss
- [ ] pk
- [ ] review
- [ ] java / go
- [ ] search fuzzy
- [ ] remove
