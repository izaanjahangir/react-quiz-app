import React, { Component } from 'react'
import { ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { logoutFirebase, readFirestore } from '../../config/Firebase';
import * as firebase from 'firebase';

export default class Header extends Component {
  constructor() {
    super();

    this.state = {
      isLogged: false,
      user: null
    }

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        let user = await readFirestore();
        user = user.data();
        console.log(user)
        this.setState({ isLogged: true, user })
      }
      else this.setState({ isLogged: false })
    })

  }

  toggle(){
    let { dropdownOpen } = this.state;

    this.setState({dropdownOpen: !dropdownOpen});
  }

  render() {
    const { isLogged, user } = this.state;
    return (
      <header>
        <p>Quiz App</p>
        {
          isLogged &&
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              <img src={user.profilepicture} className="avatar" alt="avatar" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>{user.username}</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={logoutFirebase} className="custom-btn">Log out</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        }
      </header>
    )
  }
}
