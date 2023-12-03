from django.contrib.auth.models import User
from .models import Post
from rest_framework import status
from rest_framework.test import APITestCase


class PostListViewTests(APITestCase):
    def setUp(self):
        User.objects.create_user(username='shadman', password='pass')

    def test_can_list_posts(self):
        # Retrieves my username and creates a post, before printing the
        # length of the response data
        shadman = User.objects.get(username='shadman')
        Post.objects.create(owner=shadman, title='a title')
        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.data)
        print(len(response.data))

    def test_logged_in_user_can_create_post(self):
        self.client.login(username='shadman', password='pass')
        response = self.client.post('/posts/', {'title': 'a title'})
        # Checks if there is a post and how many (should be 1)
        count = Post.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logged_out_user_cant_create_post(self):
        response = self.client.post('/posts/', {'title': 'a title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PostDetailViewTests(APITestCase):
    def setUp(self):
        # Creates two users to test if posts can be retrieved by id
        shadman = User.objects.create_user(username='shadman', password='pass')
        sakib = User.objects.create_user(username='sakib', password='pass')
        # Creates the posts
        Post.objects.create(
            owner=shadman, title='My title', content='Shadmans content'
        )
        Post.objects.create(
            owner=sakib, title='Another title', content='Sakibs content'
        )

    def test_user_can_retrieve_post_using_valid_id(self):
        # Enters url by post id
        response = self.client.get('/posts/1/')
        # Asserts the response shows the correct data (First post above)
        self.assertEqual(response.data['title'], 'My title')
        # Asserts the correct status code is displayed
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_retrieve_post_using_invalid_id(self):
        response = self.client.get('/posts/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_their_own_post(self):
        self.client.login(username='shadman', password='pass')
        # Edits the title
        response = self.client.put('/posts/1/', {'title': 'a new title'})
        # Fetches post from test database with it's id
        post = Post.objects.filter(pk=1).first()
        # Checks if title has been edited appropriately with correct
        # status code
        self.assertEqual(post.title, 'a new title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_update_post_they_dont_own(self):
        self.client.login(username='shadman', password='pass')
        # Enter a different post id number of different user
        response = self.client.put('/posts/2/', {'title': 'a new title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
