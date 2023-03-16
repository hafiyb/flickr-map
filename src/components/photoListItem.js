import { useSelector } from "react-redux";

const PhotoListItem = ({ props,index, handleSelectPhoto}) => {
  const selectedPhotoIndex = useSelector(state => state.camera.selectedPhoto.index)
  return (
    <div class={`photo-list-item-container ${selectedPhotoIndex === index ? 'photo-list-item-selected' : ''}`} onClick={handleSelectPhoto}>
      <img
        src={`https://live.staticflickr.com/${props.server}/${props.id}_${props.secret}_t.jpg`}
      />
      <div class={'photo-list-item-details'}>
        <p>{props.ownername}</p>
        <p>{props.datetaken}</p>
        <p>
          {props.latitude}, {props.longitude}
        </p>
      </div>
    </div>
  );
};

export default PhotoListItem;
