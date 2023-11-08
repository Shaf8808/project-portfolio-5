npm run build && rm -rf ../staticfiles/build && mv build ../staticfiles/.  (In frontend directory)
(Command to deploy changes to the static files in your project, including the React code. To do this, you need to delete the existing build folder and rebuild it. This command will delete the old folder and replace it with the new one)

Clicking the logo on the Navbar directs signed in users to the post creation form page, while signed out users are directed to the homepage

Talk about npm parser and React Quill usage in my application

An admin can delete posts and comments

Added gaming data model

Had to delete ALL migration files including pycache as well as reset ElephantSQL database in order to successfully migrate my data models.

Live link:

https://django-rest-api-de0173352397.herokuapp.com/

Credits

Logo - [Hatchful](https://www.shopify.com/tools/logo-maker)

https://blog.logrocket.com/use-django-rest-framework-to-build-a-blog/