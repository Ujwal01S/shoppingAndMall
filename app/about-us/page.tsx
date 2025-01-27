import Image from "next/image";

const AboutUsPage = () => {
  return (
    <div className="flex items-center justify-center my-14">
      <div className="flex relative tablet-lg:w-[52%] flex-col rounded-md bg-customGradient tablet-lg:mr-56 gap-20 text-center py-10 text-brand-text-primary px-20">
        <p className="text-3xl font-bold">Who we are</p>

        <div className="tablet-sm:w-[72%] desktop-md:w-[58%] text-wrap text-start flex flex-col gap-8">
          <p>
            We are a group of creative people, regular shoppers and developers
            who love to help others.
          </p>

          <p>
            We all love shopping now and then but finding the right Shops for
            the quality product can be haunting sometimes. Especially in this
            modern world where we have lots of Malls for an option.
          </p>

          <p>
            We created this website in the hope to help people easily find their
            perfect shops and malls just with their mobile phone without really
            going to visit the malls for finding the one shop you need.
          </p>
        </div>
        <Image
          src="/about-us.svg"
          className="hidden tablet-lg:flex absolute tablet-lg:w-[300px] desktop-md:w-[350px] -right-20 top-[20%]"
          alt="about"
          width={400}
          height={400}
        />
        <p className="text-xl mobile-lg:text-2xl tablet-lg:text-3xl font-bold z-20">
          Our mission is to build software that makes shopping easier
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
