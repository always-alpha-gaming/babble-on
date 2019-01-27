import React from 'react'
import Link from 'next/link'
import fetch from 'isomorphic-fetch'
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { NextAuth } from 'next-auth/client'
import Page from '../components/page'
import Layout from '../components/layout'
import Cookies from 'universal-cookie'

export default class extends Page {
  static async getInitialProps({req}) {
    let props = await super.getInitialProps({req});
    props.linkedAccounts = await NextAuth.linked({req});
    return props
  }

  constructor(props) {
    super(props);
    this.state = {
      session: props.session,
      isSignedIn: (props.session.user) ? true : false,
      name: '',
      email: '',
      emailVerified: false,
      alertText: null,
      alertStyle: null
    };
    if (props.session.user) {
      this.state.name = props.session.user.name;
      this.state.email = props.session.user.email
    }
    this.handleChange = this.handleChange.bind(this);
    this.photoUpload = this.photoUpload.bind(this);
    this.onSubmit = this.onSubmit.bind(this)
  }

  async componentDidMount() {
    const session = await NextAuth.init({force: true});
    this.setState({
      session: session,
      isSignedIn: (session.user) ? true : false
    });

    // If the user bounces off to link/unlink their account we want them to
    // land back here after signing in with the other service / unlinking.
    const cookies = new Cookies();
    cookies.set('redirect_url', window.location.pathname, { path: '/' });

    this.getProfile()
  }


  getProfile() {
    fetch('/account/user', {
      credentials: 'include'
    })
    .then(r => r.json())
    .then(user => {
      if (!user.name || !user.email) return;
      this.setState({
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        avatar: user.avatar,
        skills: user.skills,
        type: user.type,
        bio: user.bio,
        rating: "2.3",
      })
    })
  }

  round(value, step) {
    step || (step = 1.0);
    const inv = 1.0 / step;
    return Math.round(value * inv) / inv;
  }

  generateStars() {
    if (this.state.rating){
      const stars = this.round(parseFloat(this.state.rating), 0.5);
    const starArray = [];
    for (let i = 1; i < stars; i++) {
      starArray.push(<i className="icon ion-md-star" style={{ fontSize: "50px" }}/>);
    }
    if (stars % 1 != 0) {
      starArray.push(<i className="icon ion-md-star-half" style={{ fontSize: "50px" }}/>);
    }
    const arrayln = starArray.length;
    for (let i = arrayln; i < 5; i++) {
      starArray.push(<i className="icon ion-md-star-outline" style={{ fontSize: "50px" }}/>);
    }
    return starArray
  }

  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  photoUpload(event, data) {
    const file = this.fileUpload.files[0];
    const url = window.URL.createObjectURL(file);
    this.setState({
      avatar: url
    })
  }

  async onSubmit(e) {
    // Submits the URL encoded form without causing a page reload
    e.preventDefault();

    this.setState({
      alertText: null,
      alertStyle: null
    });

    const formData = {
      _csrf: await NextAuth.csrfToken(),
      name: this.state.name || '',
      email: this.state.email || '',
      avatar: this.state.avatar,
      skills: this.state.skills,
      type: this.state.type,
      bio: this.state.bio,
      rating: "2.3",
    };

    // URL encode form
    // Note: This uses a x-www-form-urlencoded rather than sending JSON so that
    // the form also in browsers without JavaScript
    const encodedForm = Object.keys(formData).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
    }).join('&');

