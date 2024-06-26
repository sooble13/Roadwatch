import { useState } from 'react';
import styles from './CreatePost.module.scss';
import CustomButton from '../CustomButton/CustomButton.tsx';
import CloseIcon from '@mui/icons-material/Close';
import { Fab, IconButton, InputAdornment } from '@mui/material';
import TextField from '../TextField/TextField.tsx';
import cone from '../../assets/markers/Cone.svg';
import pothole from '../../assets/markers/Pothole.svg';
import roadDamage from '../../assets/markers/RoadDamage.svg';
import carAccident from '../../assets/markers/CarAccident.svg';
import warning from '../../assets/markers/WarningSign.svg';
import TextFieldMulti from '@mui/material/TextField';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

// Type for the marker IDs
type MarkerId = 'cone' | 'pothole' | 'roadDamage' | 'carAccident' | 'warningSign' | 'etc'

export default function CreatePost() {
    // State Variables
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [postName, setPostName] = useState('');
    const [marker, setMarker] = useState<MarkerId | null>(null);
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    // Function to handle initialize data
    const initializeData = () => {
        setPostName('');
        setMarker(null);
        setDate(new Date().toISOString().split('T')[0]);

        // Check for Geolocation support
        if (navigator.geolocation) {
            // Ask for user permission
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    // Extract latitude and longitude
                    const { latitude, longitude } = position.coords;
                    // Set location to latitude and longitude
                    setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
                },
                // Error callback
                (error) => {
                    console.error('Error getting current location:', error);
                    // Set a default location if there's an error
                    setLocation('Default location');
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            // Set a default location if Geolocation is not supported
            setLocation('Default location');
        }
        setDescription('');

    }

    // Functions to handle input changes to each data point 
    // (postName, marker, date, description, and location)
    const handlePostNameChange = (value: string) => setPostName(value);
    const handleDateChange = (value: string) => setDate(value);
    const handleDescriptionChange = (value: string) => setDescription(value);
    const handleLocationChange = (value: string) => setLocation(value);
    const markerClick = (id: string) => setMarker(id as MarkerId);

    // Function to handle post submission
    const handlePost = () => {
        // For now it console logs the data points
        // May need to refactor for backend
        if (postName && description && date && location && marker) {
            console.log('Post Name:', postName);
            console.log('Description:', description);
            console.log('Date:', date);
            console.log('Selected Marker:', marker);
            console.log('Location:', location);
            handleDrawerClose();
        }
    }

    // Function to handle opening the Drawer popup
    const handleDrawerOpen = () => {
        // Calls initializeData() function
        setDrawerOpen(true);
        initializeData();
    };

    // Function to handle closing the Drawer popup
    const handleDrawerClose = () => setDrawerOpen(false);

    return (
        <>
            <div className={styles['CreatePost__postContainer']}>
                {/* Button to open dialog */}
                <CustomButton
                    onClick={handleDrawerOpen}>
                    Create Post
                </CustomButton>
            </div>
            {/* MUI SwipeableDrawer for creating post */}
            <SwipeableDrawer
                anchor="bottom"
                open={drawerOpen}
                onClose={handleDrawerClose}
                onOpen={handleDrawerOpen}
                swipeAreaWidth={20}
            >
                <div className={styles['CreatePost__container']}>
                    <div className={styles['CreatePost__first']}>
                        {/* The title: CREATING POST */}
                        <p className={styles['CreatePost__title']}>
                            CREATE POST
                        </p>
                        {/* Button to close dialog (CloseIcon) */}
                        <IconButton
                            className={styles['CreatePost__backButton']}
                            onClick={handleDrawerClose}
                            size="small">
                            <CloseIcon
                                className={styles['CreatePost__close']}
                            />
                        </IconButton>
                    </div>
                    <div className={styles['CreatePost__second']}>
                        {/* Custom TextField for the post name */}
                        <TextField
                            header="Post Name"
                            setInputValue={handlePostNameChange}
                            type="postName"
                        />
                    </div>
                    <div>
                        <p className={styles['CreatePost__text']}>
                            Select Marker
                        </p>
                        <div className={styles['CreatePost__buttons']}>
                            {/* MUI FAB components for markers */}
                            {['cone', 'pothole', 'roadDamage', 'carAccident', 'warningSign'].map(id => (
                                <Fab key={id} className={`${styles['CreatePost__fab']} ${marker === id ? styles['CreatePost__active'] : ''}`}
                                    size="large"
                                    aria-label={id}
                                    onClick={() => markerClick(id)}>
                                    <img
                                        className={`${styles['CreatePost__images']} ${id === 'carAccident' ? styles['CreatePost__images2'] : ''}`}
                                        src={id === 'cone' ? cone
                                            : id === 'pothole' ? pothole
                                                : id === 'roadDamage' ? roadDamage
                                                    : id === 'carAccident' ? carAccident
                                                        : id === 'warningSign' ? warning : ''}
                                        alt="" />
                                </Fab>
                            ))}
                        </div>
                    </div>
                    <div className={styles['CreatePost__third']}>
                        <p className={styles['CreatePost__text']}>
                            Date
                        </p>
                        {/* Date text field using input tag to capture date of post */}
                        <input
                            type="date"
                            className={styles['CreatePost__date']}
                            onChange={(change) => handleDateChange(change.target.value)}
                        >
                        </input>
                    </div>
                    <div className={styles['CreatePost__fourth']}>
                        <p className={styles['CreatePost__text']}>
                            Description
                        </p>
                        {/* Description field which uses MUI Multiline textfield */}
                        <TextFieldMulti
                            id="outlined-multiline-flexible"
                            label="Description..."
                            multiline
                            rows={4}
                            className={styles['CreatePost__multi']}
                            onChange={(change) => handleDescriptionChange(change.target.value)}
                        />
                    </div>
                    <div>
                        <p className={styles['CreatePost__text3']}>
                            Address
                        </p>
                        {/* Address field which uses MUI TextField but adds the RoomOutlinedIcon to the start */}
                        <TextFieldMulti
                            className={styles['CreatePost__multi2']}
                            label="Location"
                            id="input-with-icon-textfield"
                            onChange={(change) => handleLocationChange(change.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" >
                                        <RoomOutlinedIcon />
                                    </InputAdornment>
                                )
                            }} />
                    </div>
                    <div className={styles['CreatePost__lastButton']}>
                        <CustomButton
                            onClick={handlePost}>
                            POST
                        </CustomButton>
                    </div>
                </div>
            </SwipeableDrawer>
        </>
    );
}