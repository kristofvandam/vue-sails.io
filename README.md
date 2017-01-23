## Install ##
```
npm install vue-sails.io --save
```

## Requirements ##
At the moment Vuex is required to work

## Use ##
### Use the plugin ###
In the main file where you bootstrap most of your plugin add 'VueSailsIO'
```
import VueSailsIO from 'vue-sails.io'
Vue.use(VueSailsIO, 'http://localhost:1337')
```
### In a Vue-component ###
Add the object 'sails', create one or more named objects,  
```
<template lang="pug">
section.container
  .columns
    .column.is-narrow
      form(@submit.prevent="user({ username: username })")
        p.control.has-addons
          input.input(type="text" v-model="username" placeholder="Text")
          button.button(type="submit") Send
    .column
      .box
        article.media(v-for="user of users") {{ user.username }}
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([ 'users' ])
  },
  sails: {
    user: {
      method: 'get',      // required, options are: get, post, put, delete
      url:  '/user',      // optional, defaults to '/' + [the object name] (this case '/user')
      mutation: 'users',  // optional, defaults to [the object name], can be false to not create a listener
      remove: false       // optional, defaults to true, remove the listener when component is destroyed
    }
  },
  data () {
    return {
      username: ''
    }
  }
}
</script>
```
### Manually ###
The sails object is mapped to 'this.$sails'

The following functions are exposed:

1. this.$sails.addListener(socket, mutation)
2. this.$sails.removeListener(socket)
3. this.$sails.hasListener(socket)
4. this.$sails.socket.get(url, data) // or post, delete, put
5. this.$sails.socket.on(url, function(data) {})
