import React, { Component } from "react";
import { animateScroll as scroll } from "react-scroll";
import { Icon } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "antd/dist/antd.css";

class Footer extends Component {
  scrollToTop = () => {
    scroll.scrollToTop();
  };
  showCartSide = () => {
    const user = this.props.user.userData;
    if (user) {
      if (user.isAuth) {
        return (
          <div className="cart-side-container">
            <Link to="/cart" id="cart-side-plus">
              ({user.cart ? user.cart.length : 0})<Icon type="shopping-cart" />
            </Link>
          </div>
        );
      }
    }
  };

  render() {
    return (
      <div className="footer">
        {this.showCartSide()}
        <div className="scroll-to-top-container">
          <button onClick={this.scrollToTop} id="btn-to-top">
            <Icon type="up" />
          </button>
        </div>
        <div className="container">
          <div className="footer-grids">
            <div
              className="col-md-3 footer-grid animated wow slideInLeft"
              data-wow-delay=".5s"
            >
              <h3>Giới thiệu</h3>
              <p>
                LoveHouse Store chuyên cung cấp các sản phẩm đồ gia dụng nhà bếp
                giá rẻ, chất lượng.
                <span>
                  Chăm sóc khách hàng tận tình, tận tâm.
                  Bảo hành trọn đời cho mọi sản phẩm.
                </span>
              </p>
            </div>
            <div
              className="col-md-3 footer-grid animated wow slideInLeft"
              data-wow-delay=".6s"
            >
              <h3>Thông tin liên hệ</h3>
              <ul>
                <li>
                  <i
                    className="glyphicon glyphicon-map-marker"
                    aria-hidden="true"
                  />
                  Đại học BKHN
                </li>
                <li>
                  <i
                    className="glyphicon glyphicon-envelope"
                    aria-hidden="true"
                  />
                  <a href="mailto:lelam7c10tp@gmail.com">
                    lelam7c10tp@gmail.com
                  </a>
                </li>
                <li>
                  <i
                    className="glyphicon glyphicon-earphone"
                    aria-hidden="true"
                  />
                  07943206191
                </li>
              </ul>
            </div>
            
            <div
              className="col-md-3 footer-grid animated wow slideInLeft"
              data-wow-delay=".6s"
            >
              <h3>Hướng dẫn - chính sách</h3>
              <ul>
                <li>Hướng dẫn mua hàng</li>
                <li>Chính sách đổi trả</li>
                <li>Chính sách bảo hành</li>
                <li>Chính sách thanh toán</li>
              </ul>
            </div>
            
            <div className="clearfix"></div>
          </div>
          <div
            className="footer-logo animated wow slideInUp"
            data-wow-delay=".5s"
          >
            <h2>
              <a href="/">  
              </a>
            </h2>
          </div>
          <div
            className="copy-right animated wow slideInUp"
            data-wow-delay=".5s"
          >
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(Footer);
