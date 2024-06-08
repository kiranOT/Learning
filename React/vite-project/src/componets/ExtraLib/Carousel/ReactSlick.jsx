import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "./../../../assets/pexels-03.jpg";

function Responsive() {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img src={Image} alt="" />
        </div>
        <div>
          <img src={Image} alt="" />
        </div>
        <div>
          <img src={Image} alt="" />
        </div>
        <div>
          <img src={Image} alt="" />
        </div>
        <div>
          <img src={Image} alt="" />
        </div>
        <div>
          <img src={Image} alt="" />
        </div>
        <div>
          <img src={Image} alt="" />
        </div>
        <div>
          <img src={Image} alt="" />
        </div>
      </Slider>
    </div>
  );
}

export default Responsive;
