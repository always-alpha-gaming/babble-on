import React from 'react';
import {
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';

export default class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      imageUrls: [],
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.onSubmit();
  }

  render() {
    const { name } = this.state;
    return (
      <>
        <Row>
          <Col xs={12}>
            <h2>Upload a file</h2>
          </Col>
        </Row>
        <Row>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label htmlFor="name">
                Name:
                <Input
                  onInput={({ target: { value } }) => this.setState({ name: value })}
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
                  required
                />
                <FormText color="muted">
                  Add the images that make up the document
                </FormText>
              </Label>
            </FormGroup>
          </Form>
        </Row>
      </>
    );
  }
}
