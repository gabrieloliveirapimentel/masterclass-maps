import React, { useEffect, useState, useRef } from 'react';
import { Alert, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';

import API_MAPS from './config';
import { styles } from './styles';

type CoordsProps = {
  latitude: number;
  longitude: number;
}

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<CoordsProps | null>(null);
  const [destination, setDestination] = useState<CoordsProps | null>(null);
  const [coords, setCoords] = useState<CoordsProps[]>([]);

  const mapRef = useRef<MapView>(null);

  //Change destination
  const handleMapPress = (event: MapEvent) => {
    const { coordinate } = event.nativeEvent;

    setDestination({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== 'granted'){
          Alert.alert("Habilite a permissão para obter a localização!");
          return;
        }

        Location.watchPositionAsync({
          accuracy: Location.LocationAccuracy.High,
          timeInterval: 1000,
          distanceInterval: 1
        }, (location) => {
          setCurrentLocation(location.coords);
          setCoords((prevState) => [...prevState, location.coords])
        }). then(( response ) => subscription = response);
      });

      return () => {
        if (subscription) {
          subscription.remove();
        }
      }
  },[])

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        styles={{ container: styles.searchContainer, textInput: styles.searchInput }}
        placeholder="Para onde?"
        fetchDetails={true}
        GooglePlacesDetailsQuery={{fields: "geometry"}}
        enablePoweredByContainer={false}
        query={{
          key: API_MAPS,
          language: 'pt-BR'
        }}
        onFail={console.log}
        onPress={(data, details) => {
          //console.log(details?.geometry?.location);
          setDestination({
            latitude: details?.geometry?.location.lat ?? 0,
            longitude: details?.geometry?.location.lng ?? 0
          });
        }}
      />
    {
      currentLocation &&
      <MapView 
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: -21.53415360741229,
        longitude: -42.64717693257586,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onPress={handleMapPress}
    >
      <Marker 
        identifier="origin"
        coordinate={currentLocation}
      >
        <View style={styles.marker}>
          <FontAwesome 
            name="car" 
            size={22} 
            color="white" 
          />
        </View>
      </Marker>

      { destination && 
        <Marker 
          identifier="destination"
          coordinate={destination}
          pinColor='red'
        />
      }
      <Polyline
        coordinates={coords}
        strokeColor='red'
        strokeWidth={7}
      />

      <MapViewDirections 
        origin={currentLocation}
        destination={destination}
        apikey={API_MAPS}
        strokeColor='red'
        strokeWidth={7}
        lineDashPattern={[0]}
        onReady={(result) => {
          
          mapRef.current?.fitToCoordinates(result.coordinates, {
            edgePadding: {
              top: 124,
              bottom: 24,
              left: 24,
              right: 24
            }
        })
        
        }}
      />
    </MapView>
    }
         
    </View>
  );
}
