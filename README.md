## Requirements

Requires
Python version 3.9.13^ \
Download and install python from `www.python.org/downloads/` and add it to environment variables path \
Java version 19.0.1^ \
Download Java from `java.com/download/ie_manual.jsp` and add it to environment variables path \
Node.js version 18.12.0^ \
Download Node.js from `nodejs.org/en/download/` and add it to environment variables path \
MySQL version 8.0.31^ \
Download MySQL installer from `dev.mysql.com/downloads/` and install the Developer Default packgae from the MySQL installer


## Steps for installation

First, Create a database in MySQL. \
Open MySQL in command line or workbench from root user or the user which you can remember the password of, and run the query
```
CREATE DATABASE 2023mitproject
```
\
Navigate to the `TRAFFIC_PREDICTION_SERVER` directory and open pom.xml file in IntelliJ IDE \
IntelliJ will automatically download all the required software \
Then,
open the `application.properties` file in  the `TRAFFIC_PREDICTION_SERVER` folder and change the username and password to your chosen MySQL username and password \


Open command prompt and navigate into the `TRAFFIC_PREDICTION_CLI` folder and run
```
npm install
```
or
```
yarn add
```

After the installation of all packages is done, \
In the same command prompt (or a different command prompt), create a python virtual environment in the project folder by executing the following command
```
python -m venv FLASK
```
\
Check if FLASK environment has been created by checking the list of all items in the directory
```
ls
```

If `FLASK` is present then the environment is created successfully

If the python environment (in this case, `FLASK`) is created, 
navigate to the env folder (FLASK) and activate the environment
```
cd Scripts
activate
cd ..
```
To install all the required python packages, run
```
pip install -r requirements.txt
```
since the repository already gives you the python environment folder. \
Then copy the `app.py` file to the flask folder

## Back-End server
Run the main `BackApplicationMain.java` file in IntelliJ or Eclipse. The server will be active on port 8080 and has the url `http://localhost:8080/` 

## FLASK server
Open command prompt and 
navigate into FLASK environment folder and run `python app.py` or `python app.py DEV` for a dev flask server. It will run on port 5000 and has the url `http://localhost:5000/`
(OR)
nvaigate into the FLASK environment folder and run `python app.py PROD` for a prod server. It will run on port 5000 and will be available to everyone on your network. URL: `http://localhost:5000/

## Development server

Open command prompt and 
navigate into `TRAFFIC_PREDICTION_CLI` directory and run `npm start` for a dev server. The application will automatically reload if you change any of the source files. \

To view the project, open a web-browser and type in `http://localhost:4200`
