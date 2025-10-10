//pinia让不同组件之间共享数据
import { defineStore } from 'pinia';
import { ref } from 'vue';

function initState(){

}
export const useAllDataStore = defineStore('alldata', () => {
  const state = ref(initState())

  return {
    state,
   }
})