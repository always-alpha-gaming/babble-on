/**
 * Creating a page named _error.js lets you override HTTP error messages
 */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { Container } from 'reactstrap';
import Styles from '../css/index.scss';

class ErrorPage extends React.Component {
  static propTypes() {
    return {
      errorCode: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    };
  }

  static getInitialProps({ res, xhr }) {
    let errorCode = null;
    if (res) {
      errorCode = res.statusCode;
    } else if (xhr) {
      errorCode = xhr.status;
    }
    return { errorCode };
  }

  render() {
    const { errorCode, router } = this.props;

    let response;
    switch (errorCode) {
      case 200: // Also display a 404 if someone requests /_error explicitly
      case 404:
        response = (
          <div>
            <Head>
              <style dangerouslySetInnerHTML={{ __html: Styles }} />
            </Head>
            <Container className="pt-5 text-center">
              <h1 className="display-4">Page Not Found</h1>
              <p>
                The page
                {' '}
                <strong>
                  {router.pathname}
                </strong>
                {' '}
                does not exist.
              </p>
              <p>
                <Link href="/">
                  <a href="/">Home</a>
                </Link>
              </p>
            </Container>
          </div>
        );
        break;
      case 500:
        response = (
          <div>
            <Head>
              <style dangerouslySetInnerHTML={{ __html: Styles }} />
            </Head>
            <Container className="pt-5 text-center">
              <h1 className="display-4">Internal Server Error</h1>
              <p>An internal server error occurred.</p>
            </Container>
          </div>
        );
        break;
      default:
        response = (
          <div>
            <Head>
              <style dangerouslySetInnerHTML={{__html: Styles}}/>
            </Head>
            <Container className="pt-5 text-center">
              <h1 className="display-4">
                HTTP
                {errorCode}
                Error
              </h1>
              <p>
                An
                {' '}
                <strong>
                  HTTP
                  {' '}
                  {errorCode}
                </strong>
                {' '}
                error occurred while trying to access
                {' '}
                <strong>
                  {router.pathname}
                </strong>
              </p>
            </Container>
          </div>
        );
    }

    return response;
  }
}

export default withRouter(ErrorPage);
