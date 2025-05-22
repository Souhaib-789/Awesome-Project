import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import { videosURLs } from '../../utilities/dummyData';
import Icon, { IconTypes } from '../../components/Icon';
import { colors } from '../../utilities/colors';
import { useNavigation } from '@react-navigation/native';
import TextComponent from '../../components/TextComponent';

const { height } = Dimensions.get('window');

const Reels = () => {

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    const [activeIndex, setActiveIndex] = useState(0);
    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    });

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
    }, []);

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 });

    const VideoItem = ({ item, isActive }) => {
        return (
            <View>
                <Video
                    source={{ uri: item.videoUrl }}
                    style={{ width: '100%', height: height }}
                    resizeMode="cover"
                    paused={!isActive}
                    repeat
                // onLoadStart={() => setIsLoading(true)}
                // onLoad={() => {setIsLoading(false), console.log('Video loaded')}}
                />

                <TouchableOpacity onPress={() => setLiked(!liked)} style={{ position: 'absolute', bottom: 20, right: 20 }}>
                    <Icon name={liked ? 'heart' : 'hearto'} type={IconTypes.AntDesign} size={25} color={liked ? 'red' : colors.WHITE} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <>
            <TouchableOpacity style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }} onPress={() => navigation.goBack()}>
                <Icon name='chevron-back-circle-outline' type={IconTypes.Ionicons} size={30} color={colors.BLACK} />
            </TouchableOpacity>

            <FlatList
                data={videosURLs}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    isLoading ?
                        <>
                            <ActivityIndicator
                                size="large"
                                color={colors.PRIMARY}
                                style={{ width: '100%', height: height }}
                            />
                            <TextComponent text={'Loading video content this may take some time...'} style={{ width: '70%', textAlign: 'center', position: 'absolute', top: '55%', alignSelf: 'center', }} />
                        </>
                        :
                        <VideoItem item={item} isActive={index === activeIndex} />

                )}

                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}

            />
        </>
    );
};

export default Reels;
