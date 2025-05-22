import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { colors } from '../../utilities/colors';
import TextComponent from '../../components/TextComponent';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon, { IconTypes } from '../../components/Icon';
import { hideLoading,  showLoading } from '../../redux/Actions/GeneralActions';
import { login, userData } from '../../redux/Actions/AuthAction';
import Storage from '../../utilities/AsyncStorage';
import { validateEmail } from '../../utilities/validators';
import auth from '@react-native-firebase/auth';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const onPressLogin = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter email');
        }
        else if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email');
        }
        else if (!password) {
            Alert.alert('Error', 'Please enter password');
        }
        else {
            dispatch(showLoading())
            await auth()
                .signInWithEmailAndPassword(email, password)
                .then((res) => {
                    const data = {
                        email: res.user.email,
                        name: res.user.displayName || '',
                        id: res.user.uid,
                    }
                    Storage.set('@user', JSON.stringify(data));
                    dispatch(userData(data));
                    dispatch(login(true));
                })
                .catch(error => {
                    console.log(error.message);
                    Alert.alert('Error', 'email or password is incorrect');
                }).finally(() => {
                    dispatch(hideLoading())
                })


        }
    }


    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>

                <View style={styles.details_view}>
                    <TextComponent text={'Login'} style={styles.heading} />
                    <TextComponent text={'Login to access your account'} style={styles.span2} />
                </View>

                <Input
                    label='Email'
                    value={email}
                    placeholder='Enter your email'
                    mainStyle={styles.input}
                    onChangeText={e => setEmail(e)}
                    leftIcon={<Icon name={'envelope-o'} type={IconTypes.FontAwesome} color={colors?.D_GREY} size={16} />}
                />

                <Input
                    label='Password'
                    value={password}
                    placeholder='Enter your password'
                    onChangeText={e => setPassword(e)}
                    style={styles.input}
                    isPassword
                    secureTextEntry
                    leftIcon={<Icon name={'lock'} type={IconTypes.Feather} color={colors?.D_GREY} size={16} />}
                />

                <Button title={'Login'} onPress={onPressLogin} style={styles.button} />

                <View style={[styles.row, { alignSelf: 'center', marginVertical: 10 }]}>
                    <TextComponent text={'Dont have an account ?'} style={styles.span2} />
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <TextComponent text={'Signup'} style={styles.span3} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({

    details_view: {
        width: '90%',
        gap: 3,
        marginBottom: 20,
        marginTop: 100
    },
    container: {
        flex: 1,
        backgroundColor: colors?.WHITE,
    },

    heading: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    span2: {
        fontSize: 12,
        color: colors.GREY
    },
    span3: {
        color: colors?.PRIMARY,
        fontSize: 11,
        textDecorationLine: 'underline'
    },

    button: {
        width: '90%',
        marginTop: 40
    },
    input: {
        marginVertical: 10
    },
    row: {
        flexDirection: 'row',
        gap: 3,
        alignItems: 'center',
    },
    wide_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        marginVertical: 20
    },
    hr: { width: '40%', backgroundColor: colors.GREY, height: 0.5 },

});