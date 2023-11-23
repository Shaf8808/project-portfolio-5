# Bloggerize API Manual Testing

## Methodology

The method that I decided to use to manually test each endpoint is adding new data to each endpoint that is valid in order to see it's response. I then added invalid data to see whether or not it would display a relevant error message and code. These tests were performed using the Django Rest Framework HTML interface.

The intended functionality of the API is to only allow authenticated users to create blog posts as well as like, follow and comment on specific posts. Any unauthenticated user should merely be able to view these posts and not be able to interact with them in any way shape or form. This can be done through the homepage, by using the search bar or by accessing the categories dropdown menu. This ensures that anyone can browse through the content on the site even if they don't have a profile, but cannot create a post or engage with them in any way.

This means that only logged in users should be able to create, edit and/or delete posts, comments, likes and followers. Logged in users also have the additional option of editing their profiles such as their username, password, bio and avatar image. In the case of an unauthenticated user, these options should not be present which is what I tested for my API.

Additionally, I have also added the option of an administrator (myself) to have the ability to delete posts and comments. The reason why I did this is to filter out any inappropriate or offensive content that some may decide to post on my site in the form of posts or comments. This was also tested during this process.

## Table of Contents

- [Comments endpoints](#comments-endpoints)
  * [api/comments/](#api/comments/)
  * [Test 2](#test-2)
- [Followers endpoints](#followers-endpoints)
  * [Test 7](#test-7)
  * [Test 8](#test-8)
  * [Test 9](#test-9)
  * [Test 10](#test-10)
  * [Test 11](#test-11)
- [Likes endpoints](#likes-endpoints)
  * [Test 12](#test-12)
  * [Test 13](#test-13)
  * [Test 14](#test-14)
  * [Test 15](#test-15)
  * [Test 16](#test-16)
- [Posts endpoints](#posts-endpoints)
  * [Test 17](#test-17)
  * [Test 18](#test-18)
  * [Test 19](#test-19)
  * [Test 20](#test-20)
  * [Test 21](#test-21)
- [Profiles endpoints](#profiles-endpoints)
  * [Test 22](#test-22)
  * [Test 23](#test-23)
  * [Test 24](#test-24)
  * [Test 25](#test-25)
  * [Test 26](#test-26)
- [Categories endpoints](#categories-endpoints)
  * [Test 27](#test-27)
  * [Test 28](#test-28)
  * [Test 29](#test-29)
  * [Test 30](#test-30)
  * [Test 31](#test-31)


## Comments endpoints

### api/comments/

When a user is logged out, they should only be able to view the comment list with this endpoint without the option of posting a comment. The image below shows the GET method working as intended.

<img src="docs/backend/images/comment-list.png" width=800>

When a user is logged in, they should be able to successfully post a comment in relation to a specific post before being displayed in the comment list. The image below shows the new comment that I am about to post using this endpoint.

<img src="docs/backend/images/comment-list-data.png" width=800>

The image below shows the comment being successfully posted with a 201 status code.

<img src="docs/backend/images/comment-list-success.png" width=800>

When I attempt to post an empty comment, I should see a 400 error code with a suitable message displayed. This works as intended and can be seen below.

<img src="docs/backend/images/comment-list-error.png" width=800>



### api/comments/id/

When a user is logged out or logged in, they should be able to view a specific comment once the relevant id has been entered in the url. This can be seen in the image below.

<img src="docs/backend/images/comment-detail.png" width=800>

If a user is authenticated and logged in, however, they should have the added ability to both edit AND delete a comment only if they select the id of a comment which they themselves posted. The image below displays these available options, as well as me attempting to update the current comment to test the PUT request works as intended.

<img src="docs/backend/images/comment-detail-logged-in.png" width=800>

The image below shows the PUT method working successfully with a 200 ok status code.

<img src="docs/backend/images/comment-detail-success.png" width=800>

I have also tested the delete method to check if it successfully erases a comment and displays the correct status code. This works as intended and can be seen in the gif below.

<img src="docs/backend/clips/comment-detail-delete.gif" width=800>


If I attempt to enter an invalid id within my url, I am shown a 404 Not found error message which can be seen below.

<img src="docs/backend/images/comment-detail-error.png" width=800>

If I attempt to update a comment with an empty field, I am shown a 400 Bad request error code as well as an appropriate message telling me that the field cannot be blank. This can be seen below.

<img src="docs/backend/images/comment-detail-error-2.png" width=800>


## Followers endpoints

### api/followers/

A logged out user should be able to view a list of all followers and all instances of a user following another user. This works as intended and can be seen below.

<img src="docs/backend/images/follower-list.png" width=800>

A logged in user should be able to both view the followers list as well as be able to follow other users authenticated on the site. This works as intended and can be seen below.

<img src="docs/backend/images/follower-list-logged-in.png" width=800>

If a logged in user tries to follow the same user twice however, the API should return a HTTP 400 Bad request error with a suitable error message. This also works as intended and can be seen in the image below. 

<img src="docs/backend/images/follower-list-duplicate.png" width=800>

### api/followers/id/

A logged out user should only be able to view a certain user following another user by accessing this endpoint. A logged in individual however, should also be able to delete a follower instance as you cannot edit it so that a user can stop following a profile. This is shown in the gif below.

<img src="docs/backend/clips/follower-detail-delete.gif" width=800>


## Likes endpoints

### api/likes/

This endpoint should display a list of all likes made by users through a GET request which should be visible to all users whether authenticated or not. The image below shows what a logged out user can see.

<img src="docs/backend/images/likes-list.png" width=800>

If a user is logged in and authenticated however, they should have the added option of adding a like on a particular post which can be accessed through a dropdown menu. This can be seen below.

<img src="docs/backend/images/likes-list-logged-in.png" width=800>

### api/likes/id/

This endpoint is for a specific like made by a user accessed through it's id which can be viewed by all users. If it's a logged in user, they can also delete a like to represent them 'unliking' a blogpost on the frontend. This can be seen below.

<img src="docs/backend/images/like-detail-logged-in.png" width=800>


## Posts endpoints

### api/posts/

This is the endpoint for the post list which should call a GET request in order to view a list of posts that have been made by each user. This should contain information such as the owner, created_at, title, content and more. All users regardless of whether they are authenticated or not should be able to view this as everyone needs to have access to posts created by users on the frontend. This works as intended and can be seen below.

<img src="docs/backend/images/post-list.png" width=800>

When a user is logged in, they should have the option of creating a post in the api with all of the correct corresponding fields. The data that I am going to post can be seen below.

<img src="docs/backend/images/post-list-logged-in.png" width=800>

The image below shows the data being successfully posted.

<img src="docs/backend/images/post-list-data.png" width=800>


### api/posts/id/

The post detail endpoint should succesfully call a GET request for both logged in and out users, while logged in users should have the option to both edit and delete a post they are the owner of or if it's the administrator. This can be seen below.

<img src="docs/backend/images/post-detail-logged-in.png" width=800>

If you notice in the image above, I have also edited the post data for my title, escerpt and content fields to test my PUT request. This worked as intended and successfully updated the relevant post which can be seen below.

<img src="docs/backend/images/post-detail-data.png" width=800>

I have also tested whether or not the delete method works as intended and successfully deletes a specific post, which it does. This can be seen below which occurred after I deleted the post shown above by the HTTP 204 no content code displayed as a message.

<img src="docs/backend/images/post-detail-deleted.png" width=800>


## Profiles endpoints

### api/profiles/

The profiles list endpoint should successfully display the same list of all profiles created by users whether they are logged in or not. There is no create view for the profiles-list endpoint as profile creation is handled by django signals. This can be seen below.

<img src="docs/backend/images/profile-list.png" width=800>


### api/profiles/id/

As for the profile detai endpoint, only the owner of the profile should be able to edit and update their own details such as their username. The image below shows me adding additional data in the content field to test the PUT method.

<img src="docs/backend/images/profile-detail.png" width=800>

This worked as intended and the result can be seen below.

<img src="docs/backend/images/profile-detail-data.png" width=800>

## Categories endpoints

### api/category/

The Category endpoint is the same as the posts endpoint as they are both related to one another. Authenticated users can make a post with the option of selecting a category which is then displayed as a list. The data I am about to enter can be seen below.

<img src="docs/backend/images/category.png" width=800>


## Error handling






