import { useSelector } from 'react-redux';

const PhotoPopup = ({ visible, setHidden }) => {
  const selectedPhoto = useSelector((state) => state.camera.selectedPhoto);

  return (
    <div
      className={`photo-popup-container ${visible ? 'is-visible' : 'is-hidden'}`}
    >
      <img
        src={`https://live.staticflickr.com/${selectedPhoto.server}/${selectedPhoto.id}_${selectedPhoto.secret}_b.jpg`}
      />
      <div>
        <h2>{selectedPhoto.title}</h2>
        <button onClick={setHidden}>close</button>
      </div>
    </div>
  );
};

export default PhotoPopup;
