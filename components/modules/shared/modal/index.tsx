type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
};

const Modal = ({ children, onClose, open }: ModalProps) => {
  return (
    <div
      onClick={onClose}
      className={`absolute w-[100dvw] h-[100dvh] z-50 inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/30" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-6 transition-all w-[50%] ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-1 rounded-r-lg text-gray-500 bg-white hover:bg-gray-300"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
