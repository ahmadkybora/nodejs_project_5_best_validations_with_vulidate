<template>
    <!--//-->
    <nav class="navbar navbar-expand-lg navbar-light shadow-md">
        <a href="" class="navbar-brand text-warning ml-3">
            <i class="fas fa-dove" style="font-size: 25px"></i>
        </a>
        <!--//-->
        <form action="" class="form-inline w-50 m-auto">
            <div class="input-group w-100">
                <input type="text" v-model="search" class="form-control" placeholder="Search...">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </form>
        <!--//-->
        <div class="row">
            <div v-if="isAuthenticated" class="offset-lg-6 col-lg-6 offset-md-6 col-md-6">
                <button @click="isUserLogout()" class="btn btn-warning" style="border-radius: 15px;">Logout</button>
                <button class="btn btn-success" style="border-radius: 15px;">Profile</button>
                <nuxt-link to="/profile/cart"><i class="fa fa-cart-plus fa-2x text-secondary" aria-hidden="true"></i>
                </nuxt-link>
            </div>
            <div v-else>
                <nuxt-link class="bbtn btn" to="/login">Login</nuxt-link>
                <nuxt-link class="bbtn btn" to="/register">Register</nuxt-link>
            </div>
        </div>
        <!--//-->
    </nav>
    <!--//-->
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'Navbar',
        data() {
            return {
                search: '',
            }
        },
        computed: {
            ...mapState({
                fullName: state => state.Auth.isUser,
                isAuthenticated: state => state.Auth.tokenUser
            }),
        },
        methods: {
            isUserLogout() {
                return this.$store.dispatch('Auth/isUserLogout');
            }
        },
        mounted() {
            //console.log(this.fullName)
        }
    }
</script>

<style scoped>
    .container-fluid {
        height: 100px;
    }

    .bbtn {
        background-color: aquamarine;
        border-radius: 15px;
    }
    .input-group > .form-control, .input-group > .form-control-plaintext, .input-group > .custom-select, .input-group > .custom-file {
        flex: auto;
    }
</style>
