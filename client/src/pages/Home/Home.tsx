import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Home.module.scss';
import { useGetUserQuery, selectLocation } from '@/store';
import { useSelector } from 'react-redux';
import { useLocation } from '@/hooks';
import { Header, Map, CustomButton, Navbar, EnableNotification } from '@/components';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { LocationOn as LocationOnIcon } from '@mui/icons-material';
import cone from '../../assets/markers/Cone.svg';
import pothole from '../../assets/markers/Pothole.svg';
import roadDamage from '../../assets/markers/RoadDamage.svg';
import carAccident from '../../assets/markers/CarAccident.svg';
import warning from '../../assets/markers/WarningSign.svg';

// Image imports
import logo from 'src/assets/Updated_RoadWatch_Logo.svg'; // keep just in case, but its previous use was removed
import warning_marker from 'src/assets/markers/WarningSign.svg';

export default function Home(): JSX.Element {
  useLocation();
  const { data } = useGetUserQuery();

  const [open, setOpen] = useState(false); // Speed Dial Functions
  const handleOpen = () => setOpen(true); // Speed Dial Functions
  const handleClose = () => setOpen(false); // Speed Dial Functions

  const reduxLocation = useSelector(selectLocation); // Get the location from the Redux store, if available

  // The map will load when location is set or user asks to load.
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [forceLoadMap, setForceLoadMap] = useState(false);

  // Standardize the location object to match the expected format for the Map component
  const transformedLocation = reduxLocation
    ? { lat: reduxLocation.latitude, lng: reduxLocation.longitude }
    : undefined;

  useEffect(() => {
    if (transformedLocation) {
      setIsLocationReady(true); // sets the location to ready.
    }
  }, [transformedLocation]); // Depend on transformedLocation

  // When the button is clicked, set forceLoadMap to true
  const handleLoadMapClick = () => {
    setForceLoadMap(true);
  };

  const actions = [
    { icon: <LocationOnIcon />, name: 'Pothole', onClick: () => handleMarkerTypeSelect('pothole') },
    {
      icon: <LocationOnIcon />,
      name: 'Speed Bump',
      onClick: () => handleMarkerTypeSelect('sbump'),
    },
    { icon: <LocationOnIcon />, name: 'Closure', onClick: () => handleMarkerTypeSelect('closure') },
    { icon: <LocationOnIcon />, name: 'Crosswalk', onClick: () => handleMarkerTypeSelect('xwalk') },
    // Add more actions as needed
  ];

  const handleMarkerTypeSelect = (type: string) => {
    // setSelectedMarkerType(type);
    handleClose(); // Close the SpeedDial after selecting a marker type
  };

  return (
    <div className={styles['Home']}>
      {createPortal(<EnableNotification />, document.getElementById('root') as HTMLElement)}
      <Navbar />
      <Header userName={data?.userName} />
      {/* Render the Map if the location is ready or if the user has requested to load the map */}
      {isLocationReady || forceLoadMap ? (
        <Map location={transformedLocation || { lat: 36.18811, lng: -115.176468 }} />
      ) : (
        <div>
          <img src={warning_marker} className={styles['Home__center_image']} alt="warning icon" />
          <p className={styles['Home__alert_message']}>
            Location not available.
            <br></br>
            Would you like to load the map anyway?
          </p>
          <div className={styles['Home__button_container']}>
            <CustomButton onClick={handleLoadMapClick}>Load Map Anyway</CustomButton>
          </div>
        </div>
      )}
      <SpeedDial
        icon={<SpeedDialIcon />}
        ariaLabel="SpeedDial"
        sx={{ position: 'absolute', bottom: 80, right: 60 }}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
