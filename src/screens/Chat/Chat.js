import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import TextComponent from '../../components/TextComponent';
import Header from '../../components/Header';
import AVATAR from '../../assets/user.png';
import moment from 'moment';
import Icon, { IconTypes } from '../../components/Icon';
import { colors } from '../../utilities/colors';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { hideLoading, showLoading } from '../../redux/Actions/GeneralActions';

const Chat = props => {

    const [chatList, setChatList] = useState([]);

    const routeData = props?.route?.params?.data;

    const dispatch = useDispatch();
    const user = useSelector(state => state.AuthReducer?.user);
    const [message, setMessage] = useState(null);


    const [chatID, setChatID] = useState(null);

    useEffect(() => {
        getOrCreateChat();
    }, []);

    const getChatId = () => {
        return [user?.id, routeData?.id].sort().join('_');
    };

    const getOrCreateChat = async () => {
        try {
            dispatch(showLoading())

            const chatId = getChatId();
            setChatID(chatId);
            const chatRef = firestore().collection('chats').doc(chatId);

            const doc = await chatRef.get();
            if (!doc.exists) {
                await chatRef.set({
                    users: [user?.id, routeData?.id],
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
            }

            firestore()
                .collection('chats')
                .doc(chatId)
                .collection('messages')
                .orderBy('time', 'asc')
                .onSnapshot(snapshot => {
                    const messages = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setChatList(messages.reverse());
                });
        }
        catch (error) {
            console.error('Error creating chat: ', error);
        }
        finally {
            dispatch(hideLoading())
        }
    };

    const sendMessage = async () => {
        dispatch(showLoading())
        try {
            const msg = {
                message: message,
                sender_id: user?.id,
                receiver_id: routeData?.id,
                time: firestore.FieldValue.serverTimestamp(),
            };

            await firestore()
                .collection('chats')
                .doc(chatID)
                .collection('messages')
                .add(msg);

            dispatch(hideLoading())
            setMessage(null);
        }
        catch (error) {
            dispatch(hideLoading())
            setMessage(null)
        }

    };


    const renderChatItem = ({ item }) => {
        if (item?.sender_id != user?.id) {
            return (
                <View style={styles.person_main_chat_item}>
                    <TouchableOpacity>
                        <Image
                            source={AVATAR}
                            style={styles.bot_image}
                            resizeMode={'cover'}
                        />
                    </TouchableOpacity>
                    <View>
                        <View style={styles.person_chat_item}>

                            <TextComponent text={item?.message} style={styles.message} />

                            <TextComponent
                                text={
                                    item?.time
                                        ? moment(item?.time, 'hh:mm A').format('LT')
                                        : '00:00 AM'
                                }
                                style={styles.chat_time}
                            />
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.user_main_chat_item}>
                    <View>
                        <View style={styles.user_chat_item}>

                            <TextComponent text={item?.message} style={[styles.message, { color: colors.WHITE }]} />


                            <TextComponent
                                text={
                                    item?.time
                                        ? moment(item?.time, 'hh:mm A').format('LT')
                                        : '00:00 AM'
                                }
                                style={[styles.chat_time, { alignSelf: 'flex-start', color: colors.WHITE }]}
                            />
                        </View>
                    </View>
                    <Image
                        source={AVATAR}
                        style={styles.bot_image}
                        resizeMode={'cover'}
                    />
                </View>
            );
        }
    };

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : null}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={{ flex: 1 }}>
            <View style={styles.Container}>
                <Header
                    title={routeData?.name}
                    back
                    image={AVATAR}
                    style={{ borderBottomWidth: 1, borderBottomColor: colors.INPUT_BG }}
                />
                <FlatList
                    style={{ flex: 1, paddingHorizontal: 15 }}
                    showsVerticalScrollIndicator={false}
                    data={chatList}
                    keyExtractor={(item, index) => index?.toString()}
                    renderItem={renderChatItem}
                    inverted={chatList?.length > 0 ? true : false}

                />

                <View style={styles.input_parent}>
                    <View style={styles.input_container}>

                        <TextInput
                            placeholder={'Message' + '...'}
                            placeholderTextColor={colors.DARK_GRAY}
                            value={message}
                            onChangeText={e => setMessage(e)}
                            style={styles.input}
                        />

                        <TouchableOpacity
                            onPress={sendMessage}
                        >
                            <Icon
                                name={'send-circle'}
                                type={IconTypes.MaterialCommunityIcons}
                                size={30}
                                color={colors.PRIMARY}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Chat;

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    bot_image: {
        width: 30,
        height: 30,
        borderRadius: 50,
    },
    message: {
        fontSize: 13,
    },
    chat_image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    user_main_chat_item: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        width: '70%',
        marginVertical: 5,
    },

    user_chat_item: {
        backgroundColor: colors.PRIMARY,
        padding: 12,
        marginRight: 5,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    person_main_chat_item: {
        flexDirection: 'row',
        width: '80%',
        marginVertical: 20,
    },

    person_chat_item: {
        backgroundColor: colors.INPUT_BG,
        padding: 12,
        marginLeft: 5,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    chat_time: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    input: {
        width: '67%',
        fontSize: 13,
        color: colors.BLACK,
    },
    input_container: {
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.BORDER,
        backgroundColor: colors.INPUT_BG,
        padding: Platform.OS === 'ios' ? 12 : 2,
    },
    input_parent: {
        backgroundColor: colors.WHITE,
        elevation: 10,
        shadowOffset: {
            width: 2,
            height: 10,
        },
        shadowColor: colors.PRIMARY,
        shadowRadius: 5,
        marginTop: 10,
        paddingVertical: 5,
    },
    icon_image: {
        width: 20,
        height: 20,
    },
});
