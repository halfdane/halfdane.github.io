#JSUnconf

##Continuous Delivery with Docker (Non-blocking delivery pipeline)
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