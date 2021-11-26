<template>
  <div>
    <!-- ログインしてないとき -->
    <section v-if="!this.$store.state.user">
      <div class="d-flex justify-center ma-6">
        <v-btn @click="login()" color="primary">
          ログイン
        </v-btn>
      </div>
    </section>

    <!-- ログインしてるとき -->
    <section v-else>

      <!-- ログアウトボタン -->
      <div class="d-flex justify-space-between align-center ma-6">
        <v-btn @click="logout()">
          ログアウト
        </v-btn>

        <!-- アイコン -->
        <img :src="this.$store.state.user.photoURL" @click="jumpUser()" class="rounded-circle float-right" />
      </div>

      <!-- タイトル -->
      <p class="text-h3 d-flex justify-center font-weight-black">サイコロの旅</p>

      <!-- 路線選択 -->
      <div class="d-flex flex-column ma-12">

        <!-- <v-select :items="items" label="路線" outlined dense hide-details="false" class="my-2"></v-select> -->
        <v-select :items="items" label="スタート駅" outlined dense hide-details="false" class="my-2" v-model="startStation">
        </v-select>
        <!-- 駅：{{startStation}} -->
        <v-select :items="items" label="ゴール駅（任意）" outlined dense hide-details="false" class="my-2"
          v-model="goalStation"></v-select>
        <!-- 駅：{{goalStation}} -->

        <!-- タイムピッカー -->
        <v-dialog ref="dialog" v-model="modal2" :return-value.sync="time" persistent width="290px">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="time" label="終了時刻（任意）" prepend-icon="mdi-clock-time-four-outline" readonly
              v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-time-picker v-if="modal2" v-model="time" format="24hr" full-width>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal2 = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(time)">
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>


        <!-- QR -->
        <v-dialog transition="dialog-bottom-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-2 mb-6" @click="makeQR()" v-bind="attrs" v-on="on">
              メンバー追加
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <div class="d-flex justify-center my-4">
              <form method="GET">
                <vue-qrcode :value="QRurl" />
              </form>
            </div>
            <v-btn text @click="dialog.value = false">Close</v-btn>
          </template>
        </v-dialog>


        <v-card class="mb-6" outlined>
          <p class="mt-2 d-flex justify-center align-end">メンバー</p>
          <div class="d-flex justify-start overflow-x-auto">
            <div v-for="icon in icons" :key="icon">
              <img :src="icon" class="rounded-circle ma-4" />
            </div>
          <!-- </div> -->
          </div>
        </v-card>

        <section v-if="this.startStation!=''">
          <div class="d-flex justify-center">
            <v-btn @click="start()" color="primary" x-large>
              START!
            </v-btn>
          </div>
        </section>
        <section v-else>
          <div class="d-flex justify-center">
            <v-btn color="primary" disabled x-large>
              START!
            </v-btn>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
  import {
    getAuth,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
  } from "firebase/auth";
  import VueQrcode from "@chenfengyuan/vue-qrcode";


  export default {
    name: 'Top',
    components: {
      VueQrcode
    },
    data() {
      return {
        time: '',
        modal2: false,
        items: [],
        startStation: '',
        goalStation: '',
        QRurl: '',
        icons: [],
        loadRealtime: null
      }
    },
    methods: {
      login() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider);
      },
      logout() {
        const auth = getAuth();
        auth.signOut();
        clearInterval(this.loadRealtime);
      },
      jumpUser() {
        clearInterval(this.loadRealtime);
        setTimeout(()=>{
          this.$router.push('/user')
        }, 100);
      },
      addTrip() {
        // if (this.$store.state.tripid == null) {
        this.$axios.get('https://karin.nkmr.io/ハッカソン5th/addTrip.php', {
          params: {
            uid: this.$store.state.user.uid,
            // tripid: this.tripid,
            start: this.startStation,
            goal: this.goalStation,
            time: this.time
          }
        }).then((response) => {
          console.log("できた！");
          console.log(response.data)
          this.$store.commit("setTrip", {
            tripid: response.data.trip_id
          });
          console.log(this.$store.state.tripid.tripid);
          // this.loadMember();
        })
        // }
      },
      makeQR() {
        this.QRurl = 'https://karin.nkmr.io/hackathon5th/#/addMember/?tripid=' + this.$store.state.tripid.tripid;
      },
      loadMember() {
        if (this.$store.state.tripid != null) {
          console.log("アイコン！");
          this.$axios.get('https://karin.nkmr.io/ハッカソン5th/loadMember.php', {
            params: {
              tripid: this.$store.state.tripid.tripid
            }
          }).then((response) => {
            // console.log("アイコンロードするよ！");
            this.icons = (response.data).split(",");
            // console.log(response.data);
            console.log("icons:" + this.icons);
          })
        }
      },
      start() {
        // trip-tableに送ってDiceに遷移
        this.$axios.get("https://karin.nkmr.io/ハッカソン5th/addTrip.php", {
            params: {
              uid: this.$store.state.user.uid,
              // tripid: this.tripid,
              start: this.startStation,
              goal: this.goalStation,
              time: this.time
            }
          })
          .then((response) => {
            console.log("echo: " + response.data);
            console.log(this.tripid)
          })

        clearInterval(this.loadRealtime);
        setTimeout(()=>{
          this.$router.push('/dice')
        }, 100);
      }
    },
    created() {
      const auth = getAuth();

      // ログイン関係
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.$axios
            .get("https://karin.nkmr.io/ハッカソン5th/checkUser.php", {
              params: {
                name: user.displayName,
                uid: user.uid,
                photoURL: user.photoURL
              }
            })
            .then(() => {
              this.$store.commit("setUser", {
                name: user.displayName,
                uid: user.uid,
                photoURL: user.photoURL
              });
              console.log("ログインしました");
              console.log(this.$store.state.user.name);
              console.log(this.$store.state.user.uid);
              this.addTrip();
              this.loadRealtime = setInterval(this.loadMember.bind(this), 1000);
            })

          // 駅ロード
          this.$axios.get('https://ito.nkmr.io/api/get_spot_station.php', {})
            .then((response) => {
              for (let i = 0; i < response.data.length; i++) {
                this.items.push(response.data[i].nearest_station);
              }
              console.log("items:" + this.items);
            })
        } else {
          // ログアウト
          this.$store.commit("setUser", null);
          console.log("ログアウトしました");
        }
      });

    },
  };
</script>

<style>
  img {
    width: 10vw;
    height: auto;
  }

</style>