# GRENinja Android Application  

Welcome to GreNinja android application! This app has a variety of amazing features that will make your experience of learning words and build vocabulary to be more enjoyable and productive. Below you can find screenshots of the app, showcasing its different functionalities and design.  
Download and Try all new [GreNinja](https://play.google.com/store/apps/details?id=com.GREninja.GRE.vocabulary) Application from the [Google Play Store](https://play.google.com/store/apps/details?id=com.GREninja.GRE.vocabulary).

## ScreenShots & Features

<table>  
  <tr>  
    <td><img src="https://github.com/Im-Himanshu/verboculary/assets/16800094/a0df74f0-599f-4f7b-a171-9884237d6939" alt="Image 1" width="200"></td>  
    <td><img src="https://github.com/Im-Himanshu/verboculary/assets/16800094/b08ee924-66c8-49f8-9b4f-1c7b40fc2299" alt="Image 2" width="200"></td>  
    <td><img src="https://github.com/Im-Himanshu/verboculary/assets/16800094/9695398a-c008-4087-8e75-311f057a7714" alt="Image 3" width="200"></td>  
    <td><img src="https://github.com/Im-Himanshu/verboculary/assets/16800094/6daf9296-2131-4d0b-b2db-5094fa14f5cf" alt="Image 4" width="200"></td>  
  </tr>  
  <tr>  
    <td><img src="https://github.com/Im-Himanshu/verboculary/assets/16800094/18f6233a-4de7-43f2-abf2-e5b1d96d7c18" alt="Image 5" width="200"></td>  
    <td><img src="https://github.com/Im-Himanshu/verboculary/assets/16800094/b121342e-0091-4ce3-9550-d20dd06ee046" alt="Image 6" width="200"></td>  
    <td><img src="https://github.com/Im-Himanshu/verboculary/assets/16800094/1dd1434a-16b5-46f8-a6ef-2f5b83b3dca7" alt="Image 7" width="200"></td>  
    <td><img src="https://github.com/Im-Himanshu/verboculary/assets/16800094/2789b0ab-818a-4769-9477-85e2a2a98939" alt="Image 8" width="200"></td>  
  </tr>
</table>  


## Functionalities  
   
* 1100+ words Handpicked for GRE only 
* Help build memory for a word using pictures and memes
* Multiple inbuilt dictionary support to help you understand all the different context of a word  
* Support Dark Mode for all the Night Dwellers
* Can't afford to look at screen? No worries, we have you covered with very interesting podcast covering word by word.
* Track your progress is real-time
* Words Level-categorization based on importance for GRE, More important one comes first, Rarer we will do Later. 
* Practise test with swipe-able card
   
## Installation  
   
To install the app, simply head over to the Google Play Store and search for "GREninja". Alternatively, you can click on the following link:  
   
[Download GreNinja Application from the Google Play Store](https://play.google.com/store/apps/details?id=com.GREninja.GRE.vocabulary)  
   
## Support  
   
If you encounter any issues or have any questions, please feel free to reach out to our support team at goyalhimanshu414@gmail.com.  

Thank you for choosing GreNinja Android Application! We hope you enjoy using it.



# Loading the Application in JavaScript  
   
## Local Setup  
   
1. Run `ionic cordova build browser`  
2. Set basepath to `./`  
3. Set the service path in URL without leading / (e.g. to refer csvDataJson, use `assets/csvToJsonData.json`). This will pick the path from the base URL.  
4. To check, go to `platforms\browser\www` and run `live-server` to initiate the server.  
5. Icons won't appear here but will work on the GitHub site.  
6. Task remaining: direct build the browser in DemoForStatic File vala folder, otherwise have to copy and paste again and again.  
   
## GitHub Pages Setup  
   
1. In `index.html`, change basepath to `/RepoName/`  
   
Page refresh is still not working, so have to do something about it using: `RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash:true })`  
   
Use all paths in absolute relative terms like from the root folder of the project, in CSS and other places.  
   
# Live Load in Android  
   
1. Run `ionic cordova run android -lc`  
2. Run `ionic serve -l`  
3. `lc` for live reload and console  
4. `-l` is for lab where you can choose display of Android and iOS  
   
In mobile, enable developer mode, search USB debugging and enable it: [https://www.guru99.com/adb-connect.html](https://www.guru99.com/adb-connect.html)  
   
For debugging this live app deployment, you can go here: [https://www.youtube.com/watch?v=XEeWFIsgtsU](https://www.youtube.com/watch?v=XEeWFIsgtsU)  
- `chrome://inspect/#extensions` -> Inspect  
   
# App Life Cycle  
### Step 1: App First Started  
   
There will be two one-time operations of creating data for the Application:  
   
1. For the set data to be flattened out, In JSON we have kept it in hierarchical format to access it. We flatten and store it.  
2. For the user data related to a word need to be stored in the word itself, so for every word, a memory is created to store the related data.  
   
### Step 2: App All Further Starts  
   
- Check if the Processed data exists or not (should exist)  
  - If not: Repeat Step 1  
  - If yes:  
    - Get the flattened Set data from the local storage -> publish the set Event -> in the `home.page.ts` default set is selected -> Selected Sets are concatenated and `selectedSetChangeEvent` is Published -> Children listen to this event and reload the view.  
    - Fetch the all Words data from the JSON -> `wordList Fetched` event is published ->  
   
# UI Components Websites  
   
- [https://bit.dev/components?q=dropdown](https://bit.dev/components?q=dropdown)  
- [https://www.webcomponents.org/](https://www.webcomponents.org/)  
- [https://www.infragistics.com/products/ignite-ui-angular/angular/components/general/getting_started.html](https://www.infragistics.com/products/ignite-ui-angular/angular/components/general/getting_started.html)  
- [https://onsen.io/theme-roller/](https://onsen.io/theme-roller/)  
- [https://freefrontend.com/css-color-palettes/](https://freefrontend.com/css-color-palettes/)  
   
Article on Subjects: [https://medium.com/@luukgruijs/understanding-rxjs-behaviorsubject-replaysubject-and-asyncsubject-8cc061f1cfc0](https://medium.com/@luukgruijs/understanding-rxjs-behaviorsubject-replaysubject-and-async
## Build  
   
`ionic cordova build android --prod --release`  
   
# Task to do  
   
- Experiment by importing the extra UI module in another project to check if it is a problem with Ionic.  
   
## POC's going on  
   
- Implement the Tinder-like animations  
    - https://www.one-tab.com/page/iGVnLKqhQJS7IiM2C3ewGw  
- Adding charts in Angular applications  
    - https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/  
    - https://www.javascripttuts.com/using-charts-ionic-app  
- Color grading in scales  
    - https://coolors.co/  
    - `npm install color`  
    - https://miro.medium.com/max/2310/1*ZDd9o9OuEptW0Ji5r5r9yA.png  
    - https://www.one-tab.com/page/2Kv8oYlVS9utiJz70i3oIg // all links related to theming an app  
   
## Adding Angular Material Library  
   
- https://material.angular.io/components/tabs/overview // much better than Ionic one  
   
## AllWords Tab  
   
- Contains a list of all words which are selected.  
- Learn Set will show the word in random order with all the details of the word from different sources to show it to the user.  
- Practice is where the user will be shown only words and meaning format, here master, and all other things need to be implemented.  
   
# Colors  
   
- #132332  
- #113233  
   
## Lottie Files  
   
- https://lottiefiles.com/ for loaders  
   
## Animation Source  
   
- https://daneden.github.io/animate.css/ // for more animation  
- http://hammerjs.github.io/
- https://www.youtube.com/watch?time_continue=195&v=5Z2C0wy4bmg&feature=emb_logo  
   
## GitHub Good Components
- https://github.com/yannbf/ionic3-components
- I don't know why, but if a new component is declared in the module app, it has to be restarted from the CLI; otherwise, it will throw an error.  
   
## Theming the App
- https://louisem.com/29880/color-thesaurus-infographic  
- https://ingridsnotes.wordpress.com/2014/02/04/the-color-thesaurus/  
   
## LearnSet
- Changing filter not changing the word list  
   
## Logo Maker
- https://www.brandcrowd.com/  
- https://www.canva.com/design/DADyYRsp6oY/OYwGrD2ok3Z0AGfKg_-P_Q/edit  
   
## Release Steps   
1. `ionic cordova build android --prod --release`  
2. `keytool -genkey -v -keystore verboculary.keystore -alias verboculary -keyalg RSA -keysize 2048 -validity 10000`  
    - keyStore password: verboculary  
    - verboculary.keystore passwords: verboculary  
3. `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore verboculary.keystore app-release-unsigned.apk verboculary`  
4. `"C:\Users\Himanshu\AppData\Local\Android\Sdk\build-tools\29.0.2\zipalign.exe" -f -v 4 app-release-1.1.0_Signed.apk app-release-1.1.0-zipaligned.apk`  
   
## AdMob App ID   
- ca-app-pub-4352525331879046~1258287684  
   
## Release 2 Ideas
1. Include the word cartoons from https://quizlet.com/Vince_Kotchian/folders/vince-kotchian-gre-pre