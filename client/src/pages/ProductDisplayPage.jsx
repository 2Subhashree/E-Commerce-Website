import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import image1 from "../assets/minute_delivery.png";
import image2 from "../assets/Best_Prices_Offers.png";
import image3 from "../assets/Wide_Assortment.png";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplayPage = () => {
  const params = useParams();
  let productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
    variantsByColor: {},
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...AllApi.getProductDetails,
        data: { productId },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);

        // ✅ Auto-select first color & size
        if (
          responseData.data.variantsByColor &&
          Object.keys(responseData.data.variantsByColor).length > 0
        ) {
          const firstColor = Object.keys(responseData.data.variantsByColor)[0];
          setSelectedColor(firstColor);
          if (responseData.data.variantsByColor[firstColor].length > 0) {
            setSelectedSize(responseData.data.variantsByColor[firstColor][0].size);
          }
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  // ✅ Get selected variant
  const getCurrentVariant = () => {
    if (!selectedColor || !selectedSize || !data.variantsByColor[selectedColor])
      return null;

    return data.variantsByColor[selectedColor].find(
      (variant) => variant.size === selectedSize
    );
  };

  // ✅ Price calculation
  const getPriceInfo = () => {
    const variant = getCurrentVariant();
    if (variant) {
      return {
        price: variant.price,
        discount: variant.discount || 0,
        finalPrice: priceWithDiscount(variant.price, variant.discount || 0),
      };
    }
    return {
      price: data.price || 0,
      discount: data.discount || 0,
      finalPrice: priceWithDiscount(data.price || 0, data.discount || 0),
    };
  };

  const priceInfo = getPriceInfo();

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2 gap-6">
      {/* ✅ Left Section (Images) */}
      <div>
        <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
          <img
            src={data.image[image]}
            className="w-full h-full object-scale-down"
            alt={data.name}
          />
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 my-2">
          {data.image.map((img, index) => (
            <div
              key={img + index + "dot"}
              className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                index === image ? "bg-slate-400" : "bg-slate-200"
              }`}
            ></div>
          ))}
        </div>

        {/* Thumbnails */}
        <div className="grid relative">
          <div
            ref={imageContainer}
            className="flex relative z-10 gap-4 w-full overflow-x-auto scrollbar-none"
          >
            {data.image.map((img, index) => (
              <div
                className="w-20 h-20 cursor-pointer shadow-md"
                key={img + index}
              >
                <img
                  src={img}
                  alt="thumb"
                  onClick={() => setImage(index)}
                  className="w-full h-full object-scale-down"
                />
              </div>
            ))}
          </div>
          <div className="w-full h-full -ml-3 flex justify-between absolute items-center">
            <button
              onClick={handleScrollLeft}
              className="bg-white p-1 rounded-full shadow-lg"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={handleScrollRight}
              className="bg-white p-1 rounded-full shadow-lg"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* Description (Desktop) */}
        <div className="my-4 hidden lg:grid gap-3">
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{data.description}</p>
          </div>

          {data?.more_details &&
            Object.keys(data.more_details).map((key, index) => (
              <div key={index}>
                <p className="font-semibold">{key}</p>
                <p className="text-base">{data.more_details[key]}</p>
              </div>
            ))}
        </div>
      </div>

      {/* ✅ Right Section (Details) */}
      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
        <Divider />

        {/* Color Selection */}
        {data.variantsByColor &&
          Object.keys(data.variantsByColor).length > 0 && (
            <div className="mb-4">
              <p className="font-semibold">Color</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.keys(data.variantsByColor).map((color) => (
                  <button
                    key={color}
                    className={`px-3 py-1 rounded-full border ${
                      selectedColor === color
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-100 border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize(
                        data.variantsByColor[color][0]?.size || null
                      );
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Size Selection */}
        {selectedColor && data.variantsByColor[selectedColor] && (
          <div className="mb-4">
            <p className="font-semibold">Size</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.variantsByColor[selectedColor].map((variant) => (
                <button
                  key={variant.size}
                  className={`px-3 py-1 rounded-full border ${
                    selectedSize === variant.size
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                  onClick={() => setSelectedSize(variant.size)}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <p className="font-semibold">Price</p>
          <div className="flex items-center gap-2 lg:gap-4 mt-2">
            <div className="border border-green-700 px-4 py-2 rounded bg-green-50 w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {DisplayPriceInRupees(priceInfo.finalPrice)}
              </p>
            </div>
            {priceInfo.discount > 0 && (
              <p className="line-through">{DisplayPriceInRupees(priceInfo.price)}</p>
            )}
            {priceInfo.discount > 0 && (
              <p className="font-bold text-green-600 lg:text-2xl">
                {priceInfo.discount}%{" "}
                <span className="text-base text-neutral-500">Discount</span>
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart */}
        <div className="my-4">
          <AddToCartButton
            data={{
              ...data,
              selectedColor,
              selectedSize,
              price: priceInfo.price,
              discount: priceInfo.discount,
              finalPrice: priceInfo.finalPrice,
            }}
          />
        </div>

        {/* ✅ Removed table & stock */}

        <h2 className="font-semibold">Why shop from subhnum?</h2>
        <div>
          <div className="flex items-center gap-4 my-4">
            <img src={image1} alt="superfast delivery" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Superfast Delivery</div>
              <p>
                Get your order delivered to your doorstep at the earliest from
                dark stores near you.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 my-4">
            <img src={image2} alt="Best prices offers" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Best Prices & Offers</div>
              <p>
                Best price designation with offers directly from the manufacturers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 my-4">
            <img src={image3} alt="Wise Assortment" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Wide Assortment</div>
              <p>
                Choose from 5000+ products across food, personal care, household &
                other categories.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Description */}
        <div className="my-4 grid gap-3 lg:hidden">
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{data.description}</p>
          </div>
          {data?.more_details &&
            Object.keys(data.more_details).map((key, index) => (
              <div key={index}>
                <p className="font-semibold">{key}</p>
                <p className="text-base">{data.more_details[key]}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
