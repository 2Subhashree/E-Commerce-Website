import React, { useState, useMemo } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { validURLConvert } from "../utils/validURLConvert";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`;

  // 🔹 Flatten backend variants { unit → colors → details } into array
  const flattenedVariants = useMemo(() => {
    const result = [];
    if (data?.variants) {
      Object.entries(data.variants).forEach(([unit, unitData]) => {
        Object.entries(unitData.colors || {}).forEach(([color, details]) => {
          result.push({
            unit,
            color,
            ...details,
          });
        });
      });
    }
    return result;
  }, [data]);

  // 🔹 Extract all unique colors
  const colors = [...new Set(flattenedVariants.map((v) => v.color))];

  // ✅ Default selected color = first one
  const [selectedColor, setSelectedColor] = useState(colors[0] || null);

  // 🔹 Filter variants for selected color
  const availableUnits = flattenedVariants.filter(
    (v) => v.color === selectedColor
  );

  // ✅ Default selected variant = first size of that color
  const [selectedVariant, setSelectedVariant] = useState(
    availableUnits[0] || null
  );

  // Update selectedVariant when color changes
  React.useEffect(() => {
    if (availableUnits.length > 0) {
      setSelectedVariant(availableUnits[0]);
    }
  }, [selectedColor, data]);

  if (!selectedVariant) return null;

  const discountedPrice = priceWithDiscount(
    selectedVariant.price,
    selectedVariant.discount
  );

  return (
    <Link
      to={url}
      className="w-[220px] h-auto border border-gray-300 lg:p-4 py-2 grid gap-2 lg:gap-3 min-w-40 lg:min-w-56 rounded mx-auto cursor-pointer bg-white"
    >
      {/* --- Image --- */}
      <div className="h-[140px] w-full rounded overflow-hidden flex items-center justify-center group">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </div>

      {/* --- Name --- */}
      <div className="px-2 lg:px-0 font-medium text-eclipse text-sm lg:text-base line-clamp-2">
        {data.name}
      </div>

      {/* --- Color Buttons --- */}
      <div className="flex flex-wrap gap-2 px-2 lg:px-0">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              setSelectedColor(color);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
              selectedColor === color
                ? "bg-amber-300 border-amber-400"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {color}
          </button>
        ))}
      </div>

      {/* --- Size / Unit Buttons --- */}
      <div className="flex flex-wrap gap-2 px-2 lg:px-0 mt-1">
        {availableUnits.map((variant, index) => {
          const isSelected =
            selectedVariant.unit === variant.unit &&
            selectedVariant.color === variant.color;

          return (
            <button
              key={index}
              disabled={variant.stock === 0}
              onClick={(e) => {
                e.preventDefault();
                setSelectedVariant(variant);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                isSelected
                  ? "bg-amber-300 border-amber-400"
                  : "bg-gray-100 border-gray-300 hover:bg-gray-200"
              } ${variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {variant.unit}
            </button>
          );
        })}
      </div>

      {/* --- Price --- */}
      <div className="px-2 lg:px-0 flex items-center gap-2 text-sm lg:text-base">
        <span className="font-semibold text-gray-900">
          {DisplayPriceInRupees(discountedPrice)}
        </span>
        {selectedVariant.discount > 0 && (
          <span className="line-through text-gray-400 text-xs">
            {DisplayPriceInRupees(selectedVariant.price)}
          </span>
        )}
        {selectedVariant.discount > 0 && (
          <span className="text-green-600 text-xs font-semibold">
            {selectedVariant.discount}% OFF
          </span>
        )}
      </div>

      {/* --- Stock + Add to Cart --- */}
      <div className="px-2 lg:px-0 mt-2">
        {selectedVariant.stock === 0 ? (
          <p className="text-red-400 text-sm text-center">Out of stock</p>
        ) : (
          <AddToCartButton data={{ ...data, selectedVariant }} />
        )}
      </div>
    </Link>
  );
};

export default CardProduct;
