import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/user_actions";
// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal
} from "reactstrap";
import { message } from "antd";

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent"
    };
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white"
      });
    } else {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent"
      });
    } else {
      this.setState({
        color: "bg-white"
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch
    });
  };
  onLogout = () => {
    this.props.dispatch(logout());
    message.success("Log Out Successfully");
    this.props.history.push("/login");
  };
  render() {
    return (
      <>
        <Navbar
          className={classNames("navbar-absolute", this.state.color)}
          expand="lg"
        >
          <Container fluid>
            <div className="navbar-wrapper">
              <div
                className={classNames("navbar-toggle d-inline", {
                  toggled: this.props.sidebarOpened
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
                {this.props.brandText}
              </NavbarBrand>
            </div>
            <button
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navigation"
              data-toggle="collapse"
              id="navigation"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </button>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                <InputGroup className="search-bar">
                  <Button
                    color="link"
                    data-target="#searchModal"
                    data-toggle="modal"
                    id="search-button"
                    onClick={this.toggleModalSearch}
                  >
                    {/*<i className="tim-icons icon-zoom-split" />
                    <span className="d-lg-none d-md-block">Tìm kiếm</span>*/}
                  </Button>
                </InputGroup>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                  >
                    <div className="notification d-none d-lg-block d-xl-block" />
                    <i className="tim-icons icon-sound-wave" />
                    <p className="d-lg-none">Thông báo</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Bạn có đơn hàng mới
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Bạn đã xác nhận đơn hàng
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Bạn đã hủy đơn hàng
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={e => e.preventDefault()}
                  >
                    <div className="photo">
                      <img alt="..." src={require("assets/img/anime3.png")} />
                    </div>
                    <b className="caret d-none d-lg-block d-xl-block" />
                    <p className="d-lg-none">Đăng xuất</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">Tôi</DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">Cài đặt</DropdownItem>
                    </NavLink>
                    <DropdownItem divider tag="li" />
                    <NavLink tag="li">
                      <DropdownItem
                        className="nav-item"
                        onClick={this.onLogout}
                      >
                        Đăng xuất
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={this.toggleModalSearch}
        >
          <div className="modal-header">
            <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.toggleModalSearch}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user
  };
};
export default connect(mapStateToProps)(withRouter(AdminNavbar));
