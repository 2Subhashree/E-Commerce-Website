import React from "react";
import { useState } from "react";
import Axios from "../utils/Axios";
import AllApi from "../common/commonApi";
import { Link, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import { useEffect } from "react";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);

  console.log(AllSubCategory);

  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" ");

  // const categoryId = params.category?.split("-").splice(-1)[0];
  //   const subCategoryId = params.subCategory?.split("-").splice(-1)[0];

  const getLastSegmentId = (str) => {
    if (!str) return null;
    const parts = str.split("-");
    const last = parts[parts.length - 1];
    return /^[a-f\d]{24}$/i.test(last) ? last : null; // Valid MongoDB ObjectId
  };

  const categoryId = getLastSegmentId(params.category);
  const subCategoryId = getLastSegmentId(params.subCategory);

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...AllApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
      console.log("sendig req", categoryId, subCategoryId);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId && subCategoryId) {
      fetchProductdata();
    }
  }, [params, page]);

  useEffect(() => {
    if (AllSubCategory.length > 0 && categoryId) {
      const sub = AllSubCategory.filter((s) => {
        // Check if the subcategory belongs to the current category
        return s.category.some((cat) =>
          typeof cat === "object" ? cat._id === categoryId : cat === categoryId
        );
      });
      setDisplaySubCategory(sub);
    }
  }, [params, AllSubCategory]);

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container sticky mx-auto grid grid-cols-[100px_1fr] md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr]">
        {/* sub category */}
        <div className="min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white  py-2">
          {displaySubCategory.map((s, index) => {
            let categoryName = "";
            let categoryId = "";

            const cat = s.category[0];
            if (typeof cat === "object" && cat !== null) {
              categoryName = cat.name;
              categoryId = cat._id;
            } else {
              categoryName = "category"; // fallback
              categoryId = cat; // assume it's an ID string
            }

            const link = `/${validURLConvert(
              categoryName
            )}-${categoryId}/${validURLConvert(s.name)}-${s._id}`;
            console.log(link);

            return (
              <Link
                key={s._id + "subcatlink"}
                to={link}
                className={`w-full p-2 lg:flex items-center lg:w-full lg:gap-2 border-b hover:bg-green-100 cursor-pointer ${
                  subCategoryId === s._id ? "bg-green-200" : ""
                }`}
              >
                <div className="w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded box-border p-2 ">
                  <img
                    src={s.image}
                    alt={s.name || "Subcategory"}
                    className="w-14 lg:w-12 h-full object-scale-down "
                  />
                </div>
                <p className="-mt-3 lg:mt-0 text-xs text-center lg:text-left lg:text-base">
                  {s.name}
                </p>
              </Link>
            );
          })}
        </div>

        {/* product */}
        <div className="sticky top-20">
          <div className="bg-white shadow-md p-4 z-10">
            <h3 className="font-semibold">{subCategoryName}</h3>
          </div>
          <div>
            <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  p-4 gap-4">
              {data.map((p, index) => {
                return (
                  <CardProduct
                    data={p}
                    key={p._id + "productSubCategory" + index}
                  />
                );
              })}
            </div>
            </div>
            {loading && <Loading />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
