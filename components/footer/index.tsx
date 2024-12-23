import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { SlSocialTwitter } from "react-icons/sl";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full bottom-0 flex flex-col items-center gap-5 bg-brand-text-footer py-20 text-white">
      <div className="flex gap-8 w-full justify-center">
        <FaFacebookF size={24} />
        <FaInstagram size={28} />
        <SlSocialTwitter size={28} />
      </div>
      <div className="flex flex-col items-center gap-5 px-16 pb-4 border-b-2">
        <p>44600 Pipalbot, Kalimati, Opposite of Nabil Bank</p>
        <p>+977-9842355138</p>
      </div>

      <div className="flex gap-20 items-center justify-center">
        <Link href="/about-us" className="text-3xl font-bold">
          ABOUT US
        </Link>
        <Link href="/contact-us" className="text-3xl font-bold">
          CONTACT US
        </Link>
      </div>

      <p className="text-xs mt-4">
        ©2018-2022 Shops and Malls. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
