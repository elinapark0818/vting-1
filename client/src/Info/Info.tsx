import React, { useEffect } from "react";
import "./Info.scss";
import Logo from "../assets/vt_logo_2.png";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

function Info() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  });

  return (
    <div className="info_container">
      <div className="info_wrap">
        <div
          className="info_item"
          data-aos="fade-up"
          data-aos-easing="ease-out-cubic"
        >
          <img className="info_img" src={Logo} alt="logo" />
          <div className="info_desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
            cupiditate adipisci impedit culpa, sequi vitae sunt aliquid a odio
            beatae harum hic autem consectetur temporibus reiciendis. Tempora
            quaerat amet nam.
          </div>
        </div>

        <div
          className="info_item"
          data-aos="fade-right"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="2000"
        >
          <img className="info_img" src={Logo} alt="logo" />
          <div className="info_desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
            cupiditate adipisci impedit culpa, sequi vitae sunt aliquid a odio
            beatae harum hic autem consectetur temporibus reiciendis. Tempora
            quaerat amet nam.
          </div>
        </div>

        <div
          className="info_item"
          data-aos="fade-right"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="2000"
        >
          <img className="info_img" src={Logo} alt="logo" />
          <div className="info_desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
            cupiditate adipisci impedit culpa, sequi vitae sunt aliquid a odio
            beatae harum hic autem consectetur temporibus reiciendis. Tempora
            quaerat amet nam.
          </div>
        </div>

        <div
          className="info_item"
          data-aos="fade-right"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="2000"
        >
          <img className="info_img" src={Logo} alt="logo" />
          <div className="info_desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
            cupiditate adipisci impedit culpa, sequi vitae sunt aliquid a odio
            beatae harum hic autem consectetur temporibus reiciendis. Tempora
            quaerat amet nam.
          </div>
        </div>

        <div
          className="info_item"
          data-aos="fade-right"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="2000"
        >
          <img className="info_img" src={Logo} alt="logo" />
          <div className="info_desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
            cupiditate adipisci impedit culpa, sequi vitae sunt aliquid a odio
            beatae harum hic autem consectetur temporibus reiciendis. Tempora
            quaerat amet nam.
          </div>
        </div>

        <div onClick={() => navigate("/new")} className="dashboard_btnWrap">
          <button className="dashboard_plusBtn">
            나만의 V-ting 만들러 가기!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Info;
