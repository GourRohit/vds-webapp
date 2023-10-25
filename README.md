# vds-webapp
  Welcome to our VDS Demo web app! 
  This guide will walk you through setting up, running, and understanding VDS and VDS Demo Web applications. It contains everything you need to know about Demo Web App from setting it up to building custom web applications on top of it.

## Introduction
This web app is like a special tool that helps us check and confirm who you are when you show us your mDL, which is like a digital or paper driver's license. We use a device called Tap2id to scan and send your mDL details to this web app. So, we can quickly see your information and make sure it's really you.

## Getting Started 

### Prerequisites

* Modern web browser like Google Chrome or Mozilla Firefox
* An Integrated Development environment (IDE) like VS Code (Recommended) or any other specific IDE of your choice
* `npm` and `node.js` installed in your system
  (If you don't have then download and install from https://nodejs.org/en/download)


### Installation

In order to get this web app in your local system you have two options 
* Clone this Remote Repo
  ```
  https://github.com/CredenceID/vds-webapp.git
  ```
* Download the Zip file

That's great, now you have all the code files of the web app with you in your local system


### Running the Demo Web APP

Application has very few dependencies, so it’s most probably very easy to understand when you scan through the code, but there is at least few steps you should know.

Application is divided into two parts. 
* One is pure `React` front-end
* Second part of this application is back end written in `node.js`.

**Step 1: Open project in the IDE or code editor**

**Step 2: Installing frontend dependencies**
* Open the Terminal in IDE
* Navigate to the frontend directory by writing the command `cd vds-frontend`
* Run the command `npm install` or `npm i`

After installing all the dependencies for frontend, now it’s time for installing dependencies for the backend also. 


**Step 3: Installing Backend dependencies**
* Open a new terminal inside the IDE
* Navigate to the backend folder by writing command `cd vds-backend`
* Run the command `npm install` or `npm i`

That’s good. Now you have installed all the dependencies required to run the web app.


#### Note
>>Go in the UrlConfig.js file present inside the src folder of vds-frontend and change the VDS_URL from `https://localhost:4215/verifier-sdk` to `http://localhost:4215/verifier-sdk` (Remove ‘s’ in ‘https’) in order to run on the local, otherwise it won’t run


**Step 4: Creating a Build of the frontend code**
* Navigate back to the terminal where we are in the frontend folder
* Run the command `npm run build`


**Step 5: Running the localhost server**
* Navigate back to the terminal where the backend folder was opened
* Run the command `node index.js`


**Step 6: Download the Mockoon for mock response**
* Visit official website of mockoon
* Download it according to your OS version.
* Go through this short tutorial (`https://mockoon.com/tutorials/getting-started/`)


**Step 7: Setting the API responses in mockoon**
* Create a new environment in mockoon
* Set the initial settings in the settings tab
  ![This is an alt text.](/imgs/Screenshot_20231023_120901.png "This is a sample image.")
* Set the headers in the headers tab
  ![This is an alt text.](/imgs/Screenshot_20231023_120804.png "This is a sample image.")
* Set the routes in the routes tab
  ![This is an alt text.](/imgs/Screenshot_20231023_120738.png "This is a sample image.")
* Set all routes with the correct methods, and their responses. You can get all the API routes and their all the possible responses in the CID document.
* Now, Run the server
  ![This is an alt text.](/imgs/Screenshot.png "This is a sample image.")

After this visit the localhost:3000 in the browser and this time the Webapp will be running successfully.


