import { applyMiddleware, createStore } from 'redux';
import {thunk} from 'redux-thunk';
import Reducers from './Reducers';

const Store = createStore(Reducers, applyMiddleware(thunk));

Store.subscribe(async () => {
  // console.log('STATE=>', store.getState());
});
export default Store;
