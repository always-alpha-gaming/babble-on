import React from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';

export default class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      imageUrls: [],
      imageNames: [],
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.removeImage = this.removeImage.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    const {
      imageUrls,
      imageNames,
      name,
    } = this.state;
    const { onSuccess } = this.props;

    const images = imageUrls.map((url, i) => ({
      name: imageNames[i],
      url,
    }));

    // eslint-disable-next-line no-undef
    fetch('/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'upload',
        name,
        data: {
          images,
        },
      }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to create new request');
      }
    }).then(this.resetFields)
      .then(() => onSuccess('Successfully requested upload translation'));
  }

  async onImageChange(e) {
    e.persist();
    const images = e.target.files;
    const urlPromises = [];
    const newImageNames = [];

    for (let i = 0; i < images.length; i += 1) {
      const formData = new FormData(); // eslint-disable-line no-undef
      formData.append('sharex', images[i]);
      formData.append('secret', 'VAKEY');

      // eslint-disable-next-line no-undef
      const reqPromise = fetch('https://pvpcraft.ca/upload/upload_babble_to.php', {
        method: 'POST',
        mode: 'cors',
        body: formData,
      }).then((res) => {
        if (res.ok) {
          return res.text();
        }
        throw new Error(`Failed to get url: ${res.statusText}`);
      });
      urlPromises.push(reqPromise);
      newImageNames.push(images[i].name);
    }

    const newImageUrls = await Promise.all(urlPromises);
    e.target.value = null;

    this.setState(({ imageUrls, imageNames }) => ({
      imageUrls: imageUrls.concat(newImageUrls),
      imageNames: imageNames.concat(newImageNames),
    }));
  }

  resetFields() {
    this.setState({
      name: '',
      imageUrls: [],
      imageNames: [],
    });
  }

  removeImage(index) {
    return () => {
      this.setState(({ imageNames, imageUrls }) => ({
        imageNames: imageNames.filter((_, i) => i !== index),
        imageUrls: imageUrls.filter((_, i) => i !== index),
      }));
    };
  }

  render() {
    const { name, imageNames } = this.state;
    return (
      <>
        <Row>
          <Col xs={12}>
            <h2>Upload a file</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={8}>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label htmlFor="name">
                  Name:
                  <Input
                    onChange={({ target: { value } }) => this.setState({ name: value })}
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    required
                  />
                  <FormText color="muted">
                    A friendly name for the document
                  </FormText>
                </Label>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="image">
                  Image
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    name="image"
                    onChange={this.onImageChange}
                    multiple
                  />
                  <FormText color="muted">
                    Add the images that make up the document
                  </FormText>
                </Label>
              </FormGroup>
              <Input type="submit" value="Upload" />
            </Form>
          </Col>
          <Col xs={12} lg={4}>
            <h3>Images</h3>
            <ListGroup flush>
              {imageNames.map((url, i) => (
                <ListGroupItem>
                  {url}
                  <Button onClick={this.removeImage(i)} close />
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </>
    );
  }
}
