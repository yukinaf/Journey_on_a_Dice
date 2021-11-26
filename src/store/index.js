import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    photoURL: null,
    latitude: null,
    longitude: null,
    uid: null,
    tripid: null,
    currentSpot: null,
    hazureDetail:{},
  },
  mutations: {
    setUser(state, user, uid, photoURL){
      state.user = user,
      state.uid = uid,
      state.photoURL = photoURL
    },
    setTrip(state, tripid){
      state.tripid = tripid
    },
    setCurrentSpot(state, val){
      state.currentSpot = val
    },
    setHazureDetail(state,val){
      state.hazureDetail = val
    },
    // setUserID(state, uid){
    //   state.uid = uid
    // },
    setLatLng(state, val){
      state.latitude= val.latitude,
      state.longitude = val.longitude
    },
    //多分使わないけど，一応書いておく
    setMap(state, val){
      state.map = val;
    },
  },
  actions: {
  },
  modules: {
  }
})
