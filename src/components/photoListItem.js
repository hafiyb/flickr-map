const PhotoListItem = ({props}) => {
  console.log(props)
  return (
    <div class={'photo-list-item-container'}>
      <img src={`https://live.staticflickr.com/${props.server}/${props.id}_${props.secret}_t.jpg`}/>
    </div>
  );
};

export default PhotoListItem;
