import Axios from 'axios'

const state = () => ({
    allProductCategories: {},
    isProductCategories: {},
    getProductCategories: {},
    popularProductCategories: {},
});

const getters = {
    allProductCategories(state) {
        return state.allProductCategories
    },
    isProductCategories(state) {
        return state.isProductCategories
    },
    getProductCategories(state) {
        return state.getProducts
    },
    popularProductCategories(state) {
        return state.popularProductCategories
    },
};

const actions = {
    /**
     *
     * @param context
     * @param all
     * @returns {Promise<void>}
     */
    async allProductCategories(context, all = 'all') {
        await Axios.get(Axios.defaults.baseURL + `panel/product-categories?all=${all}`)
            .then(res => {
                const allProductCategories = res.data.data;
                context.commit('allProductCategories', allProductCategories);
            }).catch(err => {
                console.log(err)
            })
    },

    /**
     *
     * @param context
     */
    isProductCategories(context) {
        Axios.get(Axios.defaults.baseURL + 'product-categories').then(res => {
            const isProductCategories = res.data.data.product_categories;
            const popularProductCategories = res.data.data.popular_product_categories;
            context.commit('isProductCategories', isProductCategories);
            context.commit('popularProductCategories', popularProductCategories);
        }).catch(err => {
            console.log(err)
        })
    },
    getProductCategories(context) {
        Axios.get(Axios.defaults.baseURL + 'panel/product-categories').then(res => {
            const getProductCategories = res.data.data.data;
            context.commit('getProductCategories', getProductCategories)
        }).catch(err => {
            console.log(err)
        })
    },
    isProductCategoriesUpdate(context, payload) {
        const isUpdate = {
            id: payload.id,
            brand_id: payload.brand_id,
            title: payload.title,
            description: payload.description,
        };
        Axios.patch(Axios.defaults.baseURL + 'panel/product-categories' + payload.id, isUpdate)
            .then(res => {
                const getProductCategories = res.data.data.data;
                context.commit('getProductCategories', getProductCategories)
            }).catch(err => {
            console.log(err)
        })
    },
    isProductCategoriesCreate(context, payload) {
        const isUpdate = {
            brand_id: payload.brand_id,
            title: payload.title,
            description: payload.description,
        };
        Axios.post(Axios.defaults.baseURL + 'panel/product-categories', isUpdate)
            .then(res => {
                const getProductCategories = res.data.data.data;
                context.commit('getProductCategories', getProductCategories)
            }).catch(err => {
            console.log(err)
        })
    }
};

const mutations = {
    allProductCategories(state, payload) {
        state.allProductCategories = payload
    },
    isProductCategories(state, payload) {
        state.isProductCategories = payload
    },
    getProductCategories(state, payload) {
        state.getProductCategories = payload
    },
    popularProductCategories(state, payload) {
        state.popularProductCategories = payload
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
