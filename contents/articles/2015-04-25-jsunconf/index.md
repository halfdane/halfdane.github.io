# JSUnconf

## Continuous Delivery with Docker (Non-blocking delivery pipeline)
(lowsky.github.io/dockerMeetupSlides/)

- They use Kanban-Workflow for 4-8 people
- Migrate to multiple pipelines
- gitflow with feature, develop, release, hotfix branches
- Pipeline can become a bottleneck - wait for commit to build
- Tests are slow and block development
- waffle.io: link project to see your github-issues (like trello for jira)
- use pull requests to integrate feature commits/branches
- nice integration of github-commits to jenkins-builds
- deploy feature branches to docker to see it working
- pre-commit testing to avoid merge conflicts etc.
- docker: layered filesystems, topmost is writeable
- tag the new image with feature-branch-name
- deploy to a dedicated machine and use ngnix-proxy's url-rewriting (docker-image) to have it dns-named like the branch
- start docker with virtual-host parameter
- `docker events` can be used to listen to lifecycle messages of other images on same machine
- `docker logs`
- Mesos/Marathon + HAproxy
- blog.codecentric.de

## More functional programming (higher order functions to transducers)
- yalst.de (live support tool?)
- rambda.js (functional js library)

## Precompiler Hell
- transpiler (less, sass, coffeescript, typescript)
- first: immediate feedback without jobs waiting for
- build loops are run hundrets or thousand times a day
- less can run within the browser, so it's still kinda immediate
- project gets bigger, in-browser compilation gets slower
- server compiles sass-stuff
- problems arise when javascript gets compiled
- tooling problems (linter for coffeescript?)
- filesystem as interface: request one file type and have it compiled transparently
- [fusile](https://github.com/Munter/fusile) (depends on [daccord](https://github.com/jenius/accord))
-- autoprefixing
-- sourcemaps
-- caching
-- filewatching

## What I learned teaching 150 young women programming
- Women's International Leadership Conference
- Choose JS as intro-language because
-- 2hrs slot doesn't allow for tool setup, so no Java, Lua
-- not even an editor necessary: [Mozilla Thimble](https://thimble.webmaker.org/)
- variables, arrays, loops, functions, operators, conditions
- prepare duckhunt skeleton game empty spaces to fill (moveTheDuck, isDuckHit, isDuckDead)
- be prepared to give a working answer, just in case people don't get it
- challenge noobs: newcomers can to more than expected
- typography 
-- make sure things on slides look exactly the same as on their screen
-- make sure characters can be easily distinguished.
- FIND INSPIRING ROLEMODELS. 


## Hints anbei
- X2go.org
