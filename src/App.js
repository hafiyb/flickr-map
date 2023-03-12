import './css/index.css';
import {
  useGetBrandsQuery,
  useLazyGetModelsQuery,
  useLazyGetPhotosQuery,
} from './api';
import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setBrands, setSelectedBrands } from './store/slices/camera';
import GoogleMapReact from 'google-map-react';
import { Button, DropdownButton } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

const App = () => {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.camera.brands, shallowEqual);
  const selectedBrands = useSelector(
    (state) => state.camera.selectedBrands,
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
    console.log(getModelsData);
  }, [getModelsData]);

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
  };

  const handleSearchModel = (e) => {
    if (!e) {
      console.log(selectedBrands);
      selectedBrands.forEach((item) => {
        triggerGetModelsQuery(item);
      });
    }
  };

  const handleAddToModels = (e) => {
    if (selectedBrands.include(e)) {
    }
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
              onSelect={(e) => handleSelectBrand(e)}
              onToggle={(e) => handleSearchModel(e)}
            ></DropdownButton>
            <Button>Search</Button>
          </div>
        </div>
        <div class={'map-container'}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: 'AIzaSyBY_2C0McheyhtxI5rZI-c8eH1ea_XIc1w',
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
