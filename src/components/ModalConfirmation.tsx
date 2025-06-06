import { BiX } from "react-icons/bi";
import { FaSpotify } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

const ModalConfirmation = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 flex-col">
        <BiX size={40} className="top-6 text-white left-6 cursor-pointer z-51 fixed" onClick={onClose}/>
      <div onClick={onConfirm} className="fixed inset-0 bg-black opacity-50 mb-8"></div>
      <div className="bg-neutral-800/70 text-white py-6 p-4 rounded-lg shadow-md flex flex-col z-51">
        <img className="w-56 h-56 rounded-md bg-white" src="" alt="" />
        <h2 className="my-2 font-semibold  w-8/12 line-clamp-2">Noe da muscia COnfrimrado</h2>
        <h3 className="text-sm text-neutral-300 font-semibold  w-7/12 line-clamp-2">Nome do Artist</h3>
        <span className="flex items-center gap-2 mt-5">
            <FaSpotify/> Spotify
        </span>
      </div>
    </div>
  );
};


export default ModalConfirmation