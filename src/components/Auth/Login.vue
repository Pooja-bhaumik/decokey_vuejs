<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{ $t('message.loginForm') }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="form" validation>
              <v-text-field
                prepend-icon=""
                name="login"
                label="login"
                type="text"
                v-model="login"
                :rules="loginRulse"
                autofocus
              ></v-text-field>
              <v-text-field
                id="password"
                prepend-icon=""
                name="password"
                label="Password"
                type="password"
                :rules="passwordRulse"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="onSubmit()"
              :disabled="!valid"
            >{{ $t('buttons.login') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      login: '',
      password: '',
      valid: false,
      loginRulse: [
        v => !!v || 'Login is required'
      ],
      passwordRulse: [
        v => !!v || 'Password is required'
      ]
    }
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const user = {
          login: this.login,
          password: this.password
        }
        this.$store.dispatch('login', user)
      }
    }
  }
}
</script>
