## Overview

This Flask application displays my résumé!  [Frozen-Flask](https://pythonhosted.org/Frozen-Flask/) is
used to generate the static files based on the routes specified in the Flask app.  These static files are hosted on
[Netlify](https://www.netlify.com):

[Alexandre's Résumé](https://almmmello.com.br)

For details on how this Flask app generates static files, check out the [Generating a Static Site with Flask and Deploying it to Netlify](https://testdriven.io/blog/static-site-flask-and-netlify/) where I had the first inspiration.

## Website

[almmello.com.br](https://almmello.com.br)

## Installation Instructions

Pull down the source code from this GitHub repository:

```sh
git clone https://github.com/almmello/cvapp
```

Create a new virtual environment:

```sh
$ cd cv_app
$ python3 -m venv venv
```

Activate the virtual environment:

```sh
$ source venv/bin/activate
```

Install the python packages in requirements.txt:

```sh
(venv) $ pip install -r requirements.txt
```


## Run the Development Server

In the top-level directory, set the file that contains the Flask application and specify that the development environment should be used:


```sh
(venv) $ export FLASK_APP=app.py
(venv) $ export FLASK_ENV=development
```

Run development server to serve the Flask application:

```sh
(venv) $ flask run
```

Navigate to 'http://localhost:5000' to view the website!

## Build the Static Files

In the top-level directory, run the build script:

```sh
(venv) $ python build.py
```

The static files are generated in the */project/build/* directory, which can then be hosted on Netlify.

## Key Python Modules Used

* Flask - micro-framework for web application development
* Jinga - templating engine
* Frozen-Flask - generates static files from Flask routes

This application is written using Python 3.9.0.

