<template>
    <div id="app">
        <div class="container">
            <test-form></test-form>
        </div>
    </div>
</template>

<script>
    import TestForm from './components/Form'

    export default {
        name: 'app',
        components: {
            TestForm
        }
    }
</script>

<style lang="sass">
    $icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
    @import "~bootstrap-sass/assets/stylesheets/bootstrap";
</style>

<style>
    .form-group.required .control-label:after {
        content: "*";
        color: red;
    }
</style>
