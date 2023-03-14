import './css/index.css';
import {
  useGetBrandsQuery,
  useLazyGetModelsQuery,
  useLazyGetPhotosQuery,
} from './api';
import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  setBrands,
  setModels,
  setPhotos,
  setSelectedBrands,
  setSelectedModels,
} from './store/slices/camera';
import GoogleMapReact from 'google-map-react';
import { Button, DropdownButton } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

const googleKey = process.env.REACT_APP_GOOGLEMAPS_API_KEY;

const App = () => {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.camera.brands, shallowEqual);
  const models = useSelector((state) => state.camera.models, shallowEqual);
  const photos = useSelector((state) => state.camera.photos, shallowEqual);
  const selectedBrands = useSelector(
    (state) => state.camera.selectedBrands,
    shallowEqual
  );
  const selectedModels = useSelector(
    (state) => state.camera.selectedModels,
    shallowEqual
  );

  const { data: getBrandsData, error, isLoading } = useGetBrandsQuery();
  const [triggerGetModelsQuery, { data: getModelsData }] =
    useLazyGetModelsQuery();
  const [triggerGetPhotosQuery, { data: getPhotosData }] =
    useLazyGetPhotosQuery();

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
    if (getPhotosData && getPhotosData.stat === 'ok') {
      dispatch(setPhotos([getPhotosData.photos.photo]));
    }
  }, [getPhotosData]);

  useEffect(() => {
    console.log(photos);
  }, [photos]);

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  const handleSelectBrand = (e) => {
    if (selectedBrands.includes(e)) {
      let temp = selectedBrands.slice();
      temp.splice(temp.indexOf(e), 1);
      dispatch(setSelectedBrands(temp));
    } else dispatch(setSelectedBrands([...selectedBrands, e]));
    dispatch(setSelectedModels([]));
  };

  const handleSelectModel = (e) => {
    if (selectedModels.includes(e)) {
      let temp = selectedModels.slice();
      temp.splice(temp.indexOf(e), 1);
      dispatch(setSelectedModels(temp));
    } else dispatch(setSelectedModels([...selectedModels, e]));
  };

  const handleSearchModel = (e) => {
    if (!e) {
      selectedBrands.forEach((item) => {
        triggerGetModelsQuery(item);
      });
    }
  };

  const handleSearchPhotos = (e) => {
    triggerGetPhotosQuery(e)
  };

  return (
    <div class={'App'}>
      <div class={'container'}>
        <div class={'list-container'}>
          <div class={'list-container-search'}>
            <h3>flickr-map</h3>
            <DropdownButton
              id='dropdown-variants-primary'
              title='Select Brands'
              autoClose={false}
              onSelect={(e) => handleSelectBrand(e)}
              onToggle={(e) => handleSearchModel(e)}
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
              autoClose={false}
              disabled={!selectedBrands.length}
              onSelect={(e) => handleSelectModel(e)}
              onToggle={(e) => handleSearchModel(e)}
            >
              {models?.map((brand, i) => {
                return (
                  <>
                    <DropdownItem key={i} disabled>
                      {brand.brand}
                    </DropdownItem>
                    <div class='dropdown-divider'></div>
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
              })}
            </DropdownButton>
            <Button
              disabled={!selectedBrands.length || !selectedModels.length}
              onClick={() => handleSearchPhotos(selectedModels)}
            >
              Search
            </Button>
          </div>
          <div class={'list-container-photos'}>
              <h1>test</h1>
          </div>
        </div>
        <div class={'map-container'}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: googleKey,
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
