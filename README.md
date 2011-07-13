Huh?
----

Beet keeps track of child processes (primarily node.js), and makes sure they stay alive. It also has a few hooks so that beet *itself* stays alive, even after the system restarts.

Why?
----

Because.

What's with the name?
---------------------

Beet (heart beat) is a vegetable. It makes sense since we're Spice Apps. Damn I love food...

Requirments:
------------

- NPM
- Git (if using git hooks)
- Monit (if running Linux)
- Upstart (if running Linux)

Installation:
-------------

	npm install beet
	
Support:
-------

- Mac (launchctl)
- *soon* Linux (upstart + monit)


Goodies:
--------

- Keeps apps running even after the system restarts. 
- checks health on running apps and restarts any which are non-responsive.
- Extendable thanks to [brazln](https://github.com/spiceapps/brazln). 


Terminal Usage:
---------------

make sure you have a package.json in the directory of your node.js app:

	beet add <app path | git repo> 
	
Once you've added your app:

	beet start <app name>
	
stop an app:

	beet stop <app name>
	
remove an app completely:
	
	beet remove <app name>
		
list the running apps:
	
	beet list
	
Hooking a git repo:
-------------------

Terminal:

	beet add https://spiceapps@github.com/spiceapps/beet-test.git; 
	beet start beet-test;
	
Next, add your [github post-receive hook](http://help.github.com/post-receive-hooks/):

	http://my-website.com:59300/git/push/beet-test


Finally: make changes, commit, and watch the server restart.


Node.js Usage:
--------------

Getting there...

	
To Do:
-----

- Better logging for broken apps.
- Use the beet pods in other [brazln](https://github.com/spiceapps/brazln)-based apps.
- Dispatch git commits to any other "glued" beet instances (cluster).
- Need to setup http-auth for pushing git commits.
- Help file for CLI.
- Custom client arguments so pods can handle cli args. E.g: setting express.core port.
- Blah. express.core needs to be able to set own http port.
- Need to test on other linux distros (currently works on Ubuntu).
- Ability to call "beet add" without directory (look at CWD)
- Move config.json from global -> local OR assign beets to "collection" of running apps (yeah... that sounds better). This allows beet to be used in code. 
