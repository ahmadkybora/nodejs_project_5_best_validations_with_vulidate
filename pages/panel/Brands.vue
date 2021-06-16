<template>
    <div class="container">
        <!--UserRegister-->
        <BrandRegister/>
        <!--//-->
        <div class="row">
            <div class="col-md-12 text-center">
                <div class="row">
                    <div class="col-md-4">
                        <h3>Brands Register</h3>
                    </div>
                    <div class="col-md-3 offset-5">
                        <button @click="registerUser()" class="btn btn-success">
                            <span><i class="fa fa-user-plus"></i>Register</span>
                        </button>
                        <button id="close" ref="closeRegister" class="btn btn-danger" @click="closeModal()">close
                        </button>
                    </div>
                </div>
            </div>
            <!--//-->
            <div>
                <form class="form-inline" @submit.prevent="onFullTextSearch()">
                    <div class="form-group">
                        <input type="text"
                               v-model="full_text_search"
                               name="full_text_search"
                               id="full-text-search"
                               class="form-control"
                               placeholder="Full Name">
                    </div>
                    <div class="form-group">
                        <button type="submit" class="form-control btn btn-sm btn-success"><i
                                class="fas fa-search"></i></button>
                    </div>
                </form>
            </div>
            <!--//-->
            <table class="table table-striped tab-content table-bordered table-responsive">
                <thead class="text-center">
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Employee</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Created At / Updated At</th>
                    <th>Option</th>
                </tr>
                </thead>
                <tbody class="text-center">
                <tr v-for="(brand, index) in brands.data" :key="brand.id">
                    <td>{{ index }}</td>
                    <td v-text="brand.name"></td>
                    <td v-text="brand.description"></td>
                    <td v-text="brand.Employee.username"></td>
                    <td>
                        <img class="rounded-circle" :src="brand.image" style="width: 50px; height: 50px">
                    </td>
                    <td>
                        <button v-if="brand.state === 'ACTIVE'" class="btn btn-success btn-sm disabled"
                                v-text="brand.state">ACTIVE
                        </button>
                        <button v-if="brand.state === 'INACTIVE'" class="btn btn-warning btn-sm disabled"
                                v-text="brand.state">INACTIVE
                        </button>
                        <button v-if="brand.state === 'SUSPENDED'" class="btn btn-secondary btn-sm disabled"
                                v-text="brand.state">SUSPENDED
                        </button>
                        <button v-if="brand.state === 'PENDING'" class="btn btn-danger btn-sm disabled"
                                v-text="brand.state">PENDING
                        </button>
                    </td>
                    <td>{{ brand.createdAt + ' ' + brand.updatedAt }}</td>
                    <td>
                        <a @click="brandShow(brand.id)" data-toggle="modal" data-target="#exampleModal">
                            <i class="fas fa-eye text-primary"></i>
                        </a>

                        <BrandShow :showBrand="showBrand"></BrandShow>
                        /
                        <a href="#register" @click="brandEdit(brand.id)"><i class="fas fa-pen text-success"></i></a>
                        /
                        <a @click="brandDelete(brand.id)"><i class="fas fa-trash text-danger"></i></a>
                    </td>
                </tr>
                </tbody>
                <thead class="text-center">
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Employee</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Created At / Updated At</th>
                    <th>Option</th>
                </tr>
                </thead>
            </table>

        </div>
    </div>

</template>

<script>
    import $ from 'jquery';
    import BrandRegister from '../../components/panel/BrandRegister';
    import BrandShow from '../../components/panel/modal/BrandShow';
    import {BrandService} from '../../services/panel/BrandService';
    import {mapState} from 'vuex';
    import HelperFunctions from '../../helpers/HelperFunctions';

    window.$ = $;
    export default {
        middleware: 'checkAuthEmployee',
        layout: 'panel',
        name: "Users",
        components: {BrandRegister, BrandShow},
        data() {
            return {
                token: JSON.parse(window.localStorage.getItem('token')),
                state_search: '',
                full_text_search: '',
                full_name_search: '',
                username_search: '',
                email_search: '',
                search: '',
                dialog: '',
                page: 1,
                employee: {},
                employees: {},
                getUsers: {},
                pagination: {
                    total: 0,
                    per_page: 0,
                    last_page: 0,
                    from: 0,
                    to: 0,
                    current_page: 1
                },
                offset: 4,
                name: '',
                description: '',
                showBrand: {
                    title: '',
                    description: '',
                }
            }
        },
        mounted() {
            return this.$store.dispatch('Brands/getBrands');
        },
        computed: {
            ...mapState({
                brands: state => state.Brands.getBrands,
                //showBrand: state => state.Brands.isUser,
                editBrand: state => state.Brands.isUser,
                //deleteUser: state => state.Users.isUser,
            })
        },
        methods: {
            closeModal() {
                HelperFunctions.closeModal();
            },
            userAll() {
                this.getUsers = BrandService.All()
            },
            userPaginate() {

            },
            brandShow(brand) {
                this.showBrand = {
                    title: brand.title,
                    description: brand.description,
                }
            },
            brandEdit(id) {
                return this.$store.dispatch('Brands/editBrand', {id});
            },
            brandDelete(id) {
                return this.$store.dispatch('Brands/deleteBrand', {id});
            },
            registerUser() {
                $('#user-register').toggle();
            },
            onFullTextSearch() {
                const full_text_search = this.full_text_search;
                return this.$store.dispatch('Brands/searchBrand', {full_text_search});
            },
            onUserNameSearch() {
                return BrandService.onUserNameSearch();
            },
            onEmailSearch() {
                return BrandService.onEmailSearch();
            },
            onSearch(search) {
                return BrandService.onSearch(search)
            },
        }
    }
</script>

<style scoped>

</style>
