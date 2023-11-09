import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { Alert, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

function PostCreateForm() {
  // Redirects logged out users to homepage if they try to
  // access the post create form
  useRedirect("loggedOut");

  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    category: "",
    title: "",
    excerpt: "",
    content: "",
    image: "",
  });

  const { category, title, content, image, excerpt } = postData;

  // References the image form.file element
  const imageInput = useRef(null);

  // Used to redirect users to different pages
  const history = useHistory();

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  // Function for React Quill onChange attribute
  // Matches value to content
  const handleChangeContent = (value) => {
    setPostData((prev) => {
      return {
        ...prev,
        content: value,
      };
    });
  };

  // Function for image field upload
  const handleChangeImage = (event) => {
    // First checks if there is a file
    if (event.target.files.length) {
      // In case the user decides to change their image
      // file after adding one, revoke is called
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Assign each type of data to the correct variable defined above
    formData.append("category", category);
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("image", imageInput.current.files[0]);

    // Need to refresh access token for sending an image file
    try {
      const { data } = await axiosReq.post("/posts/", formData);
      // Assins a unique post id to the post
      history.push(`/posts/${data.id}`);
    } catch (error) {
      // console.log(error);
      // If the error status is NOT a 401 error
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      {/* Add your form fields here */}

      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {/* Displays errors */}
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={category}
          onChange={handleChange}
        >
          <option>World</option>
          <option>Environment</option>
          <option>Technology</option>
          <option>Design</option>
          <option>Culture</option>
          <option>Business</option>
          <option>Politics</option>
          <option>Opinion</option>
          <option>Science</option>
          <option>Health</option>
          <option>Style</option>
          <option>Travel</option>
        </Form.Control>
      </Form.Group>
      {/* Displays errors */}
      {errors?.category?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Excerpt</Form.Label>
        <Form.Control
          type="text"
          name="excerpt"
          value={excerpt}
          onChange={handleChange}
        />
      </Form.Group>
      {/* Displays errors */}
      {errors?.excerpt?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <ReactQuill
          className={styles.QlContainer}
          theme="snow"
          value={content}
          onChange={handleChangeContent}
          placeholder={"A canvas for your thoughts..."}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        create
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row className=" d-flex justify-content-center">
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {/* Displays image preview if they have chosen one */}
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                // Or else shows the icon to upload an image
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset
                    src={Upload}
                    message="Click or tap to upload an image"
                  />
                </Form.Label>
              )}

              {/* Asterisk on accept is so that users can only upload images */}
              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <div className="text-center">{textFields}</div>
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostCreateForm;
