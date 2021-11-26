<template>
  <div>
    <div class="access" ref="googleMap" />
  </div>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader';

export default {
  name: 'access',
  data() {
    return {
      google: null,
      mapConfig: {
        center: {
          //緯度経度を代入する
          lat: this.$store.state.longitude,
          lng: this.$store.state.latitude
        },
        zoom: 19
      }
    }
  },
  async mounted() {
    this.google = await GoogleMapsApiLoader({
      apiKey: 'GoogleMapのAPIを記入する'
    });
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      new this.google.maps.Map(this.$refs.googleMap, this.mapConfig);
    }
  },
  created() {
    //データ引き継ぎ確認
    console.log("緯度経度:"+ this.$store.state.longitude + "," + this.$store.state.latitude)
  },
}
</script>

<style lang="scss" scoped>
.access {
  // width: 340px;
  // height: 330px;
  width: 82vw;
  height: 37vh;
}
</style>