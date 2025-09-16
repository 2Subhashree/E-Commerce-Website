import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const params = useLocation()
  const searchText = params.search.slice(3)

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  const handleOnChange= (e) => {
    const value = e.target.value
    const url = `/search?q=${value}`
    navigate(url)
  }

  

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border border-gray-300 overflow-hidden flex items-center text-neutral-500 bg-slate-50 group  focus-within:border-amber-200">
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to={"/"}
            className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-amber-300 bg-white rounded-full shadow-md"
          >
            <FaArrowLeft size={23} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:text-amber-200">
            <IoSearchOutline size={23} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          //not in search page
          <div
            onClick={redirectToSearchPage}
            className="bg-transparent w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Search "milk"',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "panner"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "chips"',
                1000,
                'Search "eggs"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          //when i was search page
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search for atta dal and more"
              autoFocus={true}
              defaultValue={searchText}
              className="bg-transparent w-full h-full outline-none"
              onChange={handleOnChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
