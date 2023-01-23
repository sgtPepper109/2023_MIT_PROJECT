
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
Then, navigate to the 'FLASK' directory and run
```
pip install -r requirements.txt
```
since the repository already gives you the python environment folder.

## Development server

navigate into GUI directory and run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. \
Open another shell and navigate to the 'FLASK' folder and run py app.py for a flask server. The flask server will be active on default port `5000`. \
Then lastly, run the BackApplicationMain.java file in IntelliJ \

To view the project, open a web-browser and type in `http://localhost:4200`