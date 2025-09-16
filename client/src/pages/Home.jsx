import React from "react";
import banner from "../assets/banner.png";
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.png";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert";
import { useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import BannerCarousel from "../components/BannerCarousel";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListPage = (id, cat) => {
    console.log(id, cat);

    const subcategory = subCategoryData.find(
      (sub) => sub.category.includes(id) // ✅ Here is the main correction
    );

    if (subcategory) {
      const url = `/${validURLConvert(cat)}-${id}/${validURLConvert(
        subcategory.name
      )}-${subcategory._id}`;
      navigate(url);
      console.log("Redirect URL:", url);
    } else {
      console.log("No matching subcategory found!");
    }
  };

  return (
    <section className="bg-white">
      <div className=" container mx-auto">
        <div
          className={`w-full h-full min-h-48 bg-slate-300 rounded overflow-hidden ${
            !banner && "animate-pulse my-2 mx-1"
          } `}
        >
          {/* <img
            src={banner}
            className="w-full h-[500px] hidden lg:block p-2"
            alt="banner"
          />
          <img
            src={bannerMobile}
            className="w-full h-full lg:hidden "
            alt="banner"
          /> */}
          <BannerCarousel
            bannerImagesDesktop={[banner4,banner1, banner2, banner3]}
            bannerImagesMobile={[banner, bannerMobile]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
        {loadingCategory
          ? new Array(12).fill(null).map((c, index) => {
              return (
                <div
                  key={index + "loadingcategory"}
                  className="bg-white rounded p-4 h-48 grid gap-2 shadow animate-pulse"
                >
                  <div className="bg-blue-100 h-32 rounded"></div>
                  <div className="bg-blue-100 h-6 rounded"></div>
                </div>
              );
            })
          : categoryData.map((cat, index) => {
              return (
                <div
                  key={cat._id + "displaycategory"}
                  onClick={() =>
                    handleRedirectProductListPage(cat._id, cat.name)
                  }
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-40 object-scale-down transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <p className="text-center py-2 font-medium text-gray-700 group-hover:text-pink-600 transition-colors duration-300">
                      {cat.name}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* display category product */}
      {categoryData.map((c, index) => {
        return (
          <CategoryWiseProductDisplay
            key={c?._id + "CategorywiseProduct"}
            id={c?._id}
            name={c?.name}
          />
        );
      })}
    </section>
  );
};

export default Home;
