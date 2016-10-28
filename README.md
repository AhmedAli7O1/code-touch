# code-touch
simple task to implement user registration/login in MEAN Stack

# Features  

* register using local credentials. 
* register using google account. "use google display name & account".
* email verification on register using "local credentials".
* notification modal shows up to tell the user to verify the email address.  
* user can resend the verification email again at any time from this modal.
* restrictions on navigation depends on user state and more...

# Demo

you can always try this demo simple app because if you deployed the app on your local host 
you can't test google login since google prevented this and in order to use google+ APIs,
you need to deploy the app on a real online server and specify the URL in your google developer console.

and this's exactly what I did with this demo app.

[Demo App](https://code-touch.herokuapp.com/)

# Local Tesing

if you still want to test your own version of the source you need to edit this file `/server/config.js`
and add your own settings e.g gmail api keys, mailerjet keys ...etc

# Vagrant

if you would like to use vagrant in your development follow this steps.

* install vagrant & virtual box.
* clone this repo to your computer.
* browse to the project folder.
* open up your terminal/console/shell whatever! in this folder.
* type the magic word `vagrant up` wait until vagrant finish installing the box which is "ubuntu/trusty64" 
it will automatically install all dependencies e.g Node.js MongoDB...etc and it will also run 
npm install & bower install for you so just keep calm.
* after vagrant finish preparing your VM, now type `vagrant ssh` or use SSH client e.g putty to login your VM 
using username "vagrant" and password "vagrant".
* now you're logged in, type `cd /vagrant` this's the sheard folder between your computer 'host' and the VM 'guest'
and this's where the project source is.
* to start the server for testing just type `npm start`.
* on the other hand also I provide `npm stop` to kill the app process if needed.
* to make a fresh build after editing the source run `gulp`.
* you can also run `gulp watch` which will watch your source for any changes and rebuild the source,
and it will take care of keeping the server running so you can see the effects of your changes live.
just run it and forget about the server. 




(Have_fun ^_^) Ahmed.
