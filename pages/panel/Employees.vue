<template>
    <div class="container">
        <!--UserRegister-->
        <EmployeeRegister :employee="employee" :editMode="editMode"></EmployeeRegister>
        <!--//-->
        <div class="row">
            <!--//-->
            <div class="col-md-12 text-center">
                <div class="row">
                    <div class="col-md-4">
                        <h3>Employee Register</h3>
                    </div>
                    <div class="col-md-3 offset-5">
                        <button @click="registerEmployee()" class="btn btn-success">
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
                    <th>Full Name</th>
                    <th>UserName</th>
                    <th>Email</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Created At / Updated At</th>
                    <th>Option</th>
                </tr>
                </thead>
                <tbody class="text-center">
                <tr v-for="(employee, index) in employees" :key="employee.id">
                    <td>{{ index }}</td>
                    <td>{{ employee.first_name + ' ' + employee.last_name }}</td>
                    <td v-text="employee.username"></td>
                    <td v-text="employee.email"></td>
                    <td>
                        <img class="rounded-circle" :src="employee.image" style="width: 50px; height: 50px">
                    </td>
                    <td>
                        <button v-if="employee.state === 'ACTIVE'" class="btn btn-success btn-sm disabled"
                                v-text="employee.state">ACTIVE
                        </button>
                        <button v-if="employee.state === 'INACTIVE'" class="btn btn-warning btn-sm disabled"
                                v-text="employee.state">INACTIVE
                        </button>
                        <button v-if="employee.state === 'SUSPENDED'" class="btn btn-secondary btn-sm disabled"
                                v-text="employee.state">SUSPENDED
                        </button>
                        <button v-if="employee.state === 'PENDING'" class="btn btn-danger btn-sm disabled"
                                v-text="employee.state">PENDING
                        </button>
                    </td>
                    <td>{{ employee.createdAt + ' ' + employee.updatedAt }}</td>
                    <td>
                        <a @click="employeeShow(employee)" data-toggle="modal" data-target="#exampleModal">
                            <i class="fas fa-eye text-primary"></i>
                        </a>
                        <EmployeeShow :showEmployee="showEmployee"></EmployeeShow>
                        /
                        <a href="#register" @click="employeeEdit(employee)"><i class="fas fa-pen text-success"></i></a>
                        /
                        <a @click="employeeDelete(employee.id)"><i class="fas fa-trash text-danger"></i></a>
                    </td>
                </tr>
                </tbody>
                <thead class="text-center">
                <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>UserName</th>
                    <th>Email</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Created At / Updated At</th>
                    <th>Option</th>
                </tr>
                </thead>
            </table>
            <!---------pagination----------->
            <nav aria-label="...">
                <ul class="pagination pagination-sm"
                    v-if="">
                    <li v-if="pagination.current_page > 1"
                        class="page-item">
                        <a @click.prevent="changePage(pagination.current_page - 1)"
                           disabled="disabled"
                           class="page-link" href="#" tabindex="-1">
                            Previous
                        </a>
                    </li>
                    <li v-for="page in pages"
                        :key="page === pagination.current_page"
                        id="colorBtn"
                        class="page-item">
                        <a @click.prevent="changePage(page)" class="page-link" href="#">{{ page }}</a>
                    </li>
                    <li v-if="pagination.current_page < pagination.last_page" class="page-item">
                        <a @click.prevent="changePage(pagination.current_page + 1)" class="page-link"
                           href="#">Next</a>
                    </li>
                </ul>
            </nav>
            <!---------pagination----------->
        </div>
    </div>

</template>

