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
            メンバーになりました！
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

    export default {
        data() {
            return {
                // tripid: this.$route.params.tripid,
                tripid: this.$route.query.tripid
                // tripid: 35
            }
        },
        methods: {
            login() {
                const provider = new GoogleAuthProvider();
                const auth = getAuth();
                signInWithPopup(auth, provider);
            },
            addMember() {
                this.$axios
                    .get("https://karin.nkmr.io/ハッカソン5th/addMember.php", {
                        params: {
                            uid: this.$store.state.user.uid,
                            tripid: this.tripid
                        }
                    })
                    .then((response) => {
                        console.log("echo: "+response.data);
                        console.log(this.tripid)
                    })
            }
        },
        created() {
            const auth = getAuth();

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
                            this.addMember();
                        })
                }
            });

        }
    };
</script>

<style>
    img {
        width: 10vw;
        height: auto;
    }
</style>