<template>
  <div id="User">
    <div class="d-flex justify-space-between align-center ma-6">
      <v-btn @click="back">サイコロの旅へ</v-btn>
    </div>
    <!-- storeからお名前とアイコンを持ってきて表示 -->
    <li>
      <img :src="this.$store.state.user.photoURL" class="rounded-circle" />
      <h1>{{ this.$store.state.user.name }}</h1>
    </li>
    <h3>旅履歴</h3>
    <!-- 旅の履歴のカードを作成 -->
    <v-col cols=auto v-for="n in title.length" :key="n">
      <v-card class="mx-auto" max-width="344">
        <v-card-text>
          <div>{{ time[n-1] }}</div>
          <p class="text-h4 text--primary">
            {{ title[n-1] }}
          </p>
          <p>-Member-</p>
            <v-row v-for="icon in icons[n-1]" :key="icon[0]" class="d-flex flex-nowrap justify-center overflow-x-auto">
              <div v-for="i in icon.length" :key="i">
                <img :src="icon[i-1]" class="rounded-circle float-right ma-4" />
              </div>
            </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </div>
</template>

<script>
  export default {
    name: 'User',
    data() {
      return {
        userid: "",
        username: "",
        time: [],
        timeAry: [],
        member: [],
        memberAry: [],
        title: [],
        test: [],
        icons: [],
        iconsAry: [],
        tripId: [],
        iconsList: [],
        counter: 0
      };
    },
    created() {
      //データ引き継ぎを確認する
      console.log("ユーザ情報:" + this.$store.state.user.uid)
      //このページが作られたらAPIを呼び出す
      this.$axios.get('https://ito.nkmr.io/api/get_trips.php', {
        params: {
          user_id: this.$store.state.user.uid
        }
      }).then((response) => {
        //this.test = response.data
        for (let i = 0; i < response.data.length; i++) {
          this.title.push(response.data[i].title);
          this.member.push(response.data[i].member);
          this.time.push(response.data[i].time);
          this.tripId.push(response.data[i].trip_id);
          //console.log(JSON.stringify(this.tripId));
          //console.log(i);
          //console.log(this.tripId);
        }
        this.loadMember();
        //console.log("取れてるか？"+ this.titles + ", " + this.members + ", " + this.times)
      }).catch((error) => {
        alert('エラーが発生しました')
        console.log('err:', error)
      });
    },
    methods: {
      back() {
        this.$router.push('/');
      },
      loadMember() {
        if (this.tripId != null) {
          console.log("アイコン！");
          console.log(this.tripId.length);
          //console.log(Object.keys(this.time).length);
          for (let i = 0; i < this.tripId.length; i++) {
            //console.log(this.tripId[i]);
            this.$axios.get('https://karin.nkmr.io/ハッカソン5th/loadMember.php', {
              params: {
                tripid: this.tripId[i]
              }
            }).then((response) => {
              console.log("アイコンロードするよ！");
              this.iconsAry = (response.data).split(",");
              // console.log(this.iconsAry);
              this.icons.push([i, this.iconsAry]);
              this.counter++;
              // console.log("counter:"+this.counter);
              if (this.counter == this.tripId.length) {
                this.sortArr();
              }
            })
          }
        }
      },
      // 並び替え
      sortArr() {
        console.log("icons:" + this.icons);
        this.icons.sort(function (a, b) {
          return (a[0] - b[0]);
        });
        console.log("iconsSorted:" + this.icons[0][1]);
        // for(let i=0;i<this.icons.length;i++){
        //   this.iconsList.push([i,(this.icons[i][1]).split(",")])
        // }
        // console.log("iconsList:" + this.iconsList);
      }
    }
  }
</script>

<style>
  h3 {
    text-align: center;
    padding: 40px 0px 10px 0px;
  }

  li {
    text-align: center;
    list-style: none;
  }
</style>