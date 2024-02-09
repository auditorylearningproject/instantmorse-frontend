<template>
    <div class="registration">
        <header>
            <h1>Registration Page</h1>
        </header>

        <section class='user_pass'>
            <div id="username">
                <label for="user">Username:</label><br>
                <input id="user" name="user" type="text"><br>
            </div>
            <div id="password">
                <label for="pass">Password</label><br>
                <input id="pass" name="pass" type="text"><br><br>
            </div>
        </section>
        <section class="submitButton">
            <div id="buttons">
                <button class="submit" @click="submit">Submit</button>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
function submit() {

}
</script>

<style scoped>
header {
    height: 70px;
}

.user-pass {
    box-sizing: border-box;
}

.submitButton {
    color: #000000;
}
</style>