import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ControlLabel, FormGroup, Row, Col, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

class Available extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    updateCheckout: PropTypes.func.isRequired,
    fetchSearch: PropTypes.func.isRequired,
    select: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      arrive: props.select.arrive,
      depart: props.select.depart,
      guests: props.select.guests,
    };
  }

  componentDidMount(){
    if(this.props.checkout.selected === false) this.props.fetchSearch(this.props.select);
  }

  handleStart = (date) => {
    const arrive = date.toDate().getTime();
    const depart = (arrive >= this.state.depart) ?
      arrive + (24*60*60*1000) :
      this.state.depart;
    this.setState({
      arrive: arrive,
      depart: depart
    }, () => this.props.fetchSearch(this.state));
  }


  handleLeave = (date) => {
    this.setState({
      depart: date.toDate().getTime(),
    }, () => this.props.fetchSearch(this.state));
  }

  handleGuests = (e) => {
    this.setState({
      guests: e.target.value,
    }, () => this.props.fetchSearch(this.state));
  }



//selected determined by moment(millisecond).
//This millisecond was initialized in reducer to current date or moment().toDate().getTime()
  render() {
    const guestOptions = [...new Array(6)].map((ob, i) => (
      <option value={i} key={`guest${i}`}>
        {i}
      </option>
    ));

    const available = this.props.data.map(room => (
      <div className="well text-center well-option">
        <img className="room-img round" src={room.image} alt={room.name} />
        <h3>{room.title}</h3>

        <Button bsStyle="primary">
          <NavLink className="select" onClick={(e) => {
            console.log("hello");
            //if(e) e.preventDefault();
            this.props.updateCheckout(
              {
                "roomID": room._id,
                "guests":this.state.guests,
                "arrive":new Date(this.state.arrive).getTime(),
                "depart":new Date(this.state.depart).getTime()
              },
              {
                ...this.props.checkout,
                "selected": true
              }
            );
          }} to="/book-now/billing">
            Select
          </NavLink>
        </Button>
      </div>
    ));

    return (
      <div className="tab-content text-center">
        <form className="room-form" >
          <FormGroup>
            <Row className="clearfix text-center">
              <Col sm={4}>
                <ControlLabel>Number of Guests</ControlLabel><br />
              </Col>
              <Col sm={4}>
                <select
                  className="form-control guest-num"
                  id="guest-num"
                  onChange={this.handleGuests}
                  value={this.state.guests}
                >
                  {guestOptions}
                </select>
              </Col>
              </Row>
          </FormGroup>

          <FormGroup>
            <Row className="clearfix text-center">
              <Col sm={4}>
                <ControlLabel>Arrival</ControlLabel>
              </Col>
              <Col sm={4}>
                <DatePicker
                  id="arrivalPicker"
                  className="form-control date pull-left"
                  selected={moment(this.state.arrive)}
                  onChange={this.handleStart}
                  minDate={moment()}
                  maxDate={moment().add(365, "days")}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col sm={4}>
                <ControlLabel>Departure</ControlLabel>
              </Col>
              <Col sm={4}>
                <DatePicker
                  id="departPicker"
                  className="form-control date pull-right"
                  selected={moment(this.state.depart)}
                  onChange={this.handleLeave}
                  minDate={moment()}
                  maxDate={moment().add(365, "days")}
                />
              </Col>
            </Row>
          </FormGroup>
        </form>

        {available}
      </div>

    );
  }
}

export default Available;
