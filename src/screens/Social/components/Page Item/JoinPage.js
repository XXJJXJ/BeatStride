import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const JoinPage = (props) => {
    const joinDate = props.joinDate;

    return (
        <View style={[styles.container]}>

            {/* Label */}
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>Joined since</Text>
            </View>

            {/* Data */}
            <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                    {(joinDate).split(",")[0]}
                </Text>
            </View>
            
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.95,
        height: height * 0.2,
        justifyContent: 'center',
        // backgroundColor: '#7289DA',
    },
    labelContainer:{
        width: width * 0.5,
        height: height * 0.06,
        justifyContent: 'center',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: '#42474D',
    },
    labelText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    dataContainer:{
        width: width * 0.95,
        height: height * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    dataText:{
        fontWeight: 'bold',
        fontSize: 30,
        color: '#FFFFFF',
    },
});

export default JoinPage;