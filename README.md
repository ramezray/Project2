# Sell Something App

## Overview:

Sell Something is a full-stack application that provides a market place for users to list and browse items for sale. It uses Node & MySQL to query and route data to the app & Express Handlebars to generate HTML.

## Technologies Used:
- HTML
- CSS
- Javascript
- MySQL
- Node.js
- NPM Express
- NPM Express-Handlebars
- NPM Body-Parser
- NPM Method-Override
- NPM Multer-S3

## Contributors:

- <strong>Ray Wasif</strong>
- <strong>Heidi Jansen van Rensburg</strong>
- <strong>Al Young</strong>
- <strong>Wilder Molyneux</strong>
<hr>

## [Click Here for a Live Demo](https://thawing-reaches-85632.herokuapp.com/)

## Local Setup:

To run this application locally, you will need <a href="https://nodejs.org/en/download/">Node JS</a> and <a href="https://dev.mysql.com/doc/refman/5.6/en/installing.html">MySQL</a> installed on your computer.

<strong>MySQL Database Setup:</strong>

Once you have MySQL installed, you will need to create a database using your mySQL client. You can do this by running the command "CREATE DATABASE sellsomething_db;" in your mySQL client. If you do not already have a mySQL client, you can <a href="https://dev.mysql.com/downloads/workbench/">download MySQL Workbench here</a>. 

<strong>Once you have the sellsomething_db database set up, run the following commands at your command prompt:</strong>

           1. git clone https://github.com/ramezray/Project2.git ENTER
           
           2. cd project2 ENTER
           
           3. npm install ENTER
           
<strong>Once the files have been downloaded to your local machine, navigate to the "config" directory and open up the file named "config.json", then change the "password" field to match the password you set up for your mySQL database. Next, navigate to the "server.js" file and check to make sure the "PORT" that you set-up for your mySQL server matches what's in the file (line 13, currently set at PORT 3000).  Make sure to save the changes for both of these files. You are now ready to run the App!             
                      
           
## Running the App:

           1.  Using your cmd prompt, navigate to the "Project2" directory that you cloned in the previous step.
           
           2.  Run the command "node server.js" to start the server.
           
           3. Then, open up your browser and go to http://localhost:your_MySQL_PORT_Number


## Using the App:

Users must register and create login credentials using their email and password, in order to use the app.  Once login is established, users can browse items currently for sale posted by other users, and also create and post items of their own for sale.  Registered users have access to a profile page which allows them to manage the items they currently have listed for sale.   

## Screenshots:
            
 <img src="https://ramezray.github.io/Project2/public/images/login_screenshot.png" alt="Login Screenshot">
 <br>
  <img src="https://ramezray.github.io/Project2/public/images/main_screenshot.png" alt="Main Screenshot">
 <br>
  <img src="https://ramezray.github.io/Project2/public/images/addItem_screenshot.png" alt="Add Item Screenshot">
 <br>
