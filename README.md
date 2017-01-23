## Install ##
```
npm install vue-sails.io
```

## Requirements ##
At the moment Vuex is required to work

## Use ##
### Use the plugin ###
```
import VueSailsIO from 'vue-sails.io'
Vue.use(VueSailsIO, 'http://localhost:1337')
```
### In a component ###
note: pug is used as template engine
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
      method: 'get', // required
      url:  '/user', // optional, defaults to '/' + [method name] (this case '/user')
      mutation: 'users', // optional, defaults to [method name], can be false to not create listener
      remove: false, // optional, defaults to true, remove the listener when component is destroyed
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

