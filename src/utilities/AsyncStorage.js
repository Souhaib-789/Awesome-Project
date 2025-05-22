import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {


    static set = async (key, value) => {
        try {
            return await AsyncStorage.setItem(key, value);
        } catch (e) {
            return null;
        }
    };

    static get = async key => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (e) {
            return null;
        }
    };

    static clearStorage = async () => {
        try {
            // return await AsyncStorage.clear();
            await AsyncStorage.removeItem('@user')
            await AsyncStorage.removeItem('@token')
        } catch (e) {
            return null;
        }
    };



}

export default Storage;
