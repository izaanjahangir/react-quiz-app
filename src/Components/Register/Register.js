import React from 'react';
import { Row, Col,Button, Form, FormGroup, Label, Input, FormFeedback, Jumbotron, CustomInput, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { registerFirebase } from '../../config/Firebase';
import Loader from 'react-loader-spinner';

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      image: null,
      fileName: "Choose file",
      file: null,
      isModal: false,
      isLoading: false,
      username: '',
      email: '',
      password: '',
      password2: '',
      isEmailValid: false,
      isUsernameValid: false,
      isEmailNotValid: false,
      isPasswordNotValid: false,
      isPasswordValid: false,
      isPasswordMatched: false,
      isPasswordNotMatched: false,
      isUsernameNotValid: false,
      isFileNotSelected: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
    }

    this.registerUser = this.registerUser.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.clearValidationMessages = this.clearValidationMessages.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    const { isModal } = this.state;

    this.setState({ isModal: !isModal });
  }

  onModalClick(answer){
    const { inputFileRef } = this.state
    if(!answer){
      inputFileRef.target.value = "";
      this.setState({fileName: 'Choose file', file: null});
    }
    this.toggleModal();
  }

  async registerUser(e) {
    e.preventDefault();

    if (this.validateFields()) {
      this.setState({ isLoading: true });

      const user = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        file: this.state.file
      }
      const response = await registerFirebase(user)
        .catch(err => {
          this.setState({ isLoading: false })
          if (err.code === 'auth/invalid-email') {
            this.setState({ isEmailNotValid: true, isEmailValid: false, emailErrorMessage: err.message });
          }
          if (err.code === 'auth/weak-password') {
            this.setState({ isPasswordNotValid: true, isPasswordValid: false, passwordErrorMessage: err.message });
          }
          if (err.code === 'auth/email-already-in-use') {
            this.setState({ isEmailNotValid: true, isEmailValid: false, emailErrorMessage: err.message });
          }
        });

      if (response) {
        const { history } = this.props;
        history.push("/");
      }
    }

  }

  clearValidationMessages() {

    this.setState({
      isUsernameNotValid: false,
      isEmailNotValid: false,
      isPasswordNotValid: false,
      isPasswordNotMatched: false,
      isPasswordMatched: false,
      isEmailValid: false,
      isPasswordValid: false,
      isUsernameValid: false
    })

  }

  async previewImage(e) {
    const inputFileRef = {...e};
    const file = e.target.files[0];
    const image = await this.convertToBase64(file);
    this.setState({image, fileName: file.name, inputFileRef, file}, () => this.toggleModal())
  }

  convertToBase64(file) {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    return new Promise( resolve => 
      reader.addEventListener("load", () => 
      resolve(reader.result), false))
  }

  validateFields() {
    this.clearValidationMessages();

    const { username, email, password, password2, file } = this.state;

    if (!username.length) {
      this.setState({ usernameErrorMessage: 'Username is required', isUsernameNotValid: true })
      return false
    }
    else {
      this.setState({ isUsernameValid: true });
    }

    if (!email.length) {
      this.setState({ emailErrorMessage: 'Email Address is required', isEmailNotValid: true })
      return false
    }
    else {
      this.setState({ isEmailValid: true });
    }

    if (!password.length) {
      this.setState({ passwordErrorMessage: 'Password is required', isPasswordNotValid: true })
      return false
    }
    else {
      this.setState({ isPasswordValid: true });
    }

    if (password !== password2) {
      this.setState({ isPasswordNotMatched: true })
      return false
    }
    else {
      this.setState({ isPasswordMatched: true });
    }

    if (!file){
      this.setState({isFileNotSelected: true});
      return false;
    }
    else{
      this.setState({isFileNotSelected: false})
    }

    return true;
  }

  render() {
    const {
      isUsernameValid,
      isUsernameNotValid,
      usernameErrorMessage,
      isFileNotSelected,
      isEmailValid,
      isEmailNotValid,
      emailErrorMessage,
      isPasswordNotValid,
      isPasswordValid,
      passwordErrorMessage,
      isPasswordMatched,
      isPasswordNotMatched,
      isLoading,
      image,
      fileName
    } = this.state

    return (
      <Row className="justified-row">
        <Col md={10} lg={6}>
          <Jumbotron>
            <h4 className="text-center">Register for a new account</h4>
            <Form onSubmit={this.registerUser}>
              <FormGroup>
                <Label for="username">Username:</Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Enter your name..."
                  onChange={(e) => this.setState({ username: e.target.value })}
                  valid={isUsernameValid}
                  invalid={isUsernameNotValid}
                />
                <FormFeedback valid>Nice Name!</FormFeedback>
                <FormFeedback>{usernameErrorMessage}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="email">Email:</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email..."
                  invalid={isEmailNotValid}
                  valid={isEmailValid}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
                <FormFeedback valid>Looks Good!</FormFeedback>
                <FormFeedback>{emailErrorMessage}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="password">Password:</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password..."
                  valid={isPasswordValid}
                  invalid={isPasswordNotValid}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
                <FormFeedback valid>Looks Good!</FormFeedback>
                <FormFeedback>{passwordErrorMessage}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="password2">Confirm Password:</Label>
                <Input
                  type="password"
                  id="password2"
                  placeholder="Retype your password..."
                  valid={isPasswordMatched}
                  invalid={isPasswordNotMatched}
                  onChange={(e) => this.setState({ password2: e.target.value })}
                />
                <FormFeedback valid>Password Matched!</FormFeedback>
                <FormFeedback>Password doesn't matched</FormFeedback>
              </FormGroup>
              <FormGroup style={{overflow: "hidden"}}>
                <Label for="profile-picture">Upload your profile picture</Label>
                <CustomInput 
                  type="file" 
                  id="profile-picture" 
                  name="profilepicture"  
                  label={fileName} 
                  onChange={this.previewImage}
                  invalid={isFileNotSelected}
                />
                <FormFeedback valid>This is required</FormFeedback>
                <FormFeedback>You look nice!</FormFeedback>
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
            <div className="custom-modal-container">
              <Modal isOpen={this.state.isModal} toggle={this.toggleModal} className="custom-modal">
                <ModalHeader toggle={this.toggleModal} close={"X"}>Your Image will look like this!</ModalHeader>
                <ModalBody className="custom-modal">
                  <div style={{backgroundImage: `url(${image})`}} className="modal-image"></div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.onModalClick.bind(this,true)}>Done</Button>
                  <Button color="secondary" onClick={this.onModalClick.bind(this,false)}>Cancel</Button>
                </ModalFooter>
              </Modal>
            </div>
          </Jumbotron>
        </Col>
      </Row>
    );
  }
}