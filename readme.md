# TTF PostScript Name

A small utility to extract the PostScript name from a TrueType font file.

Extracted from [trevordixon/ttfinfo](https://github.com/trevordixon/ttfinfo), which is a more comprehensive tool for extracting metadata from TrueType fonts.

## Installation

```sh
npm install ttf-postscript-name
```

## Usage

```js
import ttfPostscriptName from 'ttf-postscript-name'

const filecontents = fs.readFileSync('path/to/font.ttf')
const postscriptName = ttfPostscriptName(filecontents)
console.log(postscriptName)
```
