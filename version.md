# How to change the document version:
## Installation
+ Firstly, you need clone this repo:
```bash
git clone https://github.com/Hao-1337/script-console.git
```
+ now cd to the folder:
```bash
cd ./script-console

```
+ Install the necessary npm:
```bash
npm i
```
+ If you can't do it [here is](https://github.com/Hao-1337/script-console/releases)
--------
## Select the version you want
+ You can see all available version by using:
```bash
npm view @minecraft/server versions
npm view @minecraft/server-ui versions
```
+ Just copy the version you want and install it:
```bash
npm i @minecraft/server@<your version>
npm i @minecraft/server-ui@<your version>
```
+ When finished, run this command:
```bash
npm run parse
```
+ Now, just import the addon again or just get file `/scripts/modules/spinnet.js` into the current addon you use
