For loading this application in javascript

1. for local : ionic cordova build browser
   basepath to be : "./"
   and the service path in url to be without leading / like to refer csvDataJson ==> use assets/csvToJsonData.json
   this will pick the path from base url -->
   for checking in here go to platforms\browser\www and run live-server to initiate the server
   --> icons won't appear here but will work in the github site
   Task Remaining is to direct build the browser in DemoForStatic File vala folder --> otherWise have to copy paste again and again
2. for github pages
   in index.html change
   basepath to be : "/RepoName/"

page refresh is still not working so have to do something about it using this..
RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash:true})

Use all path in absolute relative term like from the root folder of project, in css and other places

How to live load in the Andorid? ionic cordova run android -lc
ionic serve -l

// lc for liverelod and console
// -l is for lab where you can choose display of android and ios

    in mobile enable developer mode
    search USb debugging and anable it : https://www.guru99.com/adb-connect.html

    For debugging this live app deployment you can go here https://www.youtube.com/watch?v=XEeWFIsgtsU
        chrome://inspect/#extensions :=>  inspect

Series of event in app life Cycle

for build

ionic cordova build android --prod --release
App Downloaded

Step 1 :
APP First Started :
There will be two one time operation of creating data for the Application 1. For the set data to be flatten out, In json we have kept it in hearchial format to access it we flatten and store it. 2. For the user data related to a word need to be stored in the word itself so for every word a memeory is created to store the related data
Step 2:
APP all Further Start :

        Check if the Processeed data exist or not (should exist)
                if Not : Repeat Step 1
                if Yes :
                        get the flattened Set data from the local storage  :> publish the set Event => in the home.page.ts default set is selected :> Selected Sets are concatenated and selectedSetChangeEvent is Published :> Children listen to this event and reload the view.

                        Fetch the all Words data from the JSON :> wordList Fetched event is published :>

Website with UI components :
https://bit.dev/components?q=dropdown
https://www.webcomponents.org/
https://www.infragistics.com/products/ignite-ui-angular/angular/components/general/getting_started.html
https://onsen.io/theme-roller/
https://freefrontend.com/css-color-palettes/

article on Subjects https://medium.com/@luukgruijs/understanding-rxjs-behaviorsubject-replaysubject-and-asyncsubject-8cc061f1cfc0

task to so : experiment by importing the extra Ui module in other project to check if it is a problem with ionic

                POC's going on are : implement the tinder like animations
                        https://www.one-tab.com/page/iGVnLKqhQJS7IiM2C3ewGw
                        adding chart in angular applications
                https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
                https://www.javascripttuts.com/using-charts-ionic-app
                https://coolors.co/  -- for color grading in scales
                npm install color
                https://miro.medium.com/max/2310/1*ZDd9o9OuEptW0Ji5r5r9yA.png
                https://www.one-tab.com/page/2Kv8oYlVS9utiJz70i3oIg // all l;ink related to theming an app

addign nagular material library : https://material.angular.io/components/tabs/overview // much better than ionic one

AllWords tab contains list of all words which are selected
Learn Set will show the word in random order with all the details of the word from different source to show it to user
Practise is where user will be shown with only words and meaning format, here mastere and all other things need to be implemented

#132332

#113233

https://lottiefiles.com/ for loaders

animation source

https://daneden.github.io/animate.css/ // for more animation
http://hammerjs.github.io/

https://www.youtube.com/watch?time_continue=195&v=5Z2C0wy4bmg&feature=emb_logo

https://github.com/yannbf/ionic3-components

good components

I don't know why but if a new component is declared i nthe module appp has to be restarted from the cli other wise it will throw error.

theming the app

https://louisem.com/29880/color-thesaurus-infographic
https://ingridsnotes.wordpress.com/2014/02/04/the-color-thesaurus/

in learnSet chnaging filter not changing the word list

logo maker :
https://www.brandcrowd.com/
https://www.canva.com/design/DADyYRsp6oY/OYwGrD2ok3Z0AGfKg_-P_Q/edit

Release Steps :

step 1 : ionic cordova build android --prod --release
steps : 2 (one time system set up though the key need to be remembered otherwise play store won't allow it next time) :
keytool -genkey -v -keystore verboculary.keystore -alias verboculary -keyalg RSA -keysize 2048 -validity 10000
keyStore password : verboculary
verboculary.keystore passwords : verboculary
step 3 : we need to be in the directory where the baove generated keystore has been kept and run this command
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore verboculary.keystore app-release-unsigned.apk verboculary
step 4 : ZipALigned the Jar
"C:\Users\Himanshu\AppData\Local\Android\Sdk\build-tools\29.0.2\zipalign.exe" -f -v 4 app-release-1.1.0_Signed.apk app-release-1.1.0-zipaligned.apk

It will ask for the password after this, fill them up and the jar will be ready to use

Rename the jar and deploy it in the andorid to check it....
by adb install -r app-release-signed.apk

AdMob app ID :
ca-app-pub-4352525331879046~1258287684

What will be the release 2 :

1. we can include the word cartoon to the list availaible here
   https://quizlet.com/Vince_Kotchian/folders/vince-kotchian-gre-preps-vocabulary-cartoons/sets
2. 

For Api End Point :
https://sheety.co/projects/5e382126461ceb4b5f19eecf/endpoint/5e3822e5461ceb4b5f19eed2

or create your own https://medium.com/dali-lab/google-sheets-and-json-easy-backend-e29e9ef3df2

like I have done here for : https://docs.google.com/spreadsheets/d/1RncL9ABiB3FQd0ge9ZidERNXjlI_bb8KP5w_xMv3bGI/edit#gid=0 this sheet

https://spreadsheets.google.com/feeds/cells/1RncL9ABiB3FQd0ge9ZidERNXjlI_bb8KP5w_xMv3bGI/1/public/full?alt=json

use this library for javascript for easy retrieval
https://www.npmjs.com/package/get-sheet-done

/// for post and get both
https://dev.to/bearer/how-to-send-data-to-a-google-spreadsheet-in-2-seconds-1h0

ionic g component components/myComponent --export


for using the new svg file save the file in the svg defination component and use the given i nthis like this to fetch the component 

<svg-icon name= "home"></svg-icon>
