import React from 'react';
import {
  Row, Col, Card, CardImg, CardText, CardBody,
  CardTitle, Button
} from 'reactstrap';
import * as firebase from 'firebase';
import CustomLoader from '../CustomLoader/CustomLoader';
import HtmlLogo from '../../assets/images/html.png';
import CssLogo from '../../assets/images/css.png';
import JsLogo from '../../assets/images/js.png';


export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true
    }

  }

  componentDidMount() {
    const { history } = this.props

    console.log(firebase.auth().currentUser)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        this.setState({ isLoading: false });
      }
      else {
        history.push("Login");
      }
    })
  }

  render() {
    const { isLoading } = this.state;
    return (
      isLoading ? <CustomLoader /> :
        <div>
          <Row style={{justifyContent: 'center'}}>
            <Col  sm="6" md="4" lg="3" className="my-2">
              <Card>
                <CardImg top width="100%" src={HtmlLogo} alt="html" />
                <CardBody>
                  <CardTitle>Html Quizes</CardTitle>
                  <CardText>Test your markup skills now</CardText>
                  <Button block>Learn more</Button>
                </CardBody>
              </Card>
            </Col>

            <Col sm="6" md="4" lg="3" className="my-2">
              <Card>
                <CardImg top width="100%" src={CssLogo} alt="html" />
                <CardBody>
                  <CardTitle>Css Quizes</CardTitle>
                  <CardText>Test your styling skills now</CardText>
                  <Button block>Learn more</Button>
                </CardBody>
              </Card>
            </Col>

            <Col sm="6" md="4" lg="3" className="my-2">
              <Card>
                <CardImg top width="100%" src={JsLogo} alt="html" />
                <CardBody>
                  <CardTitle>JavaScript Quizes</CardTitle>
                  <CardText>Test your javascript skills now</CardText>
                  <Button block>Learn more</Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}