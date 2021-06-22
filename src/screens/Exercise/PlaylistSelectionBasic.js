import React, {useState, useEffect} from 'react';
import {  SafeAreaView,  StyleSheet,  Text,  View, Dimensions, FlatList, Modal, TouchableOpacity } from 'react-native';

import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import PlaylistSelectionItem from './components/PlaylistSelectionItem';
import * as Firestore from '../../api/firestore';
import TracksNoFilter from '../../api/spotify/TracksNoFilter';
import * as playlistActions from '../../../store/playlist-actions';

const {width, height} = Dimensions.get("window")


const PlaylistSelectionBasic = (props) => {
    const selectToggle = props.selectToggle;
    const setSelectToggle = props.setSelectToggle;
    const mode = props.mode;

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    //^For loading page if doing
    const [playlists, setPlaylists] = useState([]);
    const [inSelected, setInSelected] = useState([]);
    
    useEffect(() => {
        Firestore.db_playlists(
            (playlists) => { setPlaylists(playlists)},
            (error) => {console.log('Failed to initiate playlist in music main')}
        );
    }, []);

    const getTracksForRun = async () => {
        if (inSelected.length === 0) {
            console.log('No playlists selected');
            return;
        }
        setIsLoading(true);
        await TracksNoFilter(inSelected,
            (tracks) => {
                dispatch(playlistActions.setTracksForRun(tracks))
            },
            (error) => {
                setIsLoading(false);
                console.log(error);
            }
        );
    };

    const confirmation = () => {
        getTracksForRun().then(() => {
            setSelectToggle(false);
            navigation.navigate("RunningScreen", {mode: mode});
        })
    }

    return (
        <Modal visible={selectToggle} transparent={true} animationType={'slide'}>
            <View style={styles.modal}>

                {/* PopUp Area */}
                <View style={styles.selectContainer}>

                    {/* Text Bar */}                    
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>Select Music to accompany your run</Text>
                    </View>

                    {/* Playlist List */}
                    <FlatList
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        numColumns={2}
                        data={playlists}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => <PlaylistSelectionItem 
                                                    item={item}
                                                    inserted={inSelected}
                                                    insert={setInSelected}
                                                />}
                    />

                    {/* Button Container */}
                    <View style={styles.buttonContainer}>
                        {/* Cancel Button */}
                        <TouchableOpacity onPress={() => {setSelectToggle(false)}}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Confirm Button */}
                        <TouchableOpacity onPress={confirmation}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Confirm</Text>
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
    selectContainer:{
        width: width * 0.95,
        height: height * 0.8,
        borderRadius: 5,
        backgroundColor: '#36393E',
    },
    messageContainer:{
        width: width * 0.95,
        height: height * 0.05,
        alignItems: 'center', 
        justifyContent: 'center',
        // backgroundColor: 'yellow',
    },
    messageText:{
        fontSize: 12,
        color: '#BABBBF',
    },
    list:{
    //    backgroundColor: 'pink',
    },
    listContent:{
        paddingBottom: (height * 0.95 * 0.02) + (height * 0.13 * 0.5) ,
    },
    buttonContainer:{
        position: 'absolute',
        width: width * 0.7,
        bottom: height * 0.95 * 0.02 ,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'yellow',
    },
    button:{
        width: width * 0.3,
        height: height * 0.13 * 0.4,
        borderRadius: 5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#72767D',
    },
    buttonText:{
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
})
export default PlaylistSelectionBasic