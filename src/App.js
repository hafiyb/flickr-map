import logo from './logo.svg';
import './App.scss';
import { useGetBrandsQuery, useLazyGetModelsQuery } from './api';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBrands } from './store/slices/camera';

const key = process.env.REACT_APP_FLICKR_API_KEY;

const App = () => {
  const dispatch = useDispatch();
  const brand = useSelector((state) => state.camera);

  const { data: getBrandsData, error, isLoading } = useGetBrandsQuery();
  const [triggerGetModelsQuery, { data: getModelsData }] = useLazyGetModelsQuery();

  useEffect(() => {
    if (getBrandsData && getBrandsData.stat === 'ok') {
      dispatch(setBrands(getBrandsData.brands.brand));
      triggerGetModelsQuery()
    }
  }, [getBrandsData]);

  useEffect(() => {
    console.log(brand);
  }, [brand]);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
