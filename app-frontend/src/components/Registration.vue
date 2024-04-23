<template>
    <main>
        <header>
            Registration Page
        </header>
        <div class="registration">
            <form @submit.prevent="register">
                <input v-model="userName" class="user" id="user" type="text" placeholder="Username" required><br>
                <input v-model="passWord" class="pass" id="pass" type="text" placeholder="Password" required><br><br>
                <button class="submit">Submit</button> <br><br>
                <p>{{ exceptionText }}</p>
            </form>
        </div>
        <div class="toAuthentication">
            <form @submit.prevent="linkToAuthenticate">
                <button class="authenticate">Already a User? Click Here!</button>
            </form>
        </div>
    </main>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios';
import { ref } from 'vue';
    export default {
        data() {
            return {
                userName: '',
                passWord: '',
                exceptionText: ref('')
            };
        },
        methods: {
            async register() {
                console.log("Submit was clicked. Registration in progress.");
                const url = location.origin;
                try {
                    const response = await axios.post(url+"/api/user/create", {
                        username: this.userName,
                        password: this.passWord,
                    },
                    {
                       timeout: 5000,
                    })
                    console.log(response);
                    if (response.data !== null) { //pull from database
                        this.$router.push('/authentication');
                        console.log("Rerouting to the login page!")
                    } else {
                        location.reload();
                    }
                    } catch (err: any) {
                        if (err.code === 'ECONNABORTED') {
                        console.log('The request timed out.');
                        } else {
                        this.exceptionText = `${err} (If error 409, an account with that name already exists!)`;
                        }
                }
            },
            async linkToAuthenticate() {
                console.log("Authentication was clicked. Rerouting to the Authentication Page");
                try {
                    this.$router.push('/authentication');
                } catch(error) {
                    console.error("Error switching to authentication page", error);
                }
            },
        },
    };
</script>
<style scoped>
header {
    margin-bottom: 2rem;
    text-align: center;
    font-size: xx-large;
}
.registration {
    border: solid;
    display: block;
    text-align: center;
    margin-bottom: 1rem;
    max-width: 50rem;
    margin-left: 40%;
    margin-right: 40%;
    background-color: #282c32;
    border-radius: .3rem;
    border-color: rgb(0, 0, 0);
}
.toAuthentication {
    border: solid;
    display: block;
    text-align: center;
    margin-bottom: 1rem;
    max-width: 50rem;
    margin-left: 40%;
    margin-right: 40%;
    background-color: #282c32;
    border-radius: .3rem;
    color: #4680d1;;
    border-color: rgb(0, 0, 0);
}
.submit {
    border: solid;
    text-align: center;
    max-width: 50rem;
    margin-left: 25%;
    margin-right: 25%;
    background-color: #4680d1;
    border-radius: .3rem;
    border-width: .2cap;
}
.user, .pass {
    margin-top: 1rem;
    border: solid;
    border-width: .15rem;
    border-radius: .3rem;
    border-color: rgb(61, 139, 248);
    background-color: #282c32;
    color: rgb(255, 255, 255);
}
</style>