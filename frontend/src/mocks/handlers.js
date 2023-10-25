import { rest } from "msw";

// Taken from axiosdefault file
const baseURL = "https://django-rest-api-de0173352397.herokuapp.com/";

export const handlers = [
  // Mocks a request to the api. ctx means context
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    // Mocked api request handlers will intercept test request and
    // respond with provided user data below
    return res(
      // Taken from rest.get url that stores user json data
      ctx.json({
        pk: 1,
        username: "theadmin",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 1,
        profile_image:
          "https://res.cloudinary.com/dxi6wf2uy/image/upload/v1/media/images/my-image_k0rw4i",
      })
    );
  }),
  //   Tests if a user can logout sucessfully with no errors
  // which is a status code of 200
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
