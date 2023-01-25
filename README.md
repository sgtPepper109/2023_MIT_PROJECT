
## Steps for installation

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

## Development server

navigate into GUI directory and run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. \
Then lastly, run the BackApplicationMain.java file in IntelliJ \

To view the project, open a web-browser and type in `http://localhost:4200`

## FLASK server
navigate into FLASK environment folder and run `python app.py` for a flask server. It will run on port 5000 and has the url `http://localhost:5000/`

## Back-End server
Run the main `BackApplicationMain.java` file in IntelliJ. The server will be active on port 8080 and has the url `http://localhost:8080/` 