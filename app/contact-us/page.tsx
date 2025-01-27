import Image from "next/image";
import ContactForm from "../about-us/_form";

const ContactUsPage = () => {
  return (
    <div className="flex items-center justify-center my-14 mt-28">
      <div className="flex w-full tablet-sm:w-[70%] desktop-md:w-[52%]  flex-col rounded-md border-[1px] gap-6 shadow-md items-center py-10 text-brand-text-primary px-10 tablet-sm:px-10 tablet-lg:px-20">
        <Image
          src="/contact-us.svg"
          className="w-40"
          alt="contact-us"
          width={40}
          height={40}
        />
        <p className="text-3xl font-semibold text-brand-text-primary">
          Say Hello!
        </p>

        <ContactForm />
      </div>
    </div>
  );
};

export default ContactUsPage;
