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