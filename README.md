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

> From the repo that will be importing the submodule, do the following:
---
## add submodule and define the branch you want to track:
> Below is what I've found after trial and error - allows specifying different branches as directories within the same parent directory.

`git submodule add -f -b <SUBMODULE_BRANCH> <SUBMODULE_REPOSITORY_URL> "<LOCAL_DEVELOPMENT_INSTALL_PATH>"`

Then, for sanity:

`git submodule init`

<details><summary>View Process Output</summary>

`git submodule add -f -b feature/generators/prng https://github.com/DownQuark-Work/downquark.ventureCore.SubatomicModules.git "modules/subquark-prng"`
> Cloning into '/Users/mlnck/Development/_dq/dq/downquark.applicationFoss.GuiTui/modules/subquark-prng'...

_.gitmodules_
```
[submodule "modules/subquark-prng"]
	path = modules/subquark-prng
	url = https://github.com/DownQuark-Work/downquark.ventureCore.SubatomicModules.git
	branch = feature/generators/prng
```

`git submodule add -f -b develop https://github.com/DownQuark-Work/downquark.ventureCore.SubatomicModules.git "modules/subquark-develop"`
> Cloning into '/Users/mlnck/Development/_dq/dq/downquark.applicationFoss.GuiTui/modules/subquark-develop'...

_.gitmodules_
```
[submodule "modules/subquark-prng"]
	path = modules/subquark-prng
	url = https://github.com/DownQuark-Work/downquark.ventureCore.SubatomicModules.git
	branch = feature/generators/prng
[submodule "modules/subquark-develop"]
	path = modules/subquark-develop
	url = https://github.com/DownQuark-Work/downquark.ventureCore.SubatomicModules.git
	branch = develop
```

`git submodule add -f -b develop https://github.com/DownQuark-Work/downquark.ventureCore.SubatomicModules.git "modules/subquark-main"`
> Cloning into '/Users/mlnck/Development/_dq/dq/downquark.applicationFoss.GuiTui/modules/subquark-main'...

_.gitmodules_
```
[submodule "modules/subquark-prng"]
	path = modules/subquark-prng
	url = https://github.com/DownQuark-Work/downquark.ventureCore.SubatomicModules.git
	branch = feature/generators/prng
[submodule "modules/subquark-develop"]
	path = modules/subquark-develop
	url = https://github.com/DownQuark-Work/downquark.ventureCore.SubatomicModules.git
	branch = develop
[submodule "modules/subquark-main"]
	path = modules/subquark-main
	url = https://github.com/DownQuark-Work/downquark.ventureCore.SubatomicModules.git
	branch = develop
```

</details>

### To Remove all Submodules:
> NOTE: if having issues ensure the following directory is empty:
> _.git/modules_
>  **AND** that the submodule listings have been removed from:
> _.git/config_
```
% rm -rf <SUBMODULES_DIRECTORY> && mkdir <SUBMODULES_DIRECTORY>
% rm .gitmodules
% rm -rf .git/modules/*
% # manually remove listings from: .git/config
```

```
# update your submodule --remote fetches new commits in the submodules
# and updates the working tree to the commit described by the branch
git submodule update --remote
```
---

1. Cloning a repository that contains submodules
If you want to clone a repository including its submodules you can use the --recursive parameter.

`git clone --recursive [URL to Git repo]`

- If you already have cloned a repository and now want to load it’s submodules you have to use submodule update.

`git submodule update --init`
# if there are nested submodules:
`git submodule update --init --recursive`

--
> To manually update submodules use the following command
> `git submodule update --recursive`
> Very occasionally a new submodule is added, after which every developer must run this command:
> `git submodule init`
-
> `git submodule sync`
> `git submodule update --init --recursive`
--

## Delete a submodule from a repository
Currently Git provides no standard interface to delete a submodule. To remove a submodule called mymodule you need to:

```
git submodule deinit -f — mymodule
rm -rf .git/modules/mymodule
git rm -f mymodule
```
---

- [https://medium.com/@mattjacquet/how-to-start-with-git-submodule-9ed09d9fe56d](https://medium.com/@mattjacquet/how-to-start-with-git-submodule-9ed09d9fe56d)
- [https://medium.com/@porteneuve/mastering-git-submodules-34c65e940407](https://medium.com/@porteneuve/mastering-git-submodules-34c65e940407)
- [https://www.sitepoint.com/git-submodules-introduction/](https://www.sitepoint.com/git-submodules-introduction/)
- [https://gist.github.com/gitaarik/8735255?permalink_comment_id=3390509#gistcomment-3390509](https://gist.github.com/gitaarik/8735255?permalink_comment_id=3390509#gistcomment-3390509)
- [https://rameshvarun.github.io/blog-cells/](https://rameshvarun.github.io/blog-cells/)
- [https://github.com/rameshvarun/blog-cells/blob/main/src/index.html](https://github.com/rameshvarun/blog-cells/blob/main/src/index.html)
- [https://ardupilot.org/dev/docs/git-submodules.html](https://ardupilot.org/dev/docs/git-submodules.html)
- [https://github.com/ArduPilot/ardupilot/blob/master/.gitmodules](https://github.com/ArduPilot/ardupilot/blob/master/.gitmodules)
- [https://www.vogella.com/tutorials/GitSubmodules/article.html#submodules](https://www.vogella.com/tutorials/GitSubmodules/article.html#submodules)

