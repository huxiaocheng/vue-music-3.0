import Vue from 'vue';
import Confirm from './confirm';

let newInstance;
const ConfirmInstance = Vue.extend(Confirm);
const initInstance = () => {
  newInstance = new ConfirmInstance();
  document.body.appendChild(newInstance.$mount().$el);
}

export default options => {
  if (!newInstance) {
    initInstance();
  }
  Object.assign(newInstance, options);
  return newInstance.show(() => {
    newInstance = null;
  }).then(confirm => {
    return Promise.resolve(confirm);
  }).catch(cancel => {
    return Promise.reject(cancel)
  })
}
