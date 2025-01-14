import React, {useState} from 'react';
import { StyleSheet,  Text,  View, Dimensions, FlatList, Modal, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';

import SearchItem from './components/SearchItem';
import Spotify_Search from '../../api/spotify/spotify_search';
import * as Firestore from '../../api/firestore';

const {width, height} = Dimensions.get("window")

/**
 * This is a functional component representing the pop up on the Music Tab,
 * when searching for playlist on Spotify.
 * 
 * @author NUS Orbital 2021 Team Maple
 */
const PlaylistSearch = (props) => {
    const searchToggle = props.searchToggle;
    const setSearchToggle = props.setSearchToggle;
    const [searchTitle, setSearchTitle] = useState('');
    const [playlists, setPlaylists] = useState([]);

    /**
     * This is a method to obtain the search results of playlists from Spotify.
     */
    const getPlaylists = async () => {
        const newPlaylists = await Spotify_Search({
            offset: 0,
            limit: 50,
            q: searchTitle,
        });
        //If no playlist found empty playlist [],
        setPlaylists(newPlaylists);
    };

    /**
     * This is a method to confirm the action of adding a playlist as a document in the user's playlists collection in Firestore.
     * @param {Object} playlist   A playlist object that contains information of a Spotify playlist. 
     */
    const onSelect = (playlist) => {
        //do some alert/pop up, if ok then proceed with adding
        Alert.alert(
          'Add Playlist',
          'Are you sure that you want to add this playlist?',
          [
            {
              text: 'Cancel',
              onPress: () => Alert.alert('Cancelled'),
              style: 'default', //ignored on android...
            },
            {
              text: 'Ok',
              onPress: () => {
                //console.log(playlist);
                //dispatch(playlistActions.addPlaylist(playlist));
                Firestore.db_addUserPlaylists(playlist);
              },
              style: 'default', //ignored on android
            },
          ],
          {
            cancelable: true,
          }
        );
    };

    return (
        <Modal visible={searchToggle} transparent={true} animationType={'slide'}>
            <View style={styles.modal}>
                <View style={styles.searchContainer}>

                    {/* Search Bar */}
                    <View style={styles.searchBar}>

                        <TextInput
                            mode="outlined"
                            label="Search Playlists..."
                            keyboardType="default"
                            style={{width: 0.9 * width,}}
                            placeholder="Name of playlist..."
                            value={searchTitle}
                            onChangeText={setSearchTitle}
                            autoCapitalize="none"
                            returnKeyType="default"
                            onSubmitEditing={() => {
                                            Keyboard.dismiss();
                                            getPlaylists();
                                        }}
                            blurOnSubmit={false}
                            right={<TextInput.Icon
                                name={() => <Icon name="search" size={height * 0.03} color="#7289DA"/>}
                                onPress={ () => {
                                    Keyboard.dismiss();
                                    getPlaylists();
                                }}
                            />}
                            theme={{colors: {primary: "#7289DA", placeholder : '#72767D', text: '#BABBBF', underlineColor: 'transparent', background: '#4F535C'},}}
                        />
                    </View>

                    {/* Playlist List */}
                    <FlatList
                        showsVerticalScrollIndicator ={false}
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        numColumns={2}
                        data={playlists}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => <SearchItem item={item} onSelect={() => onSelect(item)}/>}
                        ListEmptyComponent={
                            <View style={styles.emptyList}>
                                <View style={styles.emptyIcon}>
                                    <Icon name="search" size={height * 0.04} color="#72767D"/>
                                </View> 
                                <Text style={styles.emptyText}>Search for Playlists from Spotify</Text>
                            </View>
                        }
                    />

                    {/* Button Container */}
                    <View style={styles.buttonContainer}>
                        {/* Close Button */}
                        <TouchableOpacity onPress={() => {setSearchToggle(false)}}>
                            <View style={styles.closeButton}>
                                <Text style={styles.buttonText}>Close</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal:{
        width: width,
        height: height,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center',        
    },
    searchContainer:{
        width: width * 0.95,
        height: height * 0.8,
        borderRadius: 5,
        backgroundColor: '#36393E',
    },
    searchBar: {
        width: width * 0.9,
        height: height * 0.1,
        alignSelf: 'center',
        marginTop: height * 0.01,
        // backgroundColor: 'green',
    },
    list:{
        width: width * 0.95,
        height: height * 0.7,
    //    backgroundColor: 'pink',
    },
    listContent:{
        paddingBottom: (height * 0.13 * 0.4) + (height * 0.95 * 0.02)
    },
    emptyList: {
        width: width,
        height: height * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    emptyText:{
        fontSize: 14,
        color: '#72767D'
    },
    emptyIcon:{
        height: height * 0.07,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    buttonContainer:{
        position: 'absolute',
        bottom: height * 0.95 * 0.02 ,
        alignSelf: 'center',
    },
    closeButton:{
        width: width * 0.3,
        height: height * 0.13 * 0.4,
        borderRadius: 5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7289DA',
    },
    buttonText:{
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default PlaylistSearch;
