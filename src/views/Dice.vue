<template>
  <div id="Dice">
    <v-container>
      <v-row class="d-flex justify-center">
        <h1>サイコロの旅</h1>
      </v-row>
      <v-row class="mx-3">
        <v-checkbox v-model="gohanCheck" label="ごはん"></v-checkbox>
        <v-checkbox v-model="hazureCheck" label="ハズレ"></v-checkbox>
        <v-spacer></v-spacer>
        <v-btn class="my-auto" @click="dice()" >振る</v-btn>
      </v-row>
      <v-row  v-show="!hazureCheck">
        <v-col v-for="n in 6" :key="n" class="d-flex child-flex" cols="12">
          <v-btn :color="colors[n-1]" :disabled="demeBtn[n-1]" @click="toDetail(n-1)">
            <span>
              {{deme[n-1].catch_copy}}{{deme[n-1].nearest_station}}
            </span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-show="hazureCheck">
        <v-col v-for="n in 5" :key="n" class="d-flex child-flex" cols="12">
          <v-btn :color="colors[n-1]" :disabled="demeBtn[n-1]" @click="toDetail(n-1)">
            <span>
              {{deme[n-1].catch_copy}}{{deme[n-1].nearest_station}}
            </span>
          </v-btn>
        </v-col>
        <v-col class="d-flex child-flex" cols="12">
          <v-btn v-show="hazureTitle==''" :color="colors[5]" @click="hazureSubmit()" :disabled="demeBtn[5]">
            <span>
              <strong>ハズレを設定</strong>
            </span>
          </v-btn>
          <v-btn v-show="hazureTitle!=''" :color="colors[5]" @click="hazureSubmit()" :disabled="demeBtn[5]">
            <span >
              {{hazureTitle}}
            </span>
          </v-btn>
        </v-col>
      </v-row>
      <v-overlay :value="overlay">
        <v-card>
          <video type="video/webm" :src="diceGif" autoplay muted height=200></video>
          <!-- <img :src="diceGif" height="200" /> -->
          <v-card-actions>
            <v-btn @click="overlay = !overlay" dark>閉じる</v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-overlay :value="hazurelay">
        <v-card>
          <v-container>
            <v-combobox
              v-model="hazureTitle"
              :items="items"
              label="ハズレマスのタイトル"
            ></v-combobox>
            <v-checkbox v-model="placeRandom" label="場所ランダム"></v-checkbox>
            <v-combobox
              v-model="hazurePlace"
              :items="station"
              :disabled="placeRandom"
              label="場所"
            ></v-combobox>
            <v-checkbox v-model="atodeUse" label="あとで使う"></v-checkbox>
            <v-row class="d-flex justify-center">
              <v-col class="d-flex justify-center">
                <v-btn @click="hazurelay=false">閉じる</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-overlay>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Dice",
  data() {
    return {
      gohanCheck: false, //ごはんタグのチェックボックスTrue/False
      hazureCheck: false, //はずれタグのチェックボックスTrue/False
      placeRandom:false,
      atodeUse:false,
      demeGohan: [
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        }
      ],
      demeNoGohan: [
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        }
      ],
      deme: [
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        },
        {
          catch_copy:"",
          nearest_station:""
        }
      ],
      station:[

      ],
      items:[
      ],
      colors:[
        "#FF72B6",
        "#FC8C4A",
        "#A87EFE",
        "#FCCB4A",
        "#29BEFF",
        "#7EFF4C"
      ], //原作に合わせたマスの色に
      diceNum: null, //サイコロの出目
      demeBtn:[
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      diceGif: null, //サイコロのmp4
      hazureTitle:"",
      hazurePlace:"",
      overlay: false, //サイコロオーバーレイ
      hazurelay:false, //ハズレ設定のオーバーレイ
    };
  },
  watch:{
    hazureCheck:function(val){
      if(val == true){
        // this.deme[5].catch_copy = "ハズレを設定"
        // this.deme[5].nearest_station =""
      }
    },
    gohanCheck:function(val){
      if(val == true){
        this.deme = this.demeGohan
      } else if(val == false){
        this.deme = this.demeNoGohan
      }
    },
  },
  created() {
    //このページが作られたら↓
    this.$axios.get('https://ito.nkmr.io/api/get_spot_station.php', {})
    .then((response) => {
      console.log(response)
      this.station = response.data.map(item=>item.nearest_station)
      console.log(this.station)
    }).catch((error)=>{
      //エラー処理
      alert('エラーが発生しました')
      console.log('err:',error)
    })
    this.$axios.get('https://ito.nkmr.io/api/get_hazure.php', {
      params:{
        user_id:this.$store.state.user.uid
      }
    })
    .then((response) => {
      console.log(response)
      this.items = response.data.map(item=>item.title)
      console.log(this.station)
    }).catch((error)=>{
      //エラー処理
      alert('エラーが発生しました')
      console.log('err:',error)
    })
    //6つのマスの内容を取得
    this.$axios.get('https://ito.nkmr.io/api/get_dice.php',{
      params:{
        gohan:1
      }
    }).then((response)=>{
      //apiの返答はresponseのdataに入っている
      console.log(response)
      //6マスの内容を配列に代入
      this.demeGohan = response.data
      console.log('status:',response.status)
    }).catch((error)=>{
      //エラー処理
      alert('エラーが発生しました')
      console.log('err:',error)
    })
    this.$axios.get('https://ito.nkmr.io/api/get_dice.php',{
      params:{
        gohan:0
      }
    }).then((response)=>{
      //apiの返答はresponseのdataに入っている
      console.log(response)
      //6マスの内容を配列に代入
      this.demeNoGohan = response.data
      this.deme = response.data
      console.log('status:',response.status)
    }).catch((error)=>{
      //エラー処理
      alert('エラーが発生しました')
      console.log('err:',error)
    })
  },
  beforeMounted() {
    console.log('a')
    //このページが作られたら↓
    this.$axios.get('https://ito.nkmr.io/api/get_spot_station.php', {})
    .then((response) => {
      console.log(response)
      this.station = response.data.map(item=>item.nearest_station)
      console.log(this.station)
    }).catch((error)=>{
      //エラー処理
      alert('エラーが発生しました')
      console.log('err:',error)
    })
    this.$axios.get('https://ito.nkmr.io/api/get_hazure.php', {
      params:{
        user_id:this.$store.state.user.uid
      }
    })
    .then((response) => {
      console.log(response)
      this.items = response.data.map(item=>item.title)
      console.log(this.station)
    }).catch((error)=>{
      //エラー処理
      alert('エラーが発生しました')
      console.log('err:',error)
    })
    //6つのマスの内容を取得
    this.$axios.get('https://ito.nkmr.io/api/get_dice.php',{
      params:{
        gohan:1
      }
    }).then((response)=>{
      //apiの返答はresponseのdataに入っている
      console.log(response)
      //6マスの内容を配列に代入
      this.demeGohan = response.data
      console.log('status:',response.status)
    }).catch((error)=>{
      //エラー処理
      alert('エラーが発生しました')
      console.log('err:',error)
    })
    this.$axios.get('https://ito.nkmr.io/api/get_dice.php',{
      params:{
        gohan:0
      }
    }).then((response)=>{
      //apiの返答はresponseのdataに入っている
      console.log(response)
      //6マスの内容を配列に代入
      this.demeNoGohan = response.data
      this.deme = response.data
      console.log('status:',response.status)
    }).catch((error)=>{
      //エラー処理
      alert('エラーが発生しました')
      console.log('err:',error)
    })
  },
  methods: {
    dice() {
      // サイコロの出目をランダムで出す
      this.diceNum = Math.floor(Math.random() * 6);
      // 出目に合わせた動画を変数に代入
      // this.diceGif = `https://yokoyama.nkmr.io/img/dice${this.diceNum + 1}.gif`;
      this.diceGif = `https://yokoyama.nkmr.io/img/dice${this.diceNum + 1}.mp4`;
      // オーバーレイを表示
      this.overlay = true;
      setTimeout(()=>{
        for(let i=0;i<this.demeBtn.length;i++){
          if(i==this.diceNum){
            this.demeBtn[i]=false
          }else{
            this.demeBtn[i]=true
          }
        }
      },1000)
    },
    toDetail(n){
      if(this.diceNum!=null){
        this.$store.commit('setCurrentSpot',this.deme[n].spot_id)
        this.$router.push('/detail')
      }
    },
    hazureSubmit(){
      if(this.diceNum==null){
        this.hazurelay=true
      }else{
        this.$store.commit('setCurrentSpot',-1)
        console.log(this.placeRandom)
        if(this.placeRandom){
          this.hazurePlace = this.station[Math.floor(Math.random()*this.station.length)]
        }
        this.$store.commit('setHazureDetail',{
          spot_name: this.hazureTitle,
          catch_copy: this.hazurePlace + "で" +this.hazureTitle,
          nearest_station: this.hazurePlace,
          access: "",
          img_url: 'https://1.bp.blogspot.com/-K6iP-tiNgNo/WeAFfVs4O-I/AAAAAAABHj0/CsxrLNoMeC8dC8JIr8LC1K73OaeqyinSwCLcBGAs/s800/kuji_hazure_man2.png',
          business_hours: "??",
          regular_holiday: "??",
          detail: "",
          longitude: "",
          latitude: "",
          save:this.atodeUse
        })
        this.$router.push('/detail')
      }
    }
  },
};
</script>
