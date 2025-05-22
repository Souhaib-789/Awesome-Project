import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { colors } from '../../utilities/colors';
import TextComponent from '../../components/TextComponent';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon, { IconTypes } from '../../components/Icon';
import { validateEmail } from '../../utilities/validators';
import { hideLoading, showLoading } from '../../redux/Actions/GeneralActions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Signup = () => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const navigation = useNavigation();

    const dispatch = useDispatch();


    const onPressSignup = async () => {
        if (!name) {
            Alert.alert('Error', 'Please enter name');
        }
        else if (!email) {
            Alert.alert('Error', 'Please enter email');
        }
        else if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email');
        }
        else if (!password) {
            Alert.alert('Error', 'Please enter password');
        }
        else if (!confirmPassword) {
            Alert.alert('Error', 'Please enter confirm password');
        }
        else if (password !== confirmPassword) {
            Alert.alert('Error', 'Password and confirm password do not match');
        }
        else {
            dispatch(showLoading())
            auth()
                .createUserWithEmailAndPassword(email, confirmPassword)
                .then((e) => {
                    const user = e.user;
                    user.updateProfile({ displayName: name })
                    Alert.alert('Success', 'User account created successfully!');

                    firestore()
                        .collection('users')
                        .doc(auth().currentUser.uid)
                        .set({
                            uid: user.uid,
                            email: user.email,
                            name: name || '',
                            createdAt: firestore.FieldValue.serverTimestamp(),
                        });

                    navigation.navigate('Login');
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        Alert.alert('That email address is already in use!');
                    }
                    else if (error.code === 'auth/invalid-email') {
                        Alert.alert('That email address is invalid!');
                    } else {
                        Alert.alert('Error', 'Network error, please try again later');
                        console.error(error);
                    }


                })
                .finally(() => {
                    dispatch(hideLoading())
                })
        }

    }



    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>

                <TextComponent text={'Create Account'} style={styles.heading} />

                <Input
                    label='Name'
                    value={name}
                    placeholder='Enter your name'
                    mainStyle={styles.input}
                    onChangeText={e => setName(e)}
                    leftIcon={<Icon name={'user'} type={IconTypes.AntDesign} color={colors?.GREY} size={16} />}
                />

                <Input
                    label='Email'
                    value={email}
                    placeholder='Enter your email'
                    mainStyle={styles.input}
                    onChangeText={e => setEmail(e)}
                    leftIcon={<Icon name={'envelope-o'} type={IconTypes.FontAwesome} color={colors?.GREY} size={16} />}
                />

                <Input
                    label='Password'
                    value={password}
                    placeholder='Enter your password'
                    onChangeText={e => setPassword(e)}
                    style={styles.input}
                    isPassword
                    secureTextEntry
                    leftIcon={<Icon name={'lock'} type={IconTypes.Feather} color={colors?.GREY} size={16} />}
                />

                <Input
                    label='Confirm Password'
                    value={confirmPassword}
                    placeholder='Re-enter your password'
                    onChangeText={e => setconfirmPassword(e)}
                    style={styles.input}
                    isPassword
                    secureTextEntry
                    leftIcon={<Icon name={'lock'} type={IconTypes.Feather} color={colors?.GREY} size={16} />}
                />

                <Button title={'Signup'} onPress={onPressSignup} style={styles.button} />

                <View style={[styles.row, { alignSelf: 'center', marginVertical: 10 }]}>
                    <TextComponent text={'Already have an account ?'} style={styles.span2} />
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <TextComponent text={'Login'} style={styles.span3} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Signup;

const styles = StyleSheet.create({

    details_view: {
        width: '90%',
        gap: 3,
        marginBottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: colors?.WHITE,
    },

    heading: {
        fontSize: 20,
        marginTop: 100,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 20,
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