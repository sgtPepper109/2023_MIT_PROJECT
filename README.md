## Requirements

Requires
Python version 3.9.13^ \
Download and install python from `www.python.org/downloads/` and add it to environment variables path \
Java version 19.0.1^ \
Download Java from `java.com/download/ie_manual.jsp` and add it to environment variables path \
Node.js version 18.12.0^ \
Download Node.js from `nodejs.org/en/download/` and add it to environment variables path \
MySQL versiion 8.0.31^ \
Download MySQL installer from `dev.mysql.com/downloads/` and install the Developer Default packgae from the MySQL installer


## Steps for installation

First, Create a database in MySQL. \
Open MySQL in command line or workbench from root user or the one which you can remember the password of, and run the query
```
CREATE DATABASE 2023mitproject
```
Then,
open the `application.properties` file in  the `TRAFFIC_PREDICTION_SERVER` folder and change the username and password to your MySQL username and password

Navigate into the 'GUI' folder and run
```
npm install
```
or
```
yarn add
```
Then, navigate to the 'back' directory and open pom.xml file in IntelliJ IDE \
IntelliJ will automatically download all the required software \

Then create a python virtual environment in the project folder
```
python -m venv FLASK
```
Navigate to the env folder i.e. FLASK and activate the environment
```
Scripts/activate
```
To install all the required python packages, run
```
pip install -r requirements.txt
```
since the repository already gives you the python environment folder.

## Back-End server
Run the main `BackApplicationMain.java` file in IntelliJ or Eclipse. The server will be active on port 8080 and has the url `http://localhost:8080/` 

## FLASK server
navigate into FLASK environment folder and run `python app.py` for a flask server. It will run on port 5000 and has the url `http://localhost:5000/`

## Development server

navigate into GUI directory and run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. \
Then lastly, run the BackApplicationMain.java file in IntelliJ \

To view the project, open a web-browser and type in `http://localhost:4200`
