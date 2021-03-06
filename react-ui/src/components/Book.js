import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect} from 'react-router-dom';
import { Nav, NavItem, Tab, Row, PageHeader, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Available from './bookTabs/Available';
import Billing from './bookTabs/Billing';
import Payment from './bookTabs/Payment';
import Confirmation from './bookTabs/Confirmation';

import '../stylesheets/book.css';

class Book extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    admin: PropTypes.object.isRequired,
    fetchSearch: PropTypes.func.isRequired,
    select: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,
    updateCheckout: PropTypes.func.isRequired,
    makeModal: PropTypes.func.isRequired,
    modalVisible: PropTypes.object.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    createEmail: PropTypes.func.isRequired,
    errorMessage: PropTypes.object.isRequired,
    fetchClient: PropTypes.func.isRequired
  }


  render(){
    return (
      <div className="main-content">
        <PageHeader>Book Now</PageHeader>

        <Row className="clearfix">
          <Col sm={4}>
            <Nav bsStyle="pills" stacked>

              <LinkContainer to="/book-now/availability">
                <NavItem className="tab">I.  Check Availability</NavItem>
              </LinkContainer>
              <LinkContainer to="/book-now/billing" disabled={!(this.props.checkout.selected || this.props.admin.username)}>
                <NavItem className="tab" >II.  Billing</NavItem>
              </LinkContainer>
              <LinkContainer to="/book-now/payment" disabled={(this.props.checkout.billing)}>
                <NavItem className="tab">III.  Payment</NavItem>
              </LinkContainer>
              <LinkContainer to="/book-now/confirmation" disabled={(this.props.checkout.payment)}>
                <NavItem className="tab">IV.  Confirmation</NavItem>
              </LinkContainer>

            </Nav>
          </Col>

          <Col sm={8}>
            <Route exact path="/book-now/" render={ () =>
              <Redirect to="/book-now/availability" /> }
            />
            <Route path="/book-now/availability/" render={ () =>
              <Available
                data={this.props.data}
                fetchSearch={this.props.fetchSearch}
                select={this.props.select}
                checkout={this.props.checkout}
                updateCheckout={this.props.updateCheckout}
                admin={this.props.admin}
                makeModal={this.props.makeModal}
                modalVisible={this.props.modalVisible}
                verifyEmail={this.props.verifyEmail}
                logout={this.props.logout}
                createEmail={this.props.createEmail}
                errorMessage={this.props.errorMessage}
              /> }
            />
            <Route path="/book-now/billing/" render={ () =>
              <Billing
                makeModal={this.props.makeModal}
                updateCheckout={this.props.updateCheckout}
                checkout={this.props.checkout}
                select={this.props.select}
                fetchClient={this.props.fetchClient}
                admin={this.props.admin}
                data={this.props.data}
                modalVisible={this.props.modalVisible}
              />}
            />
            <Route path="/book-now/payment/" render={ () =>
              <Payment

              /> }
            />
            <Route path="/book-now/confirmation/" render={ () => (this.props.checkout.payment) ?
              <Confirmation

              /> :
              <Redirect to="/book-now/payment" /> }
            />
          </Col>
        </Row>

      </div>

    );
  }
}

export default Book;

// <Route path="/book-now/billing/" render={ () => (this.props.checkout.selected && this.props.admin.username) ?
//   <Billing
//
//   /> :
//   <Redirect to="/book-now/availability" />
// }
// />
// <Route path="/book-now/payment/" render={ () => (this.props.checkout.billing) ?
//   <Payment
//
//   /> :
//   <Redirect to="/book-now/billing" /> }
// />
// <Route path="/book-now/confirmation/" render={ () => (this.props.checkout.payment) ?
//   <Confirmation
//
//   /> :
//   <Redirect to="/book-now/payment" /> }
// />
