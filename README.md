# halfdane.github.io

These are the files that make up my private site/blog at halfdane.github.io.

## Setup
Preferrably use [rbenv](https://github.com/rbenv/rbenv#installation) and 
[nvm](curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.7/install.sh | bash) 
for user-owned ruby and node installations

```bash
git clone git@github.com:halfdane/halfdane.github.io.git --branch wintersmith --single-branch
cd halfdane.github.io
npm install
gem install compass susy breakpoint
```

## Develop
`./node_modules/.bin/grunt server`

## Build
`./node_modules/.bin/grunt build`