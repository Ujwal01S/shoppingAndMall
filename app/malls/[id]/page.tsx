const MallDetailPage = () => {
  return (
    <div className=" flex flex-col items-center">
      <img
        src="/blue-bird.jpg"
        className="w-full h-[600px] bg-center bg-cover bg-no-repeat"
      />

      <div className="w-[70%] mt-10 leading-10 border-b border-brand-text-primary">
        <p className="text-4xl text-brand-text-primary font-bold">
          Blue Bird Mall
        </p>
        <p className="text-brand-text-primary leading-10 font-bold text-lg">
          Thamel Marg, Kathmandu 44600
        </p>
        <p>08:00 - 18:00, +977-0012299527</p>
      </div>

      <div className="w-[70%] leading-10 mt-8">
        <p className="text-lg text-brand-text-primary font-bold">Shops</p>
        <p>No shops added</p>
      </div>
    </div>
  );
};

export default MallDetailPage;
