import { defineStore } from "pinia";

export const useAdminStore = defineStore("admin", {
    state: () => {
        return {
            id: 0,
            account: "",
            token: "",
            // isLogin: false,
        };
    },
    actions: {},
    getters: {},


});
