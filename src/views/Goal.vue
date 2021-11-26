<template>
  <div id="Goal">
    <div class="ma-6">
      <p class="text-h3 d-flex justify-center font-weight-black">今日の旅</p>
      <p>今日の旅のタイトルを入力してね</p>
      <v-text-field v-model="title" :rules="nameRules" :counter="10" label="タイトル" required></v-text-field>

      <v-expansion-panels class="my-4">
        <v-expansion-panel>
          <v-expansion-panel-header>
            今日行った場所
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <!-- {{this.spots}} -->
            <!-- 駅とキャッチフレーズ取ってくる -->

            <v-list two-line class="item-list">
              <!-- 選択した時の色を設定します。 -->
              <v-list-item-group color="primary">
                <!-- リスト項目を定義します。 -->
                <div v-for="spot in spots" :key="spot[0]">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-h6 font-weight-black">{{spot[3]}}</v-list-item-title>
                      <v-list-item-title>{{spot[2]}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-list-item-group>
            </v-list>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- 移動距離は余力 -->
      <!-- <p>移動距離：{{ kyori }}km</p> -->
      <section v-if="this.title!=''">
        <div class="d-flex justify-center">
          <v-btn @click="saveTrip()">保存</v-btn>
        </div>
      </section>
      <section v-else>
        <div class="d-flex justify-center">
          <v-btn disabled x-large>
            保存
          </v-btn>
        </div>
      </section>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'Goal',
    data() {
      return {
        valid: false,
        title: '',
        nameRules: [
          v => !!v || 'タイトルを入力してください',
          v => v.length <= 10 || 'タイトルは10文字以内にしてください',
        ],
        kyori: 0,
        spotsid: [],
        spots: [],
        // catchCopy: []
      }
    },
    methods: {
      jumpUser() {
        setTimeout(()=>{
          this.$router.push('/user')
        }, 100);
      },
      loadSpotsid() {
        console.log(this.$store.state.tripid.tripid)
        // if (this.$store.state.tripid != null) {
        this.$axios.get('https://ito.nkmr.io/api/get_trip_spots.php', {
          params: {
            trip_id: this.$store.state.tripid.tripid
          }
        }).then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            this.spots.push([i, response.data[i].spot_id, response.data[i].spot_name, response.data[i].catch_copy]);
          }
          this.sortSpots()
          // this.loadSpots();
        })
      },
      loadSpots() {
        for (let k = 0; k < this.spotsid.length; k++) {
          this.$axios.get('https://ito.nkmr.io/api/get_detail.php', {
            params: {
              spot_id: this.spotsid[k]
            }
          }).then((response) => {
            console.log(response)
            this.spots.push([k, response.data[0].spot_id, response.data[0].spot_name, response.data[0].catch_copy]);
            if (k == this.spotsid.length - 1) {
              this.sortSpots();
            }
          })
        }
      },
      sortSpots() {
        // ソート
        this.spots.sort(function (a, b) {
          return (a[0] - b[0]);
        });
        console.log(this.spots);
      },
      saveTrip() {
        this.$axios.get('https://ito.nkmr.io/api/trip_api.php', {
          params: {
            trip_id: this.$store.state.tripid.tripid,
            title: this.title
          }
        }).then(() => {
          console.log("保存完了！")
        })
        this.jumpUser();
      }
    },
    created() {
      this.loadSpotsid();
    }
  }
</script>

<style scoped>
  .item-list {
    height: 40vh;
    overflow-y: auto;
  }
</style>