import './css/index.css';
import {
  useGetBrandsQuery,
  useLazyGetModelsQuery,
  useLazyGetPhotosQuery,
} from './api';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  clearModels,
  clearPhotos,
  setBrands,
  setModels,
  setPhotos,
  setSelectedBrands,
  setSelectedModels,
  setSelectedPhoto,
} from './store/slices/camera';
import GoogleMapReact from 'google-map-react';
import { Button, DropdownButton, Modal } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import PhotoListItem from './components/photoListItem';
import PhotoMapThumbnail from './components/photoMapThumbnail';
import PhotoModal from './components/photoPopup';
import PhotoPopup from './components/photoPopup';

const googleKey = process.env.REACT_APP_GOOGLEMAPS_API_KEY;

const App = () => {
  const dispatch = useDispatch();

  const [popupOpen, setPopupOpen] = useState(false);
  const [listOpen, setListOpen] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 3, lng: 102 });

  const defaultProps = {
    center: {
      lat: 3,
      lng: 102,
    },
    zoom: 8,
  };

  const brands = useSelector((state) => state.camera.brands, shallowEqual);
  const models = useSelector((state) => state.camera.models, shallowEqual);
  const fetchedModelBrands = useSelector(
    (state) => state.camera.fetchedModelBrands,
    shallowEqual
  );
  const photos = useSelector((state) => state.camera.photos, shallowEqual);
  const selectedBrands = useSelector(
    (state) => state.camera.selectedBrands,
    shallowEqual
  );
  const selectedModels = useSelector(
    (state) => state.camera.selectedModels,
    shallowEqual
  );
  const currentPage = useSelector(
    (state) => state.camera.currentPage,
    shallowEqual
  );
  const maxPages = useSelector((state) => state.camera.maxPages, shallowEqual);

  const { data: getBrandsData } = useGetBrandsQuery();
  const [
    triggerGetModelsQuery,
    { data: getModelsData, loading: loadingModelsData },
  ] = useLazyGetModelsQuery();
  const [
    triggerGetPhotosQuery,
    { data: getPhotosData, loading: loadingPhotosData },
  ] = useLazyGetPhotosQuery();

  useEffect(() => {
    if (getBrandsData && getBrandsData.stat === 'ok') {
      dispatch(setBrands(getBrandsData.brands.brand));
    }
  }, [getBrandsData]);

  useEffect(() => {
    if (getModelsData && getModelsData.stat === 'ok') {
      dispatch(setModels([getModelsData.cameras]));
    }
  }, [getModelsData]);

  useEffect(() => {
    selectedBrands.forEach((item) => {
      if (!fetchedModelBrands.includes(item)) {
        triggerGetModelsQuery(item);
      }
    });
  }, [fetchedModelBrands, selectedBrands]);

  useEffect(() => {
    if (getPhotosData && getPhotosData.stat === 'ok') {
      dispatch(setPhotos(getPhotosData.photos));
    }
  }, [getPhotosData]);

  useEffect(() => {
    dispatch(clearModels());
  }, [selectedBrands]);

  const handleSelectBrand = (e) => {
    if (selectedBrands.includes(e)) {
      let temp = selectedBrands.slice();
      temp.splice(temp.indexOf(e), 1);
      dispatch(setSelectedBrands(temp));
    } else dispatch(setSelectedBrands([...selectedBrands, e]));
    dispatch(setSelectedModels([]));
    dispatch(clearPhotos());
    setPopupOpen(false);
  };

  const handleSelectModel = (e) => {
    if (selectedModels.includes(e)) {
      let temp = selectedModels.slice();
      temp.splice(temp.indexOf(e), 1);
      dispatch(setSelectedModels(temp));
    } else dispatch(setSelectedModels([...selectedModels, e]));
    dispatch(clearPhotos());
    setPopupOpen(false);
  };

  const handleSearchPhotos = (page) => {
    triggerGetPhotosQuery({ model: selectedModels, page: page });
    dispatch(setSelectedPhoto(-1));
    setPopupOpen(false);
  };

  const handleChangePage = (mod) => {
    handleSearchPhotos(currentPage + mod);
  };

  const handleSelectPhoto = (index, lat, lng) => {
    dispatch(setSelectedPhoto(index));
    setMapCenter({ lat: lat, lng: lng });
    setPopupOpen(true);
  };

  return (
    <div className={'App'}>
      <div className={'app-container'}>
        <div
          className={`list-container ${
            listOpen ? 'list-container-is-visible' : 'list-container-is-hidden'
          }`}
        >
          <div className={'list-container-search'}>
            <div className={'list-container-title'}>
              <h3>flickr-map</h3>
              <Button className={'button-open-list-mobile'} onClick={() => setListOpen(false)}>{'<<'}</Button>
            </div>
            <DropdownButton
              id='dropdown-variants-primary'
              title='Select Brands'
              autoClose={'outside'}
              onSelect={(e) => handleSelectBrand(e)}
            >
              {brands?.map((item, i) => {
                return (
                  <DropdownItem
                    key={i}
                    eventKey={item.id}
                    active={selectedBrands.includes(item.id)}
                  >
                    {item.name}
                  </DropdownItem>
                );
              })}
            </DropdownButton>
            <DropdownButton
              id='dropdown-variants-primary'
              title='Select Model'
              autoClose={'outside'}
              disabled={!selectedBrands.length}
              onSelect={(e) => handleSelectModel(e)}
            >
              {!loadingModelsData ? (
                models?.map((brand, i) => {
                  return (
                    <>
                      <DropdownItem key={i} disabled>
                        {brand.brand}
                      </DropdownItem>
                      <div className='dropdown-divider'></div>
                      {brand.camera.map((item, i) => {
                        return (
                          <DropdownItem
                            key={i}
                            eventKey={`${brand.brand}/${item.id}`}
                            active={selectedModels.includes(
                              `${brand.brand}/${item.id}`
                            )}
                          >
                            {item.name._content}
                          </DropdownItem>
                        );
                      })}
                    </>
                  );
                })
              ) : (
                <DropdownItem>loading...</DropdownItem>
              )}
            </DropdownButton>
            <Button
              disabled={!selectedBrands.length || !selectedModels.length}
              onClick={() => handleSearchPhotos(1)}
            >
              Search
            </Button>
          </div>
          <div className={'list-container-photos'}>
            {!loadingPhotosData ? (
              photos.map((item, i) => {
                return (
                  <PhotoListItem
                    props={item}
                    index={i}
                    handleSelectPhoto={() =>
                      handleSelectPhoto(
                        i,
                        parseFloat(item.latitude),
                        parseFloat(item.longitude)
                      )
                    }
                  />
                );
              })
            ) : (
              <p>loading...</p>
            )}
          </div>
          <div className={'list-container-pagination'}>
            <nav aria-label='Page navigation example'>
              <ul className={'pagination'}>
                <li className={'page-item'}>
                  <button
                    className='page-link'
                    href='#'
                    tabIndex='-1'
                    disabled={currentPage === 1}
                    onClick={() => handleChangePage(-1)}
                  >
                    {'<<'}
                  </button>
                </li>
                <li className={'page-item'}>
                  <button
                    className='page-link'
                    href='#'
                    tabIndex='1'
                    disabled={currentPage >= maxPages}
                    onClick={() => handleChangePage(1)}
                  >
                    {'>>'}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div
          className={`map-container ${listOpen ? '' : 'map-container-is-full'}`}
        >
          <Button
            className={'button-open-list'}
            onClick={() => setListOpen(!listOpen)}
          >
            {listOpen ? '<<' : '>>'}
          </Button>
          <PhotoPopup
            visible={popupOpen}
            setHidden={() => setPopupOpen(false)}
          />
          <GoogleMapReact
            bootstrapURLKeys={{
              key: googleKey,
            }}
            defaultCenter={defaultProps.center}
            center={mapCenter}
            defaultZoom={defaultProps.zoom}
            yesIWantToUseGoogleMapApiInternals
          >
            {photos.map((item, i) => {
              return (
                <PhotoMapThumbnail
                  lat={item.latitude}
                  lng={item.longitude}
                  props={item}
                  handleSelectPhoto={() => handleSelectPhoto(i)}
                />
              );
            })}
          </GoogleMapReact>
        </div>
      </div>
    </div>
  );
};

export default App;
