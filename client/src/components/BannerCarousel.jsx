import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const BannerCarousel = ({ bannerImagesDesktop, bannerImagesMobile }) => {
  return (
    <>
      {/* Desktop Carousel */}
      <div className="hidden lg:block relative">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={4000}
          transitionTime={800}
          stopOnHover
          swipeable
          emulateTouch
          showIndicators={true}
          renderIndicator={(onClickHandler, isSelected, index) => (
            <li
              key={index}
              onClick={onClickHandler}
              className={`w-3 h-3 rounded-full cursor-pointer mx-1 ${
                isSelected ? "bg-white" : "bg-white/50"
              }`}
            />
          )}
        >
          {bannerImagesDesktop.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt={`Banner ${index}`}
                className="h-[550px] w-full object-cover rounded-xl shadow-lg transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl" />
              {/* Text content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                <h2 className="text-4xl font-extrabold drop-shadow-lg animate-fadeInUp">
                  Welcome to <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">Our Store</span>
                </h2>
                <p className="mt-3 text-lg max-w-2xl animate-fadeInUp delay-200">
                  Discover the best deals with stunning offers every day.
                </p>
                <button className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-red-500 hover:to-pink-500 transition duration-300 text-white font-semibold shadow-lg animate-fadeInUp delay-300">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Mobile Carousel */}
      <div className="lg:hidden relative">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={4000}
          transitionTime={800}
          stopOnHover
          swipeable
          emulateTouch
          showIndicators={false}
        >
          {bannerImagesMobile.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt={`Mobile Banner ${index}`}
                className="h-64 w-full object-cover rounded-lg shadow-md transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg" />
              {/* Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="text-xl font-bold drop-shadow-md animate-fadeInUp">
                  Amazing Offers
                </h2>
                <p className="mt-2 text-sm animate-fadeInUp delay-200">
                  Shop now and enjoy discounts.
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default BannerCarousel;
