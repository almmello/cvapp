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
$ pip install -r requirements.txt
```


## Run the Development Server

In the top-level directory, set the file that contains the Flask application and specify that the development environment should be used:


```sh
$ export FLASK_APP=app.py
$ export FLASK_ENV=development
```

Run development server to serve the Flask application:

```sh
$ python3 -m flask run
```

Navigate to 'http://localhost:5000' to view the website!

## Build the Static Files

In the top-level directory, run the build script:

```sh
$ python3 build.py
```

The static files are generated in the */project/build/* directory, which can then be hosted on Netlify.

## Publish to Netlify

1. After you have logged in to Netlify, go to your account page and click on 'New site from Git'.

1. You now can select the git hosting solution (GitLab, GitHub, or BitBucket) that you are using to store your git repository on.

1. You'll be asked to select the git repository that you'd like to host (if you haven't connected Netlify to your git hosting service before, there will be an additional step to allow Netlify to access your git repositories).

1. Now you can select who the owner of the project is and the branch from which you want to deploy the builds from.

1. Update the 'Build command' and 'Publish directory' fields as follows, but we will need to fix them in a few steps.
    - Build command: "/"
    - Publish directory: "/project/build/"
<br></br>
1. Click on the 'Deploy site' button.

1. Once the deployment fails, you'll need to change the build settings by clicking on 'Site Settings' and then 'Build & deploy':

1. Update the following fields:
    - Base directory: "/"
    - Build command: empty
    - Publish directory: "/project/build/"
    - Builds: Active
<br></br>
1. 'Save' the changes.

1. Changing the build settings does not cause the deployment script to re-run, so we need to manually deploy to check the build settings.

1. Navigate to the 'Deploys' tab.

1. Click on the 'Trigger deploy' button and select 'Deploy site'

1. This will trigger the deploy script to run. 

1. Navigate back to the 'Site overview' to check the results of the deploy.

1. You should see a preview of the site and confirmation that the site was deployed.

1. Click on the link (such as https://some-url-7700a0.netlify.com/) to view the site!

## Key Python Modules Used

* Flask - micro-framework for web application development
* Jinga - templating engine
* Frozen-Flask - generates static files from Flask routes

This application is written using Python 3.9.0.

