const PhotoMapThumbnail = ({ props, handleSelectPhoto }) => {
  return (
    <div class={'photo-map-thumbnail-container'} onClick={handleSelectPhoto}>
      <img
        src={`https://live.staticflickr.com/${props.server}/${props.id}_${props.secret}_t.jpg`}
      />
    </div>
  );
};

export default PhotoMapThumbnail;