    fetch('/account/user', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedForm
    })
    .then(async res => {
      if (res.status === 200) {
        this.getProfile();
        this.setState({
          alertText: 'Changes to your profile have been saved',
          alertStyle: 'alert-success',
        });
        // Force update session so that changes to name or email are reflected
        // immediately in the navbar (as we pass our session to it).
        this.setState({
          session: await NextAuth.init({force: true}), // Update session data
        })
      } else {
        this.setState({
          session: await NextAuth.init({force: true}), // Update session data
          alertText: 'Failed to save changes to your profile',
          alertStyle: 'alert-danger',
        })
      }
    })
  }

  render() {
    if (this.state.isSignedIn === true) {
      const alert = (this.state.alertText === null) ? <div/> : <div className={`alert ${this.state.alertStyle}`} role="alert">{this.state.alertText}</div>;

      return (
        <Layout {...this.props} navmenu={false}>
          <Row className="mb-1">
            <Col xs="12">
              <h1 className="display-2">Account</h1>
              <p className="lead text-muted">
                Edit your profile and link accounts
              </p>
            </Col>
          </Row>
          {alert}
          {this.generateStars()}
          <Row className="mt-4">
            <Col xs="12" md="8" lg="9">
              <Form method="post" action="/account/user" onSubmit={this.onSubmit}>
                <Input name="_csrf" type="hidden" value={this.state.session.csrfToken} onChange={()=>{}}/>
                <FormGroup row>
                  <Col>
                      <img className={"img img-fluid"} src={this.state.avatar?this.state.avatar : "/static/img/avatar.svg"  } alt="didnt work" />
                  </Col>
                  <Col>
                    <Label sm={2}>Name:</Label>
                    <Input name="name" value={this.state.name} onChange={this.handleChange}/>
                    <Label sm={2}>Bio:</Label>
                    <Input type="textarea" name="bio" placeholder="Tell us about yourself..." value={this.state.bio} onChange={this.handleChange}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <label className="btn btn-primary">
                      Upload Photo <input name="avatar" type="file" hidden onChange={this.photoUpload} ref={(ref) => this.fileUpload = ref}/>
                    </label>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Email:</Label>
                  <Col sm={10} md={8}>
                    <Input name="email" value={(this.state.email.match(/.*@localhost\.localdomain$/)) ? '' : this.state.email} onChange={this.handleChange}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Skills:</Label>
                  <Col sm={10} md={8}>
                    <Input type="textarea" name="skills" value="" block={"true"} onChange={this.handleChange}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={12} md={10}>
                    <p className="text-right">
                      <Button color="primary" type="submit">Save Changes</Button>
                    </p>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col>
                <Button color="primary" size ="lg" block>Enter queue</Button>
                <Button color="primary" size ="lg" block>Enter queue</Button>
                <Button color="primary" size ="lg" block>Enter queue</Button>
                <Button color="primary" size ="lg" block>Enter queue</Button>
            </Col>
            <Col xs="12" md="4" lg="3">
            <LinkAccounts
              session={this.props.session}
              linkedAccounts={this.props.linkedAccounts}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Delete your account</h2>
              <p>
                If you delete your account it will be erased immediately.
                You can sign up again at any time.
              </p>
              <Form id="signout" method="post" action="/account/delete">
                <input name="_csrf" type="hidden" value={this.state.session.csrfToken}/>
                <Button type="submit" color="outline-danger"><span className="icon ion-md-trash mr-1"/> Delete Account</Button>
              </Form>
            </Col>
          </Row>
        </Layout>
      )
    } else {
      return (
        <Layout {...this.props} navmenu={false}>
          <Row>
            <Col xs="12" className="text-center pt-5 pb-5">
              <p className="lead m-0">
                <Link href="/auth"><a>Sign in to manage your profile</a></Link>
              </p>
            </Col>
          </Row>
        </Layout>
      )
    }
  }
}

export class LinkAccounts extends React.Component {
  render() {
    return (
      <React.Fragment>
        {
          Object.keys(this.props.linkedAccounts).map((provider, i) => {
            return <LinkAccount key={i} provider={provider} session={this.props.session} linked={this.props.linkedAccounts[provider]}/>
          })
        }
      </React.Fragment>
    )
  }
}

export class LinkAccount extends React.Component {
  render() {
    if (this.props.linked === true) {
      return (
        <form method="post" action={`/auth/oauth/${this.props.provider.toLowerCase()}/unlink`}>
          <input name="_csrf" type="hidden" value={this.props.session.csrfToken}/>
          <p>
            <button className="btn btn-block btn-outline-danger" type="submit">
              Unlink from {this.props.provider}
            </button>
          </p>
        </form>
      )
    } else {
      return (
        <p>
          <a className="btn btn-block btn-outline-primary" href={`/auth/oauth/${this.props.provider.toLowerCase()}`}>
            Link with {this.props.provider}
          </a>
        </p>
      )
    }
  }
}
