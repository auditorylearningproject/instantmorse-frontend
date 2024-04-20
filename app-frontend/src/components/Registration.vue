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
        },
    };
</script>
<style scoped>
header {
    height: 70px;
    text-align: center;
}
header {
    text-align: center;
    font-size: xx-large;
}
.registration {
    border-color: black;
    border: solid;
    display: block;
    text-align: center;
    margin-bottom: 1rem;
    max-width: 50rem;
    margin-left: 40%;
    margin-right: 40%;
}
.submit {
    border-color: black;
    border: solid;
    text-align: center;
    max-width: 50rem;
    background-color: #4680d1;
}
.user, .pass {
    margin-top: 1rem;
    border-color: black;
    border: solid;
    border-width: .15rem;
}
</style>