import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  Button,
  Form,
  Navbar,
  NavbarBrand,
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { NextAuth } from 'next-auth/client';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import Signin from './signin';
import Package from '../package';
import Styles from '../css/index.scss';

export default class extends React.Component {
  static get propTypes() {
    return {
      /* eslint-disable react/forbid-prop-types */
      session: PropTypes.object.isRequired,
      providers: PropTypes.object,
      children: PropTypes.array.isRequired,
      /* eslint-enable */
      // fluid: PropTypes.boolean,
      // navmenu: PropTypes.boolean,
      // signinBtn: PropTypes.boolean,
      title: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      title: 'Babble On',
      fluid: false,
      navmenu: true,
      signinBtn: true,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
      modal: false,
      providers: null,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  async toggleModal(e) {
    if (e) {
      e.preventDefault();
    }

    const { modal, providers } = this.state;

    // Save current URL so user is redirected back here after signing in
    if (modal !== true) {
      const cookies = new Cookies();
      cookies.set('redirect_url', window.location.pathname, { path: '/' });
    }

    this.setState({
      providers: providers || await NextAuth.providers(),
      modal: !modal,
    });
  }

  render() {
    const {
      modal,
      providers,
    } = this.state;
    const {
      title,
      session,
      signinBtn,
      navmenu,
      fluid,
      container,
      children,
    } = this.props;

    return (
      <React.Fragment>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <style dangerouslySetInnerHTML={{ __html: Styles }} />
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
        </Head>
        <Navbar light className="navbar navbar-expand-md pt-3 pb-3">
          <Link prefetch href="/">
            <NavbarBrand href="/">
              <span className="icon ion-md-home mr-1" />
              {' '}
              {Package.name}
            </NavbarBrand>
          </Link>
          <label tabIndex="-1" htmlFor="nojs-navbar-check" className="nojs-navbar-label mt-2">
            <input
              className="nojs-navbar-check"
              id="nojs-navbar-check"
              type="checkbox"
              aria-label="Menu"
            />
          </label>
          <div className="nojs-navbar">
            <Nav navbar>
              <div tabIndex="-1" className="dropdown nojs-dropdown">
                <div className="nav-item">
                  <span className="dropdown-toggle nav-link">Examples</span>
                </div>
                <div className="dropdown-menu">
                  <Link prefetch href="/examples/authentication">
                    <a href="/examples/authentication" className="dropdown-item">Auth</a>
                  </Link>
                  <Link prefetch href="/examples/async">
                    <a href="/examples/async" className="dropdown-item">Async Data</a>
                  </Link>
                  <Link prefetch href="/examples/layout">
                    <a href="/examples/layout" className="dropdown-item">Layout</a>
                  </Link>
                  <Link prefetch href="/examples/routing">
                    <a href="/examples/routing" className="dropdown-item">Routing</a>
                  </Link>
                  <Link prefetch href="/examples/styling">
                    <a href="/examples/styling" className="dropdown-item">Styling</a>
                  </Link>
                </div>
              </div>
            </Nav>
            <UserMenu session={session} toggleModal={this.toggleModal} signinBtn={signinBtn}/>
          </div>
        </Navbar>
        <MainBody navmenu={navmenu} fluid={fluid} container={container}>
          {children}
        </MainBody>
        <Container fluid={fluid}>
          <hr className="mt-3" />
          <p className="text-muted small">
            <Link href="https://github.com/iaincollins/nextjs-starter">
              <a
                href="https://github.com/iaincollins/nextjs-starter"
                className="text-muted font-weight-bold"
              >
                <span className="icon ion-logo-github" />
                {' '}
                {Package.name}
                {' '}
                {Package.version}
              </a>
            </Link>
            <span> built with </span>
            <Link href="https://github.com/zeit/next.js">
              <a href="https://github.com/zeit/next.js" className="text-muted font-weight-bold">
                Next.js
                {' '}
                {Package.dependencies.next.replace('^', '')}
              </a>
            </Link>
            <span> &amp; </span>
            <Link href="https://github.com/facebook/react">
              <a href="https://github.com/facebook/react" className="text-muted font-weight-bold">
                React
                {' '}
                {Package.dependencies.react.replace('^', '')}
              </a>
            </Link>
            .
            <span className="ml-2">
              &copy;
              {' '}
              {new Date().getYear() + 1900}
              .
            </span>
          </p>
        </Container>
        <SigninModal
          modal={modal}
          toggleModal={this.toggleModal}
          session={session}
          providers={providers}
        />
      </React.Fragment>
    );
  }
}

/* eslint-disable react/no-multi-comp */
export const MainBody = (
  {
    children,
    container,
    fluid,
    navmenu,
  }) => {
  if (container === false) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }
  if (navmenu === false) {
    return (
      <Container fluid={fluid} style={{ marginTop: '1em' }}>
        {children}
      </Container>
    );
  }
  return (
    <Container fluid={fluid} style={{ marginTop: '1em' }}>
      <Row>
        <Col xs="12" md="9" lg="10">
          {children}
        </Col>
        <Col xs="12" md="3" lg="2" style={{ paddingTop: '1em' }}>
          <h5 className="text-muted text-uppercase">Examples</h5>
          <ListGroup>
            <ListGroupItem>
              <Link prefetch href="/examples/authentication">
                <a href="/examples/authentication" className="d-block">
                  Auth
                </a>
              </Link>
            </ListGroupItem>
            <ListGroupItem>
              <Link prefetch href="/examples/async">
                <a href="/examples/async" className="d-block">
                  Async
                </a>
              </Link>
            </ListGroupItem>
            <ListGroupItem>
              <Link prefetch href="/examples/layout">
                <a href="/examples/layout" className="d-block">
                  Layout
                </a>
              </Link>
            </ListGroupItem>
            <ListGroupItem>
              <Link prefetch href="/examples/routing">
                <a href="/examples/routing" className="d-block">
                  Routing
                </a>
              </Link>
            </ListGroupItem>
            <ListGroupItem>
              <Link prefetch href="/examples/styling">
                <a href="/examples/styling" className="d-block">
                  Styling
                </a>
              </Link>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export class UserMenu extends React.Component {
  static get propTypes() {
    return {
      session: PropTypes.object.isRequired,
      // signinBtn: PropTypes.boolean,
      // toggleModal: PropTypes.boolean,
    };
  }

  static async handleSignoutSubmit(event) {
    event.preventDefault();

    // Save current URL so user is redirected back here after signing out
    const cookies = new Cookies();
    cookies.set('redirect_url', window.location.pathname, { path: '/' });

    await NextAuth.signout();
    Router.push('/');
  }

  render() {
    const {
      session,
      signinBtn,
      toggleModal,
    } = this.props;

    if (session && session.user) {
      // If signed in display user dropdown menu
      return (
        <Nav className="ml-auto" navbar>
          {/*
            * Uses .nojs-dropdown CSS to for a dropdown that works without client side JavaScript
            */}
          <div tabIndex="-2" className="dropdown nojs-dropdown">
            <div className="nav-item">
              <span className="dropdown-toggle nav-link d-none d-md-block">
                <span
                  className="icon ion-md-contact"
                  style={{
                    fontSize: '2em',
                    position: 'absolute',
                    top: -5,
                    left: -25,
                  }}
                />
              </span>
              <span className="dropdown-toggle nav-link d-block d-md-none">
                <span className="icon ion-md-contact mr-2" />
                {session.user.name || session.user.email}
              </span>
            </div>
            <div className="dropdown-menu">
              <Link prefetch href="/account">
                <a href="/account" className="dropdown-item">
                  <span className="icon ion-md-person mr-1" />
                  {' '}
                  Your Account
                </a>
              </Link>
              <AdminMenuItem {...this.props} />
              <div className="dropdown-divider d-none d-md-block"/>
              <div className="dropdown-item p-0">
                <Form
                  id="signout"
                  method="post"
                  action="/auth/signout"
                  onSubmit={UserMenu.handleSignoutSubmit}
                >
                  <input name="_csrf" type="hidden" value={session.csrfToken} />
                  <Button type="submit" block className="pl-4 rounded-0 text-left dropdown-item">
                    <span className="icon ion-md-log-out mr-1" />
                    {' '}
                    Sign out
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </Nav>
      );
    }
    if (signinBtn === false) {
      // If not signed in, don't display sign in button if disabled
      return null;
    }
    // If not signed in, display sign in button
    return (
      <Nav className="ml-auto" navbar>
        <NavItem>
          {/**
           * @TODO Add support for passing current URL path as redirect URL
           * so that users without JavaScript are also redirected to the page
           * they were on before they signed in.
           */}
          <a
            href="/auth?redirect=/"
            className="btn btn-outline-primary"
            onClick={toggleModal}
          >
            <span className="icon ion-md-log-in mr-1" />
            {' '}
            Sign up / Sign in
          </a>
        </NavItem>
      </Nav>
    );
  }
}

export const AdminMenuItem = ({ session }) => {
  if (session.user && session.user.admin === true) {
    return (
      <React.Fragment>
        <Link prefetch href="/admin">
          <a href="/admin" className="dropdown-item">
            <span className="icon ion-md-settings mr-1" />
            {' '}
            Admin
          </a>
        </Link>
      </React.Fragment>
    );
  }
  return (<div />);
};
AdminMenuItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  session: PropTypes.object.isRequired,
};

export const SigninModal = ({ providers, modal, toggleModal, session }) => {
  if (providers === null) {
    return null;
  }

  return (
    <Modal isOpen={modal} toggle={toggleModal} style={{ maxWidth: 700 }}>
      <ModalHeader>Sign up / Sign in</ModalHeader>
      <ModalBody style={{ padding: '1em 2em' }}>
        <Signin session={session} providers={providers} />
      </ModalBody>
    </Modal>
  );
};

/* eslint-enable */
