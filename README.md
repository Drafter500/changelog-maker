# changelog-maker


This util generates changelog text based on git commits history from the last tag

**Usage:**
1. Clone the repo
2. Place your git token into .git-auth file in the root of this repo using following format:
```
{
  "user": "user-name",
  "token": "token-hash"
}
```
3. Go to the directory with the target git repo (where you want to make a log) and run index.js:
```
  cd <path-to-your-repo>
  node <path-to-changelog-maker-root>
```

The output is just formatted text with the "Merge" and "Bump" commits that happens from the last tag that was created

**Disclaimer**: I don't bother writing more documentation or supporting various use cases as this is intended to be used just by myself and the tool is configured and works just the way I need it.
