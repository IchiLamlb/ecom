import React, { Component } from "react";
import Slider from "./slider";
import Promotion from "./promotion";
import BestSelling from "./bestSelling";
import { productsByArrival, productsBySell } from "../../actions/products";
import { addToCart, getCart } from "../../actions/user_actions";
import { connect } from "react-redux";
import { message } from "antd";
import ByArrival from "./byArrival";
const promotion = {
  img: "/images/banner7.jpg",
  lineOne: "Khuyến mãi khủng lên tới 45%",
  lineTwo: "Cho các sản phẩm",
  linkTo: "/shop",
  title: "Shop Now"
};
class Home extends Component {
  componentDidMount() {
    let cartItems = [];
    let user = this.props.user;
    console.log(this.props.user);

    this.props.productsBySell();
    this.props.productsByArrival();
    if (user.userData.cart) {
      if (user.userData.cart.length > 0) {
        user.userData.cart.forEach(item => {
          cartItems.push(item.id);
        });
        this.props.dispatch(getCart(cartItems, user.userData.cart));
      }
    }
  }

  addToCart0 = id => {
    const { user } = this.props;
    if (user.userData.isAuth) {
      this.props.dispatch(addToCart(id));
      message.success("Mặt hàng được thêm vào giỏ hàng!");
    } else {
      message.error("Bạn cần phải đăng nhập trước!");
    }
  };
  addToCart = id => {
    const { user } = this.props;
    if (user.cartDetail) {
      user.cartDetail.forEach(item => {
        if (item._id === id) {
          if (item.quantityCart < item.quantity) {
            this.addToCart0(id);
          } else {
            message.success("Số lượng không đủ!");
          }
        }
      });
      if (
        user.cartDetail
          .map(item => {
            return item._id;
          })
          .indexOf(id) === -1
      ) {
        this.addToCart0(id);
      }
    } else {
      this.addToCart0(id);
    }
   
  };
  renderPromotion = () =>
    promotion ? (
      <div
        className="home_promotion_img"
        style={{
          background: `url(${promotion.img})`
        }}
      >
        <div className="tag title">{promotion.lineOne}</div>
        <div className="tag low_title">{promotion.lineTwo}</div>
      </div>
    ) : null;

  render() {
    const { productsBySell, productsByArrival } = this.props.products;
    return (
      <div>
        <Slider />
        
        <BestSelling
          bySell={productsBySell}
          addToCart0={this.addToCart0}
          addToCart={this.addToCart}
        />
        <div className="home_promotion">{this.renderPromotion()}</div>
        <ByArrival
          byArrival={productsByArrival}
          addToCart0={this.addToCart0}
          addToCart={this.addToCart}
        />
        {/* <Promotion /> */}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    products: state.products
  };
};
export default connect(
  mapStateToProps,
  { productsBySell, productsByArrival}
)(Home);
