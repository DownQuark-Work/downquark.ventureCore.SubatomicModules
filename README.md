# downquark.ventureCore.SubatomicModules
DownQuark Created Projects (or locally forked repos) to be used as submodules throughout our repositories

---
## Branches
This repository should have _**only**_ two branches.
1. `main` will be references by _only_ the`main` branch of any repository 
1.  _All_ other sub-modules should reference `develop`

> any submodule updates should be deployed and vetted on `develop` before submitting to `main`

---

There should be a minimum amount of edits made directly to this repo.
We are using it as a centralized location to store downquark's custom files, as well as many that my be received in the future.

When developing utlilities sub-modules, the work should be done in a repository that will be implementing the finished product.
Once the module is complete it should be copied/forked/etc into this repository where it can be fully distributed.

Below are some reference links - and helper scripts/aliases will be soon to follow.

- [https://medium.com/@mattjacquet/how-to-start-with-git-submodule-9ed09d9fe56d](https://medium.com/@mattjacquet/how-to-start-with-git-submodule-9ed09d9fe56d)
- [https://medium.com/@porteneuve/mastering-git-submodules-34c65e940407](https://medium.com/@porteneuve/mastering-git-submodules-34c65e940407)
- [https://www.sitepoint.com/git-submodules-introduction/](https://www.sitepoint.com/git-submodules-introduction/)
- [https://gist.github.com/gitaarik/8735255?permalink_comment_id=3390509#gistcomment-3390509](https://gist.github.com/gitaarik/8735255?permalink_comment_id=3390509#gistcomment-3390509)
- [https://rameshvarun.github.io/blog-cells/](https://rameshvarun.github.io/blog-cells/)
- [https://github.com/rameshvarun/blog-cells/blob/main/src/index.html](https://github.com/rameshvarun/blog-cells/blob/main/src/index.html)
- [https://ardupilot.org/dev/docs/git-submodules.html](https://ardupilot.org/dev/docs/git-submodules.html)
- [https://github.com/ArduPilot/ardupilot/blob/master/.gitmodules](https://github.com/ArduPilot/ardupilot/blob/master/.gitmodules)
- [https://www.vogella.com/tutorials/GitSubmodules/article.html#submodules](https://www.vogella.com/tutorials/GitSubmodules/article.html#submodules)
