import React from 'react';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='border-t bg-[#546E7A] text-neutral-200'>
      <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
        <p>&copy; All Rights Reserved 2025</p>

        <div className=' flex items-center gap-4 justify-center text-2xl'>
          <Link className=' hover:text-[#3b5998]'>
            <FaFacebook/>
          </Link>
          <Link className=' hover:text-[#E4405F]'> 
            <FaInstagram/>
          </Link>
          <Link className='hover:text-[#0077B5]'>
          <FaLinkedin/>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;