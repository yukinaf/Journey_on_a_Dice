<template>
  <div id="Detail">
    <!-- 該当の駅とキャッチコピー -->
    <v-container>
      <h1>{{ spot_name }}</h1>
      <h4>{{ catch_copy }}  {{ nearest_station }}</h4>
      <!-- 場所の写真 -->
      <v-img
        max-height="358"
        max-width="550"
        :src= "img_url"
      ></v-img>
      <!-- 費用などの詳細とアクセス -->
      <v-expansion-panels multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>詳細</v-expansion-panel-header>
          <v-expansion-panel-content>
            <!-- ここ後ほど綺麗にします汚くてごめん -->
            営業時間：{{ business_hours }}<br>
            定休日：{{ regular_holiday }}<br>
            詳細{{ detail }}
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>アクセス</v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ access }}
            <gmap/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- ボタン類 -->
      <div class="text-center">
        <v-btn
          class="ma-2"
          outlined
          color="indigo"
          @click="toBack"
        >
          もう1回
        </v-btn>
        <v-btn
          class="ma-2"
          outlined
          color="#dc143c"
          @click="addSpot(), toNext()"
        >
          次へ
        </v-btn>
      </div>
      <div class="text-center">
        <v-btn
          class="ma-2"
          outlined
          color="grey"
          @click="Finish()"
        >
          サイコロの旅を終了する
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import gmap from "../components/access.vue"

  export default {
    name: 'Detail',
    data() {
      return {
            spot_name: "",
            catch_copy: "",
            nearest_station: "",
            access: "",
            img_url: '',
            business_hours: "",
            regular_holiday: "",
            detail: "",
            longitude: "",
            latitude: "",
      };
    },
    components: {
      gmap
    },
    created() {
      if(this.$store.state.currentSpot!=-1){
      this.$axios.get('https://ito.nkmr.io/api/get_detail.php',{
      params:{
        //ここをDiceで送られてきたspot_idを入れる
        spot_id: this.$store.state.currentSpot
      }
    }).then((response)=>{
      //console.log(response.data)
      //それぞれのデータを呼び出す
      this.spot_name = response.data[0].spot_name
      this.catch_copy = response.data[0].catch_copy
      this.nearest_station = response.data[0].nearest_station
      this.img_url = response.data[0].img_url
      this.access = response.data[0].access
      this.business_hours = response.data[0].business_hours
      this.regular_holiday = response.data[0].regular_holiday
      this.detail = response.data[0].detail
      this.latitude = response.data[0].latitude
      this.longitude = response.data[0].longitude
      this.getLatLng()
      //console.log('status:',response.status)
    }).catch((error)=>{
      alert('エラーが発生しました')
      console.log('err:',error)
    })
    }else{
        this.spot_name = this.$store.state.hazureDetail.spot_name
        this.catch_copy = this.$store.state.hazureDetail.catch_copy
        this.nearest_station = ""
        this.img_url = this.$store.state.hazureDetail.img_url
        this.access = this.$store.state.hazureDetail.access
        this.business_hours = this.$store.state.hazureDetail.business_hours
        this.regular_holiday = this.$store.state.hazureDetail.regular_holiday
        this.detail = this.$store.state.hazureDetail.detail
        this.latitude = this.$store.state.hazureDetail.latitude
        this.longitude = this.$store.state.hazureDetail.longitude
      }
  },
  methods: {
    getLatLng() {
      console.log("緯度経度:"+this.longitude + "と" + this.latitude)
      if (this.latitude != null && this.longitude != null){
        console.log("送れたよ！")
        this.$store.commit('setLatLng', {latitude: this.latitude, longitude: this.longitude})
      }else{
        console.log("送れてないよ！")
      }
    },
    toBack() {
      //もう一回
      this.$router.push('/dice');
    },
    toNext() {
      //次へ
      //データをDBに格納する
      this.$router.push('/dice');
    },
    addSpot() {
        if(this.$store.state.currentSpot!=-1){
          console.log(this.$store.state.tripid.tripid,this.$store.state.currentSpot)
          this.$axios.get('https://karin.nkmr.io/ハッカソン5th/addspotid.php', {
            params: {
              uid: this.$store.state.user.uid,
              tripid: this.$store.state.tripid.tripid,
              spotid: this.$store.state.currentSpot,
              hazure: 0,
            }
          }).then(() => {
            console.log("できた！");
            // this.loadMember();
          })
        }else{
          if(this.$store.state.hazureDetail.save){
            console.log(this.spot_name,this.$store.state.user.uid,this.$store.state.hazureDetail.nearest_station)
            this.$axios.get('https://ito.nkmr.io/api/hazure_api.php', {
              params: {
                title: this.spot_name,
                user_id: this.$store.state.user.uid,
                place: this.$store.state.hazureDetail.nearest_station,
              }
            }).then((response) => {
              console.log(response)
              console.log("できた！");
              // this.loadMember();
            })
          }
        }
      },
    Finish() {
      this.addSpot();
      //終了
      this.$router.push('/goal');

    }
  }
}
</script>

