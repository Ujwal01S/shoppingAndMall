import ContactForm from "../about-us/_form";

const ContactUsPage = () => {
  return (
    <div className="flex items-center justify-center my-14">
      <div className="flex w-[52%]  flex-col rounded-md border-[1px] gap-6 shadow-md items-center py-10 text-brand-text-primary px-20">
        <img 
        src="/contact-us.svg"
        className="w-40"
        />
        <p className="text-3xl font-semibold text-brand-text-primary">Say Hello!</p>
      
      <ContactForm />
      </div>

    </div>
  );
};

export default ContactUsPage;
