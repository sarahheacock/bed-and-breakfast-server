import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Tab, Row, Col, PageHeader } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Nancy from './aboutTabs/Nancy';


class About extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchBlog: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    selectEdit: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      aboutTabs: []
    }
  }

  componentDidMount(){
    this.props.fetchBlog("about");
  }

  componentDidUpdate(){
    if(this.props.data[1]["title"] !== undefined && this.state.aboutTabs.length === 0){
      let cat = [];
      this.props.data.forEach((event, index) => {
          let create = {
            "title": event.title,
            "link": `/about/${event.title.trim().replace(/\s/g, "-")}`,
            "data": event
          };

          cat.push(create);
        });

      this.setState({aboutTabs: cat})
    }
  }

  render(){
    console.log(this.state.categories);

    //create tabs from categories
    const tabs = (this.state.aboutTabs.length === 0) ?
      <div>Loading</div> :
      this.state.aboutTabs.map((c, index) => (
        <LinkContainer to={c.link}>
          <NavItem className="tab">{c.title}</NavItem>
        </LinkContainer>
      ));

    const defaultRoute = (this.state.aboutTabs.length === 0) ?
       <div></div>:
       <Route exact path="/about/" render={ () =>
         <Redirect to={this.state.aboutTabs[0]["link"]} /> }
       />;

    const routes = (this.state.aboutTabs.length === 0) ?
      <div></div> :
      this.state.aboutTabs.map((c, index) => (
        <Route path={c.link} render={ () =>
          <Nancy
            data={c.data}
            admin={this.props.admin}
            selectEdit={this.props.selectEdit}
          /> }
        />
      ));

    return (
      <div className="main-content">
        <PageHeader>About Us</PageHeader>
        <div>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">

              <Nav bsStyle="tabs">
                {tabs}
              </Nav>

              {defaultRoute}
              {routes}

          </Row>
          </Tab.Container>
          </div>
      </div>
    );
  }
}

//   componentDidMount(){
//     this.props.fetchBlog("about")
//   }
//
//   render(){
// //names are sorted in API to ensure 'nancy' always comes first
//     return (
//       <div className="main-content">
//         <PageHeader>About Us</PageHeader>
//         <div>
//           <Tab.Container id="left-tabs-example" defaultActiveKey="first">
//           <Row className="clearfix">
//
//               <Nav bsStyle="tabs">
//                 <LinkContainer to="/about/inn">
//                   <NavItem className="tab">Inn</NavItem>
//                 </LinkContainer>
//                 <LinkContainer to="/about/inn-keeper">
//                   <NavItem className="tab">Inn Keeper</NavItem>
//                 </LinkContainer>
//               </Nav>
//
//
//               <Route exact path="/about/" render={ () =>
//                 <Redirect to="/about/inn" /> }
//               />
//               <Route path="/about/inn" render={ () =>
//                 <Nancy
//                   data={this.props.data[0]}
//                   admin={this.props.admin}
//                   selectEdit={this.props.selectEdit}
//                 /> }
//               />
//
//               <Route path="/about/inn-keeper" render={ () =>
//                 <Nancy
//                   data={this.props.data[1]}
//                   admin={this.props.admin}
//                   selectEdit={this.props.selectEdit}
//                 /> }
//               />
//
//           </Row>
//           </Tab.Container>
//           </div>
//       </div>
//     );
//   }
// }


export default About;