<script>
    import $ from 'jquery';
    import EmployeeRegister from '../../components/panel/EmployeeRegister';
    import EmployeeShow from '../../components/panel/modal/EmployeeShow';
    import {EmployeeService} from '../../services/panel/EmployeeService';
    import {mapState} from 'vuex'
    import HelperFunctions from '../../helpers/HelperFunctions';
    import Axios from 'axios';

    window.$ = $;
    export default {
        middleware: 'checkAuthEmployee',
        layout: 'panel',
        name: "Users",
        components: {EmployeeRegister, EmployeeShow},
        data() {
            return {
                token: window.localStorage.getItem('token-employee'),
                state_search: '',
                full_text_search: '',
                username_search: '',
                email_search: '',
                search: '',
                dialog: '',
                page: 1,
                pagination: {
                    total: 0,
                    per_page: 0,
                    last_page: 0,
                    from: 0,
                    to: 0,
                    current_page: 1
                },
                offset: 4,
                blue: 'text-primary',
                name: '',
                description: '',
                employee: '',
                employees: {},
                employeeData: [],
                editMode: false,
                showEmployee: {
                    first_name: '',
                    last_name: '',
                    username: '',
                    email: ''
                }
            }
        },
        mounted() {
            this.getEmployees();
            return this.$store.dispatch('Employees/getEmployees');
        },
        computed: {
            ...mapState({
                getPro: {
                    get() {
                        return state => state.Employees.getEmployees
                    },
                    set: function (getPro) {
                        this.employees = getPro.data;
                        this.pagination = getPro.getEmployees;
                    },
                },
                //employees: state => state.Employees.getEmployees,
                showUser: state => state.Users.isUser,
                editUser: state => state.Users.isUser,
                //deleteUser: state => state.Users.isUser,
            }),
            pages() {
                let pagesArray = [];
                var form = this.pagination.current_page - this.offset;
                if (form < 1) {
                    form = 1
                }
                var to = form + (this.offset * 2);
                if (to >= this.pagination.last_page) {
                    to = this.pagination.last_page;
                }
                while (form <= to) {
                    pagesArray.push(form);
                    form++;
                }
                return pagesArray;
            },
        },
        methods: {
            changePage(page) {
                this.pagination.current_page = page;
                /*if (this.pagination.current_page === page) {
                    $('#colorBtn').addClass('active');
                }else{
                    $('nav.ul li.active').removeClass('active');
                }*/
                this.getEmployees(page);
            },
            getEmployees(page = 1) {
                Axios.get(Axios.defaults.baseURL + `panel/employees?page= ${page}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                    .then((res) => {
                        this.pagination.per_page = res.data.data.per_page;
                        this.pagination.last_page = res.data.data.last_page;
                        this.pagination.from = res.data.data.from;
                        this.pagination.to = res.data.data.to;
                        this.pagination.current_page = res.data.data.current_page;
                        this.pagination.total = res.data.data.total;
                        this.employees = res.data.data.data;
                    })
                    .catch(() => {
                        console.log('handle server error from here');
                    });
            },
            closeModal() {
                HelperFunctions.closeModal();
            },
            employeeAll() {
                this.getUsers = EmployeeService.EmployeeAll()
            },
            employeePaginate() {
                axios.get(axios.defaults.baseURL + 'panel/employee', {
                    headers: {
                        headers: {
                            'Authorization': 'Bearer ' + this.token,
                            'Content_Type': 'application/json'
                        }
                    }
                })
                    .then(res => {
                        this.employeeData = res.data;
                        console.log(this.employeeData);
                    });
            },
            employeeShow(employee) {
                this.showEmployee = {
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    username: employee.username,
                    email: employee.email
                }
            },
            employeeEdit(employee) {
                this.editMode = true;
                this.employee = employee;
            },
            employeeDelete(id) {
                return this.$store.dispatch('Employees/deleteEmployee', {id});
            },
            registerEmployee() {
                this.editMode = false;
                this.employee = '';
                $('#user-register').toggle();
            },
            onFullTextSearch() {
                const full_text_search = this.full_text_search;
                return this.$store.dispatch('Employees/searchEmployee', {full_text_search});
            },
            onUserNameSearch() {
                return EmployeeService.onUserNameSearch();
            },
            onEmailSearch() {
                return EmployeeService.onEmailSearch();
            },
            onSearch(search) {
                return EmployeeService.onSearch(search)
            },
        }
    }
</script>

<style scoped>

</style>
