# impoerting flask
from flask import Flask

# define flask as app
app = Flask(__name__)

# first route point (home/landing page)
@app.route('/')
def read_root():
    return "Ahoy hoy, Universe!"

# one more end point for clearity
@app.route('/project')
def project():
    return "This is a project page, you are write the project page very well !!"

# json responce route
@app.route('/json')
def json():
    return {
        "status": 200,
        "message": "Flask API get your request and send this to you as gift",
        "recepie": {
            "rice": "4kg",
            "potato": 3,
            "oil": "5l",
            "others": ["salt", "sugur", True, 12, 80.80]
        }
    }

# run that app to cross check validation
if __name__ == "__main__":
    app.run(debug=True, port=9000)