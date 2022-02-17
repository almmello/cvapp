from flask import Flask, render_template, url_for, send_from_directory


app = Flask(__name__)



@app.route("/")
def home():
    return render_template('home.html')


@app.route('/rga/<path:path>')
def send_js(path):
    return send_from_directory('rga', path)




if __name__ == '__main__':
    app.run(debug=True)

