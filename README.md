npm run build && rm -rf ../staticfiles/build && mv build ../staticfiles/.  (In frontend directory)
(Command to deploy changes to the static files in your project, including the React code. To do this, you need to delete the existing build folder and rebuild it. This command will delete the old folder and replace it with the new one)

Clicking the logo on the Navbar directs signed in users to the post creation form page, while signed out users are directed to the homepage

Talk about npm parser and React Quill usage in my application

Talk about how an admin can delete posts and comments

Talk about how users can search through titles, usernames as well as categories of posts

Added gaming data model

Had to delete ALL migration files including pycache as well as reset ElephantSQL database in order to successfully migrate my data models.

Live link:

https://django-rest-api-de0173352397.herokuapp.com/

Credits

Logo - [Hatchful](https://www.shopify.com/tools/logo-maker)

Blog example - https://blog.logrocket.com/use-django-rest-framework-to-build-a-blog/

Categories data model - https://github.com/linkedweb/blog_lyfe/tree/main

ScrollButton component - https://www.geeksforgeeks.org/how-to-create-a-scroll-to-top-button-in-react-js/

Capitalize first letter - https://stackoverflow.com/questions/48387180/is-it-possible-to-capitalize-first-letter-of-text-string-in-react-native-how-to