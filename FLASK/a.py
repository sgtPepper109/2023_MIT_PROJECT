import requests
from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def get_data():
    return requests.get('http://localhost:8080/operation/all').content

if __name__ == "__main__":
    app.run()
