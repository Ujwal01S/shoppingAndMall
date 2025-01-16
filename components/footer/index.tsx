import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { SlSocialTwitter } from "react-icons/sl";
import Link from "next/link";

const Footer = () => {
  const socialLinks = [
    { Icon: FaFacebookF, size: 24 },
    { Icon: FaInstagram, size: 28 },
    { Icon: SlSocialTwitter, size: 28 },
  ];
  return (
    <div className="w-full relative bottom-0  bg-brand-text-footer">
      <div className="container flex flex-col items-center gap-5  py-20 text-white">
        <div className="flex gap-8 w-full justify-center">
          {socialLinks.map(({ Icon, size }, index) => (
            <Icon
              size={size}
              key={index}
              className="cursor-pointer hover:opacity-80"
            />
          ))}
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
    </div>
  );
};

export default Footer;
