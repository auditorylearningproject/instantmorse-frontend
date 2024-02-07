<template>
    <div class="wrapper">
        <header>
            <h1>Authentication Page</h1>
        </header>

        <section class='user_pass'>
            <div id="username">
                
            </div>
            <div id="password">

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
    background-color: #ff0000;
    color: #000000;
}
</style>