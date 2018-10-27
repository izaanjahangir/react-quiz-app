import React from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input, FormFeedback, Jumbotron } from 'reactstrap';
import { loginFirebase } from '../../config/Firebase';
import Loader from 'react-loader-spinner';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isEmailNotValid: false,
      isPasswordNotValid: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      isLoading: false
    }

    this.loginUser = this.loginUser.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  
  async loginUser(e) {
    e.preventDefault();

    const { history } = this.props

    if (this.validateFields()) {
      this.setState({isLoading: true});

      const user = {
        email: this.state.email,
        password: this.state.password
      }

      const response = await loginFirebase(user)
        .catch(err => this.setState({
          isLoading: false,
          isPasswordNotValid: true,
          isEmailNotValid: true,
          passwordErrorMessage: "Not Authorized! Email or password could be wrong",
          emailErrorMessage: "Not Authorized! Email or password could be wrong"
        }));

      if(response) history.push("/");
    }
  }

  clearErrors() {

    this.setState({
      isEmailNotValid: false,
      isPasswordNotValid: false,
    })

  }

  validateFields() {
    this.clearErrors();

    const { email, password } = this.state;

    if (!email.length) {
      this.setState({ emailErrorMessage: 'Email Address is required', isEmailNotValid: true })
      return false
    }

    if (!password.length) {
      this.setState({ passwordErrorMessage: 'Password is required', isPasswordNotValid: true })
      return false
    }

    return true;
  }

  render() {
    const {
      isEmailNotValid,
      emailErrorMessage,
      isPasswordNotValid,
      passwordErrorMessage,
      isLoading
    } = this.state

    return (
      <Row className="justified-row">
        <Col md={10} lg={6}>
          <Jumbotron>
            <h4 className="text-center">Login</h4>
            <Form onSubmit={this.loginUser}>
              <FormGroup>
                <Label for="email">Email:</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email..."
                  invalid={isEmailNotValid}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
                <FormFeedback>{emailErrorMessage}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="password">Password:</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password..."
                  invalid={isPasswordNotValid}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
                <FormFeedback>{passwordErrorMessage}</FormFeedback>
              </FormGroup>
              <FormGroup>
                {
                  isLoading ?
                    <Button>
                      <Loader
                        type="Puff"
                        width="20"
                        height="20"
                        color="white"
                      />
                    </Button> :
                    <Button>Login</Button>
                }
              </FormGroup>
            </Form>
          </Jumbotron>
        </Col>
      </Row>
    );
  }
}