import React, { Component } from "react";

export class ContactUs extends Component {
  render() {
    return (
      <div>
        {/* breadcrumbs */}
        <div className="breadcrumbs">
          <div className="container">
            <ol
              className="breadcrumb breadcrumb1 animated wow slideInLeft"
              data-wow-delay=".5s"
            >
              <li>
                <a href="index.html">
                  <span
                    className="glyphicon glyphicon-home"
                    aria-hidden="true"
                  />
                  Trang chủ
                </a>
              </li>
              <li className="active">Liên hệ</li>
            </ol>
          </div>
        </div>
        {/* //breadcrumbs */}
        {/* mail */}
        <div className="mail animated wow zoomIn" data-wow-delay=".5s">
          <div className="container">
            <h3>Inbox qua Email</h3>
            <div className="mail-grids">
              <div
                className="col-md-8 mail-grid-left animated wow slideInLeft"

              >
                <form>
                  <input type="text" placeholder="Tên" required />
                  <input type="email" placeholder="Email" required />
                  <input type="text" defaultValue="Chủ đề" required />
                  <textarea type="text" required defaultValue={"Lời nhắn..."} />
                  <input type="submit" defaultValue="Gửi" />
                </form>
              </div>
              
              <div className="clearfix"> </div>
            </div>
           
          </div>
        </div>
        {/* //mail */}
      </div>
    );
  }
}

export default ContactUs;
